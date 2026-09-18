'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'ghost' | 'surface';
}

export function ThemeToggle({ className, variant = 'ghost' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative p-1.5 rounded-lg transition-colors flex items-center justify-center",
        variant === 'ghost'
          ? "text-fg-muted hover:text-fg hover:bg-surface-hover"
          : "bg-surface-raised hover:bg-surface-hover border border-border-base text-fg",
        className
      )}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle color theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-warning" />
      ) : (
        <Moon className="w-4 h-4 text-accent" />
      )}
    </button>
  );
}
