'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Palette, RotateCcw, AlertCircle, Check, HelpCircle, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditorSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentCode: string;
  onCodeChange: (newCode: string) => void;
}

export const BRAND_PRESETS = [
  {
    name: 'Modern Indigo',
    primary: '#6366f1',
    secondary: '#4f46e5',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
  },
  {
    name: 'Emerald Peak',
    primary: '#10b981',
    secondary: '#047857',
    background: '#f0fdf4',
    surface: '#ffffff',
    text: '#064e3b',
  },
  {
    name: 'Crimson Wave',
    primary: '#f43f5e',
    secondary: '#be123c',
    background: '#fff1f2',
    surface: '#ffffff',
    text: '#4c0519',
  },
  {
    name: 'Sunset Amber',
    primary: '#f59e0b',
    secondary: '#b45309',
    background: '#fffbeb',
    surface: '#ffffff',
    text: '#78350f',
  },
  {
    name: 'Royal Violet',
    primary: '#8b5cf6',
    secondary: '#6d28d9',
    background: '#faf5ff',
    surface: '#ffffff',
    text: '#581c87',
  },
  {
    name: 'Midnight Steel',
    primary: '#38bdf8',
    secondary: '#0284c7',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
  },
  {
    name: 'Cyber Punk',
    primary: '#ff007f',
    secondary: '#00f0ff',
    background: '#0a0a0f',
    surface: '#12121f',
    text: '#ffffff',
  },
];

// Helper to convert typical static layout colors in templates to use brand variables
export function convertStaticToBrandColors(code: string): string {
  let updated = code;

  // Replace background Slate/Cream/Grey body backdrops with bg-brand-bg
  updated = updated.replace(/className="bg-\[#(f8fafc|FAF9F6|f4f4f5|fafafa)\]"/g, 'className="bg-brand-bg"');
  updated = updated.replace(/className="bg-slate-50"/g, 'className="bg-brand-bg"');
  
  // Replace white background cards / main containers with bg-brand-surface
  updated = updated.replace(/className="bg-white/g, 'className="bg-brand-surface');
  
  // Replace standard body text color elements with text-brand-text
  updated = updated.replace(/text-neutral-800/g, 'text-brand-text');
  updated = updated.replace(/text-gray-800/g, 'text-brand-text');
  updated = updated.replace(/text-slate-800/g, 'text-brand-text');
  
  // Replace static primary accent classes with brand-primary equivalent
  updated = updated.replace(/(bg|text|border|accent|ring|shadow|from|to|via)-indigo-600/g, '$1-brand-primary');
  updated = updated.replace(/(bg|text|border|accent|ring|shadow|from|to|via)-indigo-500/g, '$1-brand-primary');
  updated = updated.replace(/(bg|text|border|accent|ring|shadow|from|to|via)-blue-600/g, '$1-brand-primary');
  updated = updated.replace(/(bg|text|border|accent|ring|shadow|from|to|via)-rose-600/g, '$1-brand-primary');
  updated = updated.replace(/(bg|text|border|accent|ring|shadow|from|to|via)-amber-500/g, '$1-brand-primary');
  updated = updated.replace(/(bg|text|border|accent|ring|shadow|from|to|via)-emerald-600/g, '$1-brand-primary');
  
  // Replace static secondary accents or darker panels with brand-secondary equivalent
  updated = updated.replace(/(bg|text|border|accent|ring|shadow|from|to|via)-indigo-700/g, '$1-brand-secondary');
  updated = updated.replace(/(bg|text|border|accent|ring|shadow|from|to|via)-indigo-800/g, '$1-brand-secondary');
  updated = updated.replace(/(bg|text|border|accent|ring|shadow|from|to|via)-neutral-900/g, '$1-brand-secondary');
  updated = updated.replace(/(bg|text|border|accent|ring|shadow|from|to|via)-gray-900/g, '$1-brand-secondary');
  
  return updated;
}

// Read the theme properties from current code block if present
export function detectCurrentBrandColors(code: string) {
  const defaultColors = {
    primary: '#6366f1',
    secondary: '#4f46e5',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a'
  };

  const primaryMatch = code.match(/--brand-primary:\s*(#[a-fA-F0-9]{3,8})/i);
  const secondaryMatch = code.match(/--brand-secondary:\s*(#[a-fA-F0-9]{3,8})/i);
  const bgMatch = code.match(/--brand-bg:\s*(#[a-fA-F0-9]{3,8})/i);
  const surfaceMatch = code.match(/--brand-surface:\s*(#[a-fA-F0-9]{3,8})/i);
  const textMatch = code.match(/--brand-text:\s*(#[a-fA-F0-9]{3,8})/i);

  // If no CSS variables but theme config matches hexes directly:
  const configPrimaryMatch = code.match(/primary:\s*['"](#[a-fA-F0-9]{3,8})['"]/i);
  const configSecondaryMatch = code.match(/secondary:\s*['"](#[a-fA-F0-9]{3,8})['"]/i);
  const configBgMatch = code.match(/bg:\s*['"](#[a-fA-F0-9]{3,8})['"]/i);
  const configSurfaceMatch = code.match(/surface:\s*['"](#[a-fA-F0-9]{3,8})['"]/i);
  const configTextMatch = code.match(/text:\s*['"](#[a-fA-F0-9]{3,8})['"]/i);

  return {
    primary: primaryMatch ? primaryMatch[1] : (configPrimaryMatch ? configPrimaryMatch[1] : defaultColors.primary),
    secondary: secondaryMatch ? secondaryMatch[1] : (configSecondaryMatch ? configSecondaryMatch[1] : defaultColors.secondary),
    background: bgMatch ? bgMatch[1] : (configBgMatch ? configBgMatch[1] : defaultColors.background),
    surface: surfaceMatch ? surfaceMatch[1] : (configSurfaceMatch ? configSurfaceMatch[1] : defaultColors.surface),
    text: textMatch ? textMatch[1] : (configTextMatch ? configTextMatch[1] : defaultColors.text)
  };
}

// Regenerates theme declarations in code
export function applyThemeToCode(code: string, colors: {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
}): string {
  let updatedCode = code;

  // 1. Convert any standard hardcoded colors to reactive brand classes
  updatedCode = convertStaticToBrandColors(updatedCode);

  // 2. Prepare CSS variables
  const cssVariables = `
            :root {
              --brand-primary: ${colors.primary};
              --brand-secondary: ${colors.secondary};
              --brand-bg: ${colors.background};
              --brand-surface: ${colors.surface};
              --brand-text: ${colors.text};
            }
  `.trim();

  const styleBlock = `<style>{\`
            ${cssVariables}
          \`}</style>`;

  const headWithStyleRegex = /<Head>([\s\S]*?)<\/Head>/i;
  const headSelfClosingRegex = /<Head\s*\/>/i;

  if (headWithStyleRegex.test(updatedCode)) {
    const match = updatedCode.match(headWithStyleRegex);
    const headContent = match ? match[1] : '';
    if (headContent.includes('--brand-primary') || headContent.includes(':root')) {
      // Replace existing style block with variables
      const rootRegex = /:root\s*\{[\s\S]*?\}/g;
      const updatedHeadContent = headContent.replace(rootRegex, `:root {\n              --brand-primary: ${colors.primary};\n              --brand-secondary: ${colors.secondary};\n              --brand-bg: ${colors.background};\n              --brand-surface: ${colors.surface};\n              --brand-text: ${colors.text};\n            }`);
      updatedCode = updatedCode.replace(headWithStyleRegex, `<Head>${updatedHeadContent}</Head>`);
    } else {
      // Inject variables block inside <Head>
      const updatedHeadContent = headContent + `\n        ${styleBlock}\n        `;
      updatedCode = updatedCode.replace(headWithStyleRegex, `<Head>${updatedHeadContent}</Head>`);
    }
  } else if (headSelfClosingRegex.test(updatedCode)) {
    // Expand <Head /> self closing tag
    updatedCode = updatedCode.replace(headSelfClosingRegex, `<Head>\n          ${styleBlock}\n        </Head>`);
  } else {
    // Prepend after <Html> tag if no Head is found at all
    const htmlRegex = /<Html>/i;
    if (htmlRegex.test(updatedCode)) {
      updatedCode = updatedCode.replace(htmlRegex, `<Html>\n        <Head>\n          ${styleBlock}\n        </Head>`);
    }
  }

  // 3. Prepare and inject Tailwind theme extension
  const tailwindConfigStr = `config={{
            theme: {
              extend: {
                colors: {
                  brand: {
                    primary: '${colors.primary}',
                    secondary: '${colors.secondary}',
                    bg: '${colors.background}',
                    surface: '${colors.surface}',
                    text: '${colors.text}',
                  }
                }
              }
            }
          }}`;

  const tailwindConfigRegex = /<Tailwind\s+config=\{\{[\s\S]*?\}\}\s*>/i;
  const tailwindSimpleRegex = /<Tailwind\s*>/i;

  if (tailwindConfigRegex.test(updatedCode)) {
    // Replace the existing tailwind block with updated config
    updatedCode = updatedCode.replace(tailwindConfigRegex, `<Tailwind\n          ${tailwindConfigStr}\n        >`);
  } else if (tailwindSimpleRegex.test(updatedCode)) {
    // Upgrade standard <Tailwind> with rich custom theme configs
    updatedCode = updatedCode.replace(tailwindSimpleRegex, `<Tailwind\n          ${tailwindConfigStr}\n        >`);
  }

  return updatedCode;
}

export function EditorSettingsDialog({
  isOpen,
  onClose,
  currentCode,
  onCodeChange,
}: EditorSettingsDialogProps) {
  const [colors, setColors] = useState({
    primary: '#6366f1',
    secondary: '#4f46e5',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
  });

  // Pull existing styles from code when dialog is opened
  useEffect(() => {
    if (isOpen && currentCode) {
      const detected = detectCurrentBrandColors(currentCode);
      setColors(detected);
    }
  }, [isOpen, currentCode]);

  if (!isOpen) return null;

  const handlePresetSelect = (preset: typeof BRAND_PRESETS[0]) => {
    const updatedColors = {
      primary: preset.primary,
      secondary: preset.secondary,
      background: preset.background,
      surface: preset.surface,
      text: preset.text,
    };
    setColors(updatedColors);
    
    const newCode = applyThemeToCode(currentCode, updatedColors);
    onCodeChange(newCode);
  };

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    // Ensure value is correctly formatted
    let formatted = value;
    if (value.startsWith('#') && value.length <= 9) {
      formatted = value;
    } else if (!value.startsWith('#') && /^[a-fA-F0-9]{0,8}$/.test(value)) {
      formatted = `#${value}`;
    }

    const updatedColors = {
      ...colors,
      [key]: formatted,
    };
    setColors(updatedColors);

    // Apply if it's a valid hex length
    if (formatted.length === 4 || formatted.length === 7) {
      const newCode = applyThemeToCode(currentCode, updatedColors);
      onCodeChange(newCode);
    }
  };

  const handleReset = () => {
    const defaultColors = BRAND_PRESETS[0]; // Indigo Core
    setColors(defaultColors);
    const newCode = applyThemeToCode(currentCode, defaultColors);
    onCodeChange(newCode);
  };

  // Helper to verify if the colors match a preset
  const isPresetActive = (preset: typeof BRAND_PRESETS[0]) => {
    return (
      colors.primary.toLowerCase() === preset.primary.toLowerCase() &&
      colors.secondary.toLowerCase() === preset.secondary.toLowerCase() &&
      colors.background.toLowerCase() === preset.background.toLowerCase() &&
      colors.surface.toLowerCase() === preset.surface.toLowerCase() &&
      colors.text.toLowerCase() === preset.text.toLowerCase()
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#07080b]/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Dialog Panel Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#0c0d12] border border-[#1f222e] rounded-3xl overflow-hidden shadow-2xl z-[260] my-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#1f222e] flex items-center justify-between bg-[#12141c]/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  Branding Settings
                </h3>
                <p className="text-[10px] font-medium text-neutral-400">
                  Configure global color variables and brand templates in real-time.
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2.5 rounded-lg border-[#1f222e] hover:border-neutral-700 bg-transparent text-neutral-400 hover:text-white flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
              title="Reset theme colors to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </Button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Presets Grid */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Brand Presets</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BRAND_PRESETS.map((preset) => {
                  const active = isPresetActive(preset);
                  return (
                    <button
                      key={preset.name}
                      onClick={() => handlePresetSelect(preset)}
                      className={`group p-2.5 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all duration-200 relative hover:scale-[1.02] active:scale-[0.98] ${
                        active
                          ? 'border-indigo-500/70 bg-indigo-500/5'
                          : 'border-[#1f222e] bg-[#07080b]/80 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] font-bold text-neutral-300 group-hover:text-white leading-tight uppercase tracking-wider truncate max-w-[90%]">
                          {preset.name}
                        </span>
                        {active && (
                          <div className="bg-indigo-500 text-white rounded-full p-0.5 shadow-sm scale-75">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      
                      {/* Swatches block */}
                      <div className="flex gap-1 items-center mt-2">
                        <div
                          className="w-4 h-4 rounded-full border border-[#1f222e] shadow-sm"
                          style={{ backgroundColor: preset.primary }}
                          title={`Primary: ${preset.primary}`}
                        />
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-[#1f222e] shadow-sm"
                          style={{ backgroundColor: preset.secondary }}
                          title={`Secondary: ${preset.secondary}`}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-[#1f222e] shadow-sm"
                          style={{ backgroundColor: preset.background }}
                          title={`Background: ${preset.background}`}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-[#1f222e] shadow-sm"
                          style={{ backgroundColor: preset.surface }}
                          title={`Surface: ${preset.surface}`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="space-y-4 pt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Custom Color Specifiers</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Primary Accent */}
                <div className="space-y-2 bg-[#07080b]/50 p-3 rounded-2xl border border-[#1f222e]">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block pl-1">
                    Primary Accent
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#1f222e] shrink-0 shadow-sm">
                      <input
                        type="color"
                        value={colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] -translate-x-[15%] -translate-y-[15%] cursor-pointer"
                      />
                    </div>
                    <Input
                      value={colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      placeholder="#6366f1"
                      className="bg-[#07080b] border-[#1f222e] font-mono h-10"
                    />
                  </div>
                </div>

                {/* 2. Secondary Accent */}
                <div className="space-y-2 bg-[#07080b]/50 p-3 rounded-2xl border border-[#1f222e]">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block pl-1">
                    Secondary Accent
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#1f222e] shrink-0 shadow-sm">
                      <input
                        type="color"
                        value={colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] -translate-x-[15%] -translate-y-[15%] cursor-pointer"
                      />
                    </div>
                    <Input
                      value={colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      placeholder="#4f46e5"
                      className="bg-[#07080b] border-[#1f222e] font-mono h-10"
                    />
                  </div>
                </div>

                {/* 3. Page Background */}
                <div className="space-y-2 bg-[#07080b]/50 p-3 rounded-2xl border border-[#1f222e]">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block pl-1">
                    Page Background
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#1f222e] shrink-0 shadow-sm">
                      <input
                        type="color"
                        value={colors.background}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] -translate-x-[15%] -translate-y-[15%] cursor-pointer"
                      />
                    </div>
                    <Input
                      value={colors.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      placeholder="#f8fafc"
                      className="bg-[#07080b] border-[#1f222e] font-mono h-10"
                    />
                  </div>
                </div>

                {/* 4. Container Surface */}
                <div className="space-y-2 bg-[#07080b]/50 p-3 rounded-2xl border border-[#1f222e]">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block pl-1">
                    Card / Container Surface
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#1f222e] shrink-0 shadow-sm">
                      <input
                        type="color"
                        value={colors.surface}
                        onChange={(e) => handleColorChange('surface', e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] -translate-x-[15%] -translate-y-[15%] cursor-pointer"
                      />
                    </div>
                    <Input
                      value={colors.surface}
                      onChange={(e) => handleColorChange('surface', e.target.value)}
                      placeholder="#ffffff"
                      className="bg-[#07080b] border-[#1f222e] font-mono h-10"
                    />
                  </div>
                </div>

                {/* 5. Core Typography */}
                <div className="space-y-2 bg-[#07080b]/50 p-3 rounded-2xl border border-[#1f222e] sm:col-span-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block pl-1">
                    Typography / Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#1f222e] shrink-0 shadow-sm">
                      <input
                        type="color"
                        value={colors.text}
                        onChange={(e) => handleColorChange('text', e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] -translate-x-[15%] -translate-y-[15%] cursor-pointer"
                      />
                    </div>
                    <Input
                      value={colors.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      placeholder="#0f172a"
                      className="bg-[#07080b] border-[#1f222e] font-mono h-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Explanatory Banner */}
            <div className="bg-[#12141c] rounded-2xl p-4.5 border border-[#1f222e] flex gap-3 shadow-inner">
              <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-white block">Automated CSS variables regeneration</span>
                <p className="text-[10px] font-medium text-neutral-400 leading-relaxed">
                  These choices compile directly to <strong>:root CSS variables</strong> inside the template&apos;s <code className="text-indigo-400">&lt;style&gt;</code> block and configure Tailwind&apos;s <code className="text-indigo-400">brand</code> theme extend block. Standard layout tags will inherit changes automatically!
                </p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-[#1f222e] bg-[#12141c]/40 flex gap-3">
            <Button
              onClick={onClose}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider rounded-xl border-none text-[11px]"
            >
              Save Branding Settings
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
