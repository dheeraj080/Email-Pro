'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Check,
  Eye,
  Laptop,
  Smartphone,
  Layout,
  Code,
  Sparkles,
  Inbox,
  ArrowUpRight,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEMPLATES } from '@/lib/templates';
import { exportToHTML } from '@/lib/render-email';
import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TemplateShowcaseProps {
  onSelect: (template: Template) => void;
  onClose: () => void;
  activeTemplateId?: string;
}

interface TemplateCardProps {
  template: Template;
  isActive: boolean;
  onSelect: (template: Template) => void;
  onZoom: (template: Template) => void;
  preview: string | undefined;
  isLoading: boolean;
  onLoadPreview: (id: string, code: string, language?: 'typescript' | 'javascript' | 'html') => void;
}

const OFFICIAL_REACT_EMAIL_METRICS: Record<string, {
  name: string;
  category: 'Official' | 'Community' | 'Barebone';
  readTime: string;
  type: 'official' | 'brand';
}> = {
  'welcome': {
    name: 'Stripe / Developer Onboarding',
    category: 'Community',
    readTime: '1.5m read',
    type: 'brand'
  },
  'reset-password': {
    name: 'Notion / Verify Identity',
    category: 'Community',
    readTime: '30s read',
    type: 'brand'
  },
  'receipt': {
    name: 'Apple / Store Receipt',
    category: 'Community',
    readTime: '1m read',
    type: 'brand'
  },
  'newsletter': {
    name: 'Newsletter / Matte Theme',
    category: 'Official',
    readTime: '3m read',
    type: 'official'
  },
  'welcome-v2': {
    name: 'Studio / Welcome Core',
    category: 'Official',
    readTime: '2m read',
    type: 'official'
  },
  'shipping-confirmation': {
    name: 'Nike / Shipping Confirmation',
    category: 'Community',
    readTime: '1.2m read',
    type: 'brand'
  },
  'tech-summit': {
    name: 'Arcane / Tech Summit RSVP',
    category: 'Official',
    readTime: '2m read',
    type: 'official'
  },
  'legacy-html': {
    name: 'Barebone / Raw HTML Boilerplate',
    category: 'Barebone',
    readTime: '1m read',
    type: 'official'
  }
};

function TemplateCard({ template, isActive, onSelect, onZoom, preview, isLoading, onLoadPreview }: TemplateCardProps) {
  useEffect(() => {
    onLoadPreview(template.id, template.code, template.language);
  }, [template.id, template.code, template.language, onLoadPreview]);

  const meta = OFFICIAL_REACT_EMAIL_METRICS[template.id] || {
    name: template.name,
    category: 'Official',
    readTime: '1m read',
    type: 'official'
  };

  return (
    <div className="group flex flex-col relative">
      {/* Aspect visual frame */}
      <div 
        onClick={() => onSelect(template)}
        className={cn(
          "aspect-[16/11] bg-white relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer",
          isActive 
            ? "border-slate-900 shadow-sm ring-1 ring-slate-900" 
            : "border-slate-200/80 hover:border-slate-350 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
        )}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <div className="w-5 h-5 rounded-full border-2 border-slate-100 border-t-slate-900 animate-spin" />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Rendering</span>
          </div>
        ) : preview ? (
          /* Mathematical scale to center visual preview */
          <div className="absolute inset-0 origin-top-left transform scale-[0.4] w-[250%] h-[250%] pointer-events-none transition-transform duration-500 group-hover:scale-[0.405]">
            <iframe
              srcDoc={preview}
              className="w-full h-full border-none pointer-events-none bg-white"
              title={template.name}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-slate-300">
            <Mail className="w-8 h-8 stroke-[1.2]" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">No Preview</span>
          </div>
        )}

        {/* Action card buttons floating on hover */}
        <div className="absolute inset-0 bg-slate-950/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
          <div className="bg-slate-900/90 text-white px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            Use Template <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {isActive && (
          <div className="absolute top-3 right-3 bg-slate-900 text-white p-1 rounded-full shadow-sm z-10">
            <Check className="w-3 h-3" />
          </div>
        )}

        {/* Small quick inspect preview toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onZoom(template);
          }}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-white/90 hover:bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="Inspect fullscreen"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Typography metadata underneath the card - exact react.email/templates style */}
      <div className="mt-3.5 pl-0.5">
        <h4 
          onClick={() => onSelect(template)}
          className="font-bold text-[13px] text-slate-800 tracking-tight hover:text-slate-950 transition-colors cursor-pointer"
        >
          {meta.name}
        </h4>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
          {meta.category} • {meta.readTime}
        </p>
      </div>
    </div>
  );
}

