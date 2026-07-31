import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: any;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  } | ReactNode;
  className?: string;
}

export function EmptyState({ icon: IconComponent, title, description, action, className }: EmptyStateProps) {
  const isActionObject = action && typeof action === 'object' && 'label' in action && 'onClick' in action;

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-[300px]", className)}>
      <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        {IconComponent ? <IconComponent className="h-8 w-8 text-muted-foreground/50" /> : null}
      </div>
      <h3 className="font-display text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {isActionObject ? (
        <button
          onClick={(action as { label: string; onClick: () => void }).onClick}
          className="inline-flex items-center justify-center rounded-md bg-gold px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
        >
          {(action as { label: string; onClick: () => void }).label}
        </button>
      ) : (
        (action as ReactNode)
      )}
    </div>
  );
}
