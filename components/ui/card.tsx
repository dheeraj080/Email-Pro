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
      'bg-[#0c0d12] border border-[#1f222e] text-white rounded-2xl p-6 shadow-sm overflow-hidden',
      hoverable && 'hover:bg-[#12141c] hover:border-neutral-700 transition-all cursor-pointer',
      className
    )}>
      {children}
    </div>
  );
}
