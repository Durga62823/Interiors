import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, action, className }: PageHeaderProps) {
  const content = children || action;
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", className)}
    >
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
      </div>
      {content && (
        <div className="flex items-center gap-3">
          {content}
        </div>
      )}
    </motion.div>
  );
}
