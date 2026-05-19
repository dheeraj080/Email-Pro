'use client';

import React from 'react';
import { Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const THEME_PALETTES = [
  { name: 'indigo', hex: '#6366f1', label: 'Indigo' },
  { name: 'emerald', hex: '#10b981', label: 'Emerald' },
  { name: 'amber', hex: '#f59e0b', label: 'Amber' },
  { name: 'rose', hex: '#f43f5e', label: 'Rose' },
  { name: 'violet', hex: '#8b5cf6', label: 'Violet' },
  { name: 'slate', hex: '#475569', label: 'Slate' }
];

interface ThemePickerProps {
  currentCode: string;
  onCodeChange: (newCode: string) => void;
}

export function ThemePicker({ currentCode, onCodeChange }: ThemePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Detect active theme color inside code
  const detectActiveTheme = () => {
    for (const theme of THEME_PALETTES) {
      if (currentCode.includes(`bg-${theme.name}`) || currentCode.includes(`text-${theme.name}`)) {
        return theme.name;
      }
    }
    return 'indigo'; // Default fallback
  };

  const activeThemeName = detectActiveTheme();

  const handleSelectTheme = (themeName: string) => {
    if (themeName === activeThemeName) return;

    // Direct replacement of Tailwind color classes (supports common bg-*, text-*, border-*, shadow-*)
    let updatedCode = currentCode;
    
    // Replace hex color codes typically associated with brand colors if present
    const prevTheme = THEME_PALETTES.find(t => t.name === activeThemeName);
    const targetTheme = THEME_PALETTES.find(t => t.name === themeName);
    
    if (prevTheme && targetTheme) {
      // Regex pattern to capture bg-indigo-600, text-indigo-500, etc.
      const colorRegex = new RegExp(`(bg|text|border|accent|ring|shadow|from|to|via)-${prevTheme.name}-([0-9]{3})`, 'g');
      updatedCode = updatedCode.replace(colorRegex, `$1-${targetTheme.name}-$2`);
      
      // Replace some static color declarations inside <Tailwind config={...}> or custom objects
      updatedCode = updatedCode.replaceAll(prevTheme.hex, targetTheme.hex);
      // Double check in case of upper casing hex
      updatedCode = updatedCode.replaceAll(prevTheme.hex.toUpperCase(), targetTheme.hex);
      
      // Edge cases for standard React components
      updatedCode = updatedCode.replace(new RegExp(`hover:bg-${prevTheme.name}-([0-9]{3})`, 'g'), `hover:bg-${targetTheme.name}-$1`);
      updatedCode = updatedCode.replace(new RegExp(`shadow-${prevTheme.name}-([0-9]{3})`, 'g'), `shadow-${targetTheme.name}-$1`);
    }

    onCodeChange(updatedCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-ink-black-100 bg-white hover:bg-alabaster-grey-100 hover:text-ink-black-900 transition-all text-[10px] font-bold uppercase tracking-widest text-ink-black-400 shadow-sm",
          isOpen && "border-slate-350 text-slate-800"
        )}
        title="Choose dynamic template brand theme color"
      >
        <Palette className="w-3.5 h-3.5" />
        <span>Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 z-[200] animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="text-[8px] font-black uppercase tracking-wider text-slate-400 mb-2">Accent Syncer</div>
          <div className="grid grid-cols-3 gap-2">
            {THEME_PALETTES.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleSelectTheme(theme.name)}
                className={cn(
                  "h-10 rounded-lg flex flex-col items-center justify-center relative border transition-all duration-200 hover:scale-105 active:scale-95",
                  activeThemeName === theme.name 
                    ? "border-slate-800 bg-slate-50" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                )}
                title={theme.label}
              >
                <div 
                  className="w-4 h-4 rounded-full shadow-inner shrink-0" 
                  style={{ backgroundColor: theme.hex }}
                />
                <span className="text-[7px] font-bold text-slate-500 mt-1 uppercase tracking-wide">{theme.name}</span>
                {activeThemeName === theme.name && (
                  <div className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white rounded-full p-0.5 shadow-sm">
                    <Check className="w-2 h-2" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
