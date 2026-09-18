import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-fg-muted ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-fg-muted group-focus-within:text-accent transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-surface-raised border border-border-base rounded-xl py-2.5 px-4 text-xs text-fg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-fg-muted',
            icon && 'pl-11',
            error && 'border-danger focus:ring-danger/20 focus:border-danger',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-danger ml-1">{error}</p>}
    </div>
  );
}
