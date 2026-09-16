'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Layout,
  Code,
  Sparkles,
  Inbox,
  Mail,
  Sliders,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEMPLATES } from '@/lib/templates';
import { exportToHTML } from '@/lib/render-email';
import { Template } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { OFFICIAL_REACT_EMAIL_METRICS } from './metrics';
import { TemplateCard } from './TemplateCard';
import { TemplateInspectorModal } from './TemplateInspectorModal';

interface TemplateShowcaseProps {
  onSelect: (template: Template) => void;
  onClose: () => void;
  activeTemplateId?: string;
}

export default function TemplateShowcase({ onSelect, onClose, activeTemplateId }: TemplateShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomTemplate, setZoomTemplate] = useState<Template | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'curated' | 'brands' | 'barebones'>('all');
  
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loadingPreviews, setLoadingPreviews] = useState<Record<string, boolean>>({});
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);

  useEffect(() => {
    setIsGalleryLoading(true);
    const timer = setTimeout(() => {
      setIsGalleryLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const loadingRefs = useRef<Record<string, boolean>>({});
  const loadedRefs = useRef<Record<string, boolean>>({});

  const loadPreview = useCallback(async (templateId: string, code: string, language?: 'typescript' | 'javascript' | 'html') => {
    if (loadedRefs.current[templateId] || loadingRefs.current[templateId]) return;

    loadingRefs.current[templateId] = true;
    setLoadingPreviews(prev => ({ ...prev, [templateId]: true }));
    try {
      const html = await exportToHTML(code, language, templateId);
      loadedRefs.current[templateId] = true;
      setPreviews(prev => ({ ...prev, [templateId]: html }));
    } catch (err) {
      console.error(`Error loading preview for ${templateId}:`, err);
    } finally {
      loadingRefs.current[templateId] = false;
      setLoadingPreviews(prev => ({ ...prev, [templateId]: false }));
    }
  }, []);

  const filteredTemplates = TEMPLATES.filter(t => {
    const meta = OFFICIAL_REACT_EMAIL_METRICS[t.id];
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (meta?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (meta?.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'curated') return meta?.type === 'official' && meta?.category === 'Curated';
    if (activeCategory === 'brands') return meta?.type === 'brand';
    if (activeCategory === 'barebones') return meta?.category === 'Barebones';
    return true;
  });

  const getCategoryCount = (cat: 'all' | 'curated' | 'brands' | 'barebones') => {
    return TEMPLATES.filter(t => {
      const meta = OFFICIAL_REACT_EMAIL_METRICS[t.id];
      if (cat === 'all') return true;
      if (cat === 'curated') return meta?.type === 'official' && meta?.category === 'Curated';
      if (cat === 'brands') return meta?.type === 'brand';
      if (cat === 'barebones') return meta?.category === 'Barebones';
      return true;
    }).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#07080b]/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 12 }}
        className="bg-[#0c0d12] w-full max-w-[95vw] xl:max-w-7xl h-full max-h-[88vh] rounded-[32px] shadow-2xl flex overflow-hidden border border-[#1f222e] text-neutral-300"
      >
        <div className="w-[240px] bg-[#07080b] border-r border-[#1f222e] p-6 flex flex-col justify-between shrink-0 hidden sm:flex">
          <div className="space-y-7">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-xs tracking-wider uppercase text-white">Blueprints</h3>
            </div>
            
            <div className="space-y-1">
              {[
                { id: 'all', label: 'All Templates', icon: <Layout className="w-3.5 h-3.5" /> },
                { id: 'curated', label: 'Curated Themes', icon: <Sparkles className="w-3.5 h-3.5" /> },
                { id: 'brands', label: 'Brand Recreations', icon: <Mail className="w-3.5 h-3.5" /> },
                { id: 'barebones', label: 'Barebones', icon: <Code className="w-3.5 h-3.5" /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id as any)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    activeCategory === item.id 
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-[#12141c]"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.label}
                  </span>
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                    activeCategory === item.id
                      ? "bg-indigo-700 text-white border-indigo-500"
                      : "bg-[#12141c] text-neutral-400 border-[#1f222e]"
                  )}>
                    {getCategoryCount(item.id as any)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#12141c] border border-[#1f222e] rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-neutral-400">
              <Info className="w-3 h-3 text-indigo-400" /> COMPILER METRICS
            </div>
            <div className="space-y-2 text-[10px] font-semibold text-neutral-400">
              <div className="flex justify-between">
                <span>Output Format:</span>
                <span className="text-white font-bold">Inlined CSS</span>
              </div>
              <div className="flex justify-between">
                <span>Size Control:</span>
                <span className="text-white font-bold">102KB Warn</span>
              </div>
              <div className="flex justify-between">
                <span>Core Framework:</span>
                <span className="text-white font-bold">React Email</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-[#07080b]">
          <div className="px-8 py-5 border-b border-[#1f222e] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c0d12] shrink-0">
            <div>
              <h3 className="font-black text-xl text-white tracking-tight leading-none">Select Blueprint</h3>
              <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-1.5">Open source React templates for inlining</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-56">
                <Input
                  placeholder="Search blueprint templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-3.5 h-3.5 text-neutral-400" />}
                  className="h-9 bg-[#07080b] rounded-full border-[#1f222e] focus-visible:ring-indigo-500 text-xs text-white placeholder-neutral-500 pl-9"
                />
              </div>

              <button
                onClick={onClose}
                className="w-8.5 h-8.5 rounded-full border border-[#1f222e] bg-[#12141c] flex items-center justify-center text-neutral-400 hover:text-white transition-all hover:bg-[#1f222e]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-8 py-8 bg-[#07080b] custom-scrollbar animate-fade-in">
            {isGalleryLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col relative">
                    <div className="aspect-[16/11] bg-[#07080b] relative overflow-hidden rounded-2xl border border-[#1f222e] flex flex-col shadow-sm">
                      <div className="h-7 bg-[#0c0d12] border-b border-[#1f222e] px-3 flex items-center justify-between shrink-0">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                        </div>
                        <div className="bg-[#07080b] border border-[#1f222e] rounded px-3 py-0.5 text-[8px] h-3.5 w-16 bg-neutral-800/40 animate-pulse" />
                        <div className="w-4" />
                      </div>
                      <div className="flex-1 bg-neutral-900/40 relative overflow-hidden p-4 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="h-2 w-1/4 bg-neutral-800 rounded animate-pulse" />
                          <div className="h-3 w-5/6 bg-neutral-800 rounded animate-pulse" />
                          <div className="h-2 w-full bg-neutral-800 rounded animate-pulse" />
                        </div>
                        <div className="h-6 w-1/3 bg-neutral-800 rounded-lg animate-pulse" />
                      </div>
                    </div>
                    <div className="mt-3.5 pl-0.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-2/3 bg-neutral-800 rounded animate-pulse" />
                        <div className="h-4 w-12 bg-neutral-800 rounded animate-pulse" />
                      </div>
                      <div className="h-3 w-1/3 bg-neutral-800 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isActive={activeTemplateId === template.id}
                    onSelect={onSelect}
                    onZoom={setZoomTemplate}
                    preview={previews[template.id]}
                    isLoading={loadingPreviews[template.id]}
                    onLoadPreview={loadPreview}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="w-12 h-12 bg-[#0c0d12] rounded-2xl border border-[#1f222e] flex items-center justify-center mb-4 text-neutral-400 shadow-sm">
                  <Inbox className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">No blueprints matched</h4>
                <p className="text-xs text-neutral-400 font-medium max-w-xs leading-relaxed">
                  We couldn&apos;t find any email templates matching your query or selected filters. Try another query.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {zoomTemplate && (
          <TemplateInspectorModal
            template={zoomTemplate}
            preview={previews[zoomTemplate.id]}
            isActive={activeTemplateId === zoomTemplate.id}
            onSelect={onSelect}
            onClose={() => setZoomTemplate(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}