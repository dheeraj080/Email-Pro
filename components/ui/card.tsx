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
      'bg-white border border-ink-black-100 rounded-3xl p-6 shadow-sm overflow-hidden',
      hoverable && 'hover:shadow-xl hover:border-ink-black-200 transition-all cursor-pointer',
      className
    )}>
      {children}
    </div>
  );
}
