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
        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-indigo-400 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-[#07080b] border border-[#1f222e] rounded-xl py-2.5 px-4 text-xs text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-neutral-500',
            icon && 'pl-11',
            error && 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-rose-400 ml-1">{error}</p>}
    </div>
  );
}
