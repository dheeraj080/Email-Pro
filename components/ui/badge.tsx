import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    neutral: 'bg-[#12141c] text-neutral-300 border-[#1f222e]',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    info: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
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
