import { cn } from '@/lib/utils';
import { LeadStatus } from '@/types/admin';

interface StatusBadgeProps {
  status: LeadStatus | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' },
  contacted: { label: 'Contacted', className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' },
  meeting_scheduled: { label: 'Meeting Scheduled', className: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400' },
  converted: { label: 'Converted', className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as string] || { label: status, className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300' };
  
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className, className)}>
      {config.label}
    </span>
  );
}
