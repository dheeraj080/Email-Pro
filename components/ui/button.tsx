import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  asChild?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  asChild = false,
  children, 
  ...props 
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const variants = {
    primary: 'bg-ink-black-900 text-white hover:bg-ink-black-800 shadow-sm active:scale-[0.98]',
    secondary: 'bg-powder-blue-500 text-white hover:bg-powder-blue-600 shadow-sm active:scale-[0.98]',
    outline: 'bg-white border border-ink-black-100 text-ink-black-900 hover:bg-alabaster-grey-50 shadow-sm active:scale-[0.98]',
    ghost: 'text-ink-black-400 hover:text-ink-black-900 hover:bg-alabaster-grey-100 active:scale-[0.98]',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-bold rounded-lg',
    md: 'px-4 py-2 text-xs font-bold rounded-xl',
    lg: 'px-6 py-3 text-sm font-bold rounded-2xl',
    icon: 'p-2.5 rounded-lg',
  };

  return (
    <Comp
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
    </Comp>
  );
}
