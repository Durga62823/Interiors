import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  folder?: string;
}

export function ImageUploader({ 
  value, 
  onChange, 
  onRemove, 
  accept = "image/jpeg, image/png, image/webp", 
  maxSizeMB = 5,
  className,
  folder = 'uploads'
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be less than ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      onChange(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = async () => {
    if (value && value.includes('/storage/v1/object/public/images/')) {
      try {
        const path = value.split('/storage/v1/object/public/images/')[1];
        if (path) {
          await supabase.storage.from('images').remove([path]);
        }
      } catch (err) {
        console.error('Failed to remove image', err);
      }
    }
    
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video flex items-center justify-center group">
          <img src={value} alt="Uploaded preview" className="max-w-full max-h-full object-contain" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            "rounded-lg border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-colors aspect-video bg-muted/20 hover:bg-muted/40",
            uploading ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            isDragging ? "border-gold bg-gold/5" : "border-muted-foreground/25 hover:border-gold/50"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept={accept}
            className="hidden"
            disabled={uploading}
          />
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
            {uploading ? (
              <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div>
          <p className="font-medium mb-1">
            {uploading ? 'Uploading...' : 'Click or drag image to upload'}
          </p>
          <p className="text-xs text-muted-foreground">SVG, PNG, JPG or WEBP (max. {maxSizeMB}MB)</p>
        </div>
      )}
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