export default function TemplateShowcase({ onSelect, onClose, activeTemplateId }: TemplateShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomTemplate, setZoomTemplate] = useState<Template | null>(null);
  const [zoomPreviewMode, setZoomPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loadingPreviews, setLoadingPreviews] = useState<Record<string, boolean>>({});

  const loadingRefs = React.useRef<Record<string, boolean>>({});
  const loadedRefs = React.useRef<Record<string, boolean>>({});

  const filterTemplates = (type: 'official' | 'brand') => {
    return TEMPLATES.filter(t => {
      const meta = OFFICIAL_REACT_EMAIL_METRICS[t.id];
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (meta?.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const isCorrectType = meta?.type === type;
      return matchesSearch && isCorrectType;
    });
  };

  const officialTemplates = filterTemplates('official');
  const brandTemplates = filterTemplates('brand');

  const loadPreview = React.useCallback(async (templateId: string, code: string, language?: 'typescript' | 'javascript' | 'html') => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/30 backdrop-blur-sm animate-fade-in"
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 8 }}
        className="bg-[#fcfcfb] w-full max-w-[95vw] xl:max-w-7xl h-full max-h-[92vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-slate-200/60"
      >
        {/* Horizontal Navigation Topbar toolbar */}
        <div className="px-10 py-6 border-b border-slate-200/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fcfcfb] shrink-0">
          <div>
            <h3 className="font-extrabold text-[22px] text-slate-900 tracking-tight">Templates</h3>
            <p className="text-[11px] text-slate-400 font-semibold tracking-wide mt-1">Open source templates built with React Email.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Inline search bar */}
            <div className="relative w-48 sm:w-60">
              <Input
                placeholder="Search templates catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                className="h-8.5 bg-slate-100 rounded-lg border-slate-200/60 focus-visible:ring-slate-400 text-xs text-slate-700 placeholder-slate-400 pl-8"
              />
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-350 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Templates Grid grouped like react.email/templates */}
        <div className="flex-grow overflow-y-auto px-10 py-10 bg-[#f9f9f9]/80 custom-scrollbar space-y-12">
          
          {/* Section: Official Themes */}
          {officialTemplates.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3">
                <span className="text-[11px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-700" /> Curated Themes
                </span>
                <span className="text-[9px] text-slate-400 font-bold">({officialTemplates.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
                {officialTemplates.map((template) => (
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
            </div>
          )}

          {/* Section: Brand Recreations */}
          {brandTemplates.length > 0 && (
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3">
                <span className="text-[11px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-slate-700" /> Brand Recreations
                </span>
                <span className="text-[9px] text-slate-400 font-bold">({brandTemplates.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
                {brandTemplates.map((template) => (
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
            </div>
          )}

          {/* Empty search matches */}
          {officialTemplates.length === 0 && brandTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200/60 flex items-center justify-center mb-4 text-slate-300 shadow-sm">
                <Inbox className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-1">No blueprints found</h4>
              <p className="text-xs text-slate-400 font-medium max-w-xs leading-relaxed">
                We couldn't find any templates matching your search keyword.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Viewport Inspect Modal simulator */}
      <AnimatePresence>
        {zoomTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 8 }}
              className="bg-white w-full max-w-4xl h-full max-h-[80vh] rounded-[24px] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
            >
              {/* Simulator Header */}
              <div className="px-8 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h4 className="font-bold text-sm text-slate-800 leading-none">
                    {OFFICIAL_REACT_EMAIL_METRICS[zoomTemplate.id]?.name || zoomTemplate.name}
                  </h4>
                  <span className="text-[8px] text-slate-400 font-semibold tracking-wider block mt-1.5 uppercase">Live Sandbox Simulator</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Viewport Toggles */}
                  <div className="flex bg-slate-50 border border-slate-200/60 rounded-lg p-0.5">
                    <button
                      onClick={() => setZoomPreviewMode('desktop')}
                      className={cn(
                        "px-2.5 py-1 rounded-md transition-all text-[8px] font-black uppercase tracking-wider flex items-center gap-1",
                        zoomPreviewMode === 'desktop' ? "bg-white text-slate-800 shadow-sm border border-slate-200/40" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <Laptop className="w-3 h-3" /> Desktop
                    </button>
                    <button
                      onClick={() => setZoomPreviewMode('mobile')}
                      className={cn(
                        "px-2.5 py-1 rounded-md transition-all text-[8px] font-black uppercase tracking-wider flex items-center gap-1",
                        zoomPreviewMode === 'mobile' ? "bg-white text-slate-800 shadow-sm border border-slate-200/40" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <Smartphone className="w-3 h-3" /> Mobile
                    </button>
                  </div>

                  <Button
                    onClick={() => {
                      onSelect(zoomTemplate);
                      setZoomTemplate(null);
                    }}
                    disabled={activeTemplateId === zoomTemplate.id}
                    className={cn(
                      "h-8 rounded-lg px-4 text-[8px] font-bold uppercase tracking-widest transition-all",
                      activeTemplateId === zoomTemplate.id 
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" 
                        : "bg-slate-900 hover:bg-slate-805 text-white"
                    )}
                  >
                    {activeTemplateId === zoomTemplate.id ? 'Selected' : 'Use Base'}
                  </Button>

                  <Button
                    onClick={() => setZoomTemplate(null)}
                    className="h-8 w-8 rounded-full border border-slate-200 hover:border-slate-350 bg-slate-50 text-slate-400 hover:text-slate-700 flex items-center justify-center p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Viewport Frame */}
              <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 overflow-hidden relative">
                <div 
                  className={cn(
                    "h-full bg-white shadow-lg transition-all duration-300 rounded-2xl overflow-hidden border border-slate-200/60 flex flex-col",
                    zoomPreviewMode === 'desktop' ? "w-full" : "w-[375px] max-w-full"
                  )}
                >
                  <iframe 
                    srcDoc={previews[zoomTemplate.id] || "<html><body style='display:flex;align-items:center;justify-center;font-family:sans-serif;color:#888;font-size:11px'>Rendering...</body></html>"} 
                    className="w-full h-full border-none flex-grow"
                    title="Fullscreen Preview Simulator"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
