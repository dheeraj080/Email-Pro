import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = false }: CardProps) {
  return (
    <div className={cn(
      'bg-surface border border-border-base text-fg rounded-2xl p-6 shadow-sm overflow-hidden',
      hoverable && 'hover:bg-surface-hover hover:border-border-strong transition-all cursor-pointer',
      className
    )}>
      {children}
    </div>
  );
}
