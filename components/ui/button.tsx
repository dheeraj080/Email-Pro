import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-500/80 border-t-white/20 shadow-md active:scale-[0.97] transition-all duration-150 cubic-bezier(0.2,0,0,1)',
    secondary: 'bg-[#12141c] text-indigo-400 border border-[#1f222e] border-t-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/50 shadow-sm active:scale-[0.97] transition-all duration-150 cubic-bezier(0.2,0,0,1)',
    outline: 'bg-[#0c0d12] border border-[#1f222e] border-t-white/10 text-white hover:bg-[#12141c] hover:border-neutral-700 shadow-sm active:scale-[0.97] transition-all duration-150 cubic-bezier(0.2,0,0,1)',
    ghost: 'text-neutral-400 hover:text-white hover:bg-[#12141c] active:scale-[0.97] transition-all duration-150 cubic-bezier(0.2,0,0,1)',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 border border-rose-500/80 border-t-white/20 shadow-md active:scale-[0.97] transition-all duration-150 cubic-bezier(0.2,0,0,1)',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-bold rounded-lg',
    md: 'px-4 py-2 text-xs font-bold rounded-xl',
    lg: 'px-6 py-3 text-sm font-bold rounded-2xl',
    icon: 'p-2.5 rounded-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none outline-none focus:ring-4 focus:ring-powder-blue-500/10',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
}
