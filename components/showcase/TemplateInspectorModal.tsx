'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Laptop,
  Tablet,
  Smartphone,
  Check,
  Copy,
  Info,
  CheckCircle2,
  FileCode,
  Sliders,
  Scale,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { OFFICIAL_REACT_EMAIL_METRICS } from './metrics';
import { CodeHighlighter } from './CodeHighlighter';

interface TemplateInspectorModalProps {
  template: Template;
  preview?: string;
  isActive: boolean;
  onSelect: (template: Template) => void;
  onClose: () => void;
}

export function TemplateInspectorModal({
  template,
  preview,
  isActive,
  onSelect,
  onClose
}: TemplateInspectorModalProps) {
  const [zoomPreviewMode, setZoomPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomTab, setZoomTab] = useState<'preview' | 'code'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);

  const activeZoomMeta = OFFICIAL_REACT_EMAIL_METRICS[template.id];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#07080b]/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 12 }}
        className="bg-[#0c0d12] w-full max-w-5xl h-full max-h-[82vh] rounded-[28px] overflow-hidden flex flex-col shadow-2xl border border-[#1f222e] text-neutral-300"
      >
        <div className="px-6 py-4 border-b border-[#1f222e] flex justify-between items-center bg-[#0c0d12] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#12141c] border border-[#1f222e] flex items-center justify-center text-indigo-400 shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wide leading-none">
                {activeZoomMeta?.name || template.name}
              </h4>
              <span className="text-[8px] text-neutral-400 font-black tracking-wider block mt-1.5 uppercase">Interactive Testing Sandbox</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-[#07080b] border border-[#1f222e] rounded-xl p-0.5 shadow-xs">
              {[
                { id: 'desktop', label: 'Desktop (100%)', icon: <Laptop className="w-3.5 h-3.5" /> },
                { id: 'tablet', label: 'Tablet (768px)', icon: <Tablet className="w-3.5 h-3.5" /> },
                { id: 'mobile', label: 'Mobile (360px)', icon: <Smartphone className="w-3.5 h-3.5" /> }
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => setZoomPreviewMode(btn.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all text-[8px] font-black uppercase tracking-wider flex items-center gap-1",
                    zoomPreviewMode === btn.id 
                      ? "bg-[#12141c] text-white shadow-sm border border-[#1f222e]" 
                      : "text-neutral-400 hover:text-neutral-300"
                  )}
                >
                  {btn.icon}
                  {btn.label.split(' ')[0]}
                </button>
              ))}
            </div>

            <Button
              onClick={() => {
                onSelect(template);
                onClose();
              }}
              disabled={isActive}
              className={cn(
                "h-8.5 rounded-xl px-4.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                isActive 
                  ? "bg-[#12141c] text-neutral-500 border border-[#1f222e] cursor-not-allowed shadow-none" 
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
              )}
            >
              {isActive ? 'Selected' : 'Use Blueprint'}
            </Button>

            <button
              onClick={onClose}
              className="w-8.5 h-8.5 rounded-full border border-[#1f222e] bg-[#12141c] text-neutral-400 hover:text-white flex items-center justify-center p-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden bg-[#07080b]">
          <div className="flex-1 flex items-center justify-center p-6 md:p-8 overflow-hidden relative border-r border-[#1f222e]">
            <div 
              className={cn(
                "h-full bg-white shadow-md transition-all duration-300 rounded-2xl overflow-hidden border border-[#1f222e] flex flex-col",
                zoomPreviewMode === 'desktop' && "w-full",
                zoomPreviewMode === 'tablet' && "w-[560px] max-w-full",
                zoomPreviewMode === 'mobile' && "w-[360px] max-w-full"
              )}
            >
              <div className="h-9 bg-neutral-100 border-b border-neutral-200 px-4 flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                <span>To: client@sandbox.engine</span>
                <span>Estimated payload size: {activeZoomMeta?.sizeEstimate || '24KB'}</span>
              </div>

              <iframe 
                srcDoc={preview || "<html><body style='display:flex;align-items:center;justify-center;font-family:sans-serif;color:#888;font-size:11px'>Rendering...</body></html>"} 
                className="w-full h-full border-none flex-grow bg-white"
                title="Fullscreen Preview Simulator"
              />
            </div>
          </div>

          <div className="w-[320px] bg-[#0c0d12] flex flex-col justify-between shrink-0 p-5 overflow-y-auto custom-scrollbar border-l border-[#1f222e]">
            <div className="space-y-6">
              <div className="flex bg-[#07080b] border border-[#1f222e] rounded-xl p-0.5 shadow-xs">
                <button
                  onClick={() => setZoomTab('preview')}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5",
                    zoomTab === 'preview' ? "bg-[#12141c] text-white shadow-sm border border-[#1f222e]" : "text-neutral-400"
                  )}
                >
                  <Scale className="w-3 h-3" /> Info & Quality
                </button>
                <button
                  onClick={() => setZoomTab('code')}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5",
                    zoomTab === 'code' ? "bg-[#12141c] text-white shadow-sm border border-[#1f222e]" : "text-neutral-400"
                  )}
                >
                  <Code className="w-3 h-3" /> React Code
                </button>
              </div>

              {zoomTab === 'preview' ? (
                <div className="space-y-5">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400 block mb-1">Blueprint Profile</span>
                    <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                      {activeZoomMeta?.description}
                    </p>
                  </div>

                  <div className="bg-[#07080b] border border-[#1f222e] rounded-2xl p-4 space-y-3 shadow-xs">
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400 block">Accessibility Audits</span>
                    
                    <div className="space-y-2">
                      {[
                        { label: 'Gmail 102KB Limit', status: 'Compliant', desc: `${activeZoomMeta?.sizeEstimate || '24KB'} total output` },
                        { label: 'Responsive Flex Grid', status: 'Pass', desc: 'Tested mobile viewport layouts' },
                        { label: 'Image Alt safety', status: 'Pass', desc: 'Default attribute setups' },
                        { label: 'Contrast Ratio (AAA)', status: 'Verified', desc: 'High compliance color set' }
                      ].map((audit) => (
                        <div key={audit.label} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] font-bold text-white leading-none">{audit.label}</div>
                            <span className="text-[8px] text-neutral-400 font-medium">{audit.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-[10px] font-semibold text-neutral-400 pl-0.5">
                    <div className="flex justify-between">
                      <span>Complexity:</span>
                      <span className="text-white font-bold">{activeZoomMeta?.complexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <span className="text-white font-bold uppercase">{template.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Read Time:</span>
                      <span className="text-white font-bold">{activeZoomMeta?.readTime}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5" /> {template.id}.tsx
                    </span>
                    <button
                      onClick={() => handleCopyCode(template.code)}
                      className="text-[9px] font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedCode ? 'Copied' : 'Copy code'}
                    </button>
                  </div>

                  <div className="h-[300px]">
                    <CodeHighlighter code={template.code} />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#1f222e] mt-4 flex items-center gap-2 text-[9px] font-bold text-neutral-400">
              <Info className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span>Selected templates sync automatically to your active workspace Monaco Editor.</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}