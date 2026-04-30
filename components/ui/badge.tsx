import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    neutral: 'bg-alabaster-grey-100 text-ink-black-500 border-ink-black-50',
    success: 'bg-green-50 text-green-600 border-green-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    error: 'bg-red-50 text-red-600 border-red-100',
    info: 'bg-powder-blue-50 text-powder-blue-600 border-powder-blue-100',
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
