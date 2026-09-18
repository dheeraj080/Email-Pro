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
    primary: 'bg-accent text-accent-fg hover:bg-accent-hover shadow-sm active:scale-[0.97] transition-all duration-150',
    secondary: 'bg-surface-raised text-accent border border-border-base hover:bg-surface-hover hover:border-accent/40 shadow-xs active:scale-[0.97] transition-all duration-150',
    outline: 'bg-surface border border-border-base text-fg hover:bg-surface-hover hover:border-border-strong shadow-xs active:scale-[0.97] transition-all duration-150',
    ghost: 'text-fg-muted hover:text-fg hover:bg-surface-hover active:scale-[0.97] transition-all duration-150',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-sm active:scale-[0.97] transition-all duration-150',
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
