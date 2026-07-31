import { cn } from '@/lib/utils';

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-xl border p-6 flex flex-col animate-pulse", className)}>
      <div className="flex items-center justify-between pb-2">
        <div className="h-4 bg-muted rounded w-1/3"></div>
        <div className="h-10 w-10 rounded-full bg-muted"></div>
      </div>
      <div className="h-8 bg-muted rounded w-1/2 mt-2"></div>
      <div className="h-3 bg-muted rounded w-1/4 mt-3"></div>
    </div>
  );
}

export function TableSkeleton({ columns = 5, rows = 5, className }: { columns?: number, rows?: number, className?: string }) {
  return (
    <div className={cn("bg-card rounded-xl border w-full overflow-hidden animate-pulse", className)}>
      <div className="flex items-center border-b p-4 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded flex-1"></div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center p-4 gap-4 border-b last:border-0">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-4 bg-muted/60 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton({ fields = 4, className }: { fields?: number, className?: string }) {
  return (
    <div className={cn("space-y-6 animate-pulse", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}

export const LoadingSkeleton = TableSkeleton;
