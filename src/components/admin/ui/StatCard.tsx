import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: any;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

export function StatCard({ title, value, icon, trend, description, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("bg-card rounded-xl border shadow-sm p-6", className)}
    >
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <div className="font-display text-3xl font-semibold">{value}</div>
        {trend && (
          <span className={cn("flex items-center text-sm font-medium", trend.isPositive ? "text-green-600" : "text-red-600")}>
            {trend.isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
    </motion.div>
  );
}
