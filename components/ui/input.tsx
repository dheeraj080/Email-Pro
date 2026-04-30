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
        <label className="text-[10px] font-black uppercase tracking-widest text-ink-black-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-black-300 group-focus-within:text-powder-blue-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-alabaster-grey-50 border border-ink-black-100 rounded-2xl py-3 px-4 text-xs focus:ring-4 focus:ring-powder-blue-500/10 focus:border-powder-blue-500 outline-none transition-all placeholder:text-ink-black-300',
            icon && 'pl-11',
            error && 'border-red-500 focus:ring-red-500/10 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>}
    </div>
  );
}
