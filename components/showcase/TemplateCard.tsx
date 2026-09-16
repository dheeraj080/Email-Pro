'use client';

import React, { useEffect } from 'react';
import { Eye, Check, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Template } from '@/lib/types';
import { OFFICIAL_REACT_EMAIL_METRICS } from './metrics';

interface TemplateCardProps {
  template: Template;
  isActive: boolean;
  onSelect: (template: Template) => void;
  onZoom: (template: Template) => void;
  preview?: string;
  isLoading: boolean;
  onLoadPreview: (id: string, code: string, language?: 'typescript' | 'javascript' | 'html') => void;
}

const complexityColors = {
  Simple: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Advanced: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

export function TemplateCard({
  template,
  isActive,
  onSelect,
  onZoom,
  preview,
  isLoading,
  onLoadPreview,
}: TemplateCardProps) {
  useEffect(() => {
    onLoadPreview(template.id, template.code, template.language);
  }, [template.id, template.code, template.language, onLoadPreview]);

  const meta = OFFICIAL_REACT_EMAIL_METRICS[template.id] || {
    name: template.name,
    category: 'Curated' as const,
    readTime: '1m read',
    type: 'official',
    sizeEstimate: '24KB',
    complexity: 'Simple' as const,
    description: 'Curated standard React email blueprint.'
  };

  return (
    <div className="group flex flex-col relative">
      <div 
        onClick={() => onSelect(template)}
        className={cn(
          "aspect-[16/11] bg-[#07080b] relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col shadow-sm",
          isActive 
            ? "border-indigo-500 ring-1 ring-indigo-500 shadow-md" 
            : "border-[#1f222e] hover:border-neutral-700 hover:shadow-md"
        )}
      >
        <div className="h-7 bg-[#0c0d12] border-b border-[#1f222e] px-3 flex items-center justify-between shrink-0">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
          </div>
          <div className="bg-[#07080b] border border-[#1f222e] rounded px-2.5 py-0.5 text-[8px] text-neutral-400 font-mono tracking-wide truncate max-w-[120px]">
            {template.id}.tsx
          </div>
          <div className="w-4" />
        </div>

        <div className="flex-1 bg-white relative overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-white">
              <div className="w-4 h-4 rounded-full border-2 border-neutral-200 border-t-neutral-800 animate-spin" />
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Compiling</span>
            </div>
          ) : preview ? (
            <div className="absolute inset-0 origin-top-left transform scale-[0.4] w-[250%] h-[250%] pointer-events-none transition-transform duration-500 group-hover:scale-[0.405]">
              <iframe
                srcDoc={preview}
                className="w-full h-full border-none pointer-events-none bg-white"
                title={template.name}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-neutral-400 bg-white">
              <Mail className="w-7 h-7 stroke-[1.2]" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">No Preview</span>
            </div>
          )}

          <div className="absolute inset-0 bg-[#07080b]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(template);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            >
              Use Blueprint
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onZoom(template);
              }}
              className="bg-[#12141c] hover:bg-[#1f222e] text-white p-2 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 border border-[#1f222e]"
              title="Inspect Simulator"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {isActive && (
            <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full shadow-md z-10">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-3.5 pl-0.5">
        <div className="flex items-start justify-between gap-2">
          <h4 
            onClick={() => onSelect(template)}
            className="font-bold text-[13px] text-white tracking-tight hover:text-indigo-400 transition-colors cursor-pointer truncate"
          >
            {meta.name}
          </h4>
          <span className={cn(
            "text-[8px] font-bold border px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0",
            complexityColors[meta.complexity]
          )}>
            {meta.complexity}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
          <span>{meta.category}</span>
          <span>•</span>
          <span>{meta.sizeEstimate}</span>
        </div>
      </div>
    </div>
  );
}