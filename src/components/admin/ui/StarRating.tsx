import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value?: number;
  rating?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8'
};

export function StarRating({ value, rating, onChange, readonly = false, size = 'md', className }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const actualValue = value ?? rating ?? 0;

  const displayValue = hover !== null ? hover : actualValue;

  return (
    <div className={cn("flex items-center gap-1", className)} onMouseLeave={() => !readonly && setHover(null)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={cn(
            "transition-colors focus:outline-none",
            readonly ? "cursor-default" : "cursor-pointer"
          )}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
        >
          <Star 
            className={cn(
              sizeConfig[size],
              star <= displayValue 
                ? "fill-gold text-gold" 
                : "text-muted-foreground/30"
            )} 
          />
        </button>
      ))}
    </div>
  );
}
