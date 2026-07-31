import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <div className={cn("bg-card rounded-xl border p-6 flex flex-col", className)}>
      <div className="mb-6">
        <h3 className="font-display text-lg font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        {children}
      </div>
    </div>
  );
}
