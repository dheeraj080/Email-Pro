import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    neutral: 'bg-surface-raised text-fg-secondary border-border-base',
    success: 'bg-success-bg text-success border-success-border',
    warning: 'bg-warning-bg text-warning border-warning-border',
    error: 'bg-danger-bg text-danger border-danger-border',
    info: 'bg-accent-muted text-accent border-accent-border',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
