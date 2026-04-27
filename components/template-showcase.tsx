'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Check, 
  ExternalLink,
  Eye,
  Mail,
  Zap,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEMPLATES } from '@/lib/templates';
import { exportToHTML } from '@/lib/render-email';
import { Template } from '@/lib/types';

interface TemplateShowcaseProps {
  onSelect: (template: Template) => void;
  onClose: () => void;
  activeTemplateId?: string;
}

interface TemplateCardProps {
  template: Template;
  isActive: boolean;
  onSelect: (template: Template) => void;
  preview: string | undefined;
  isLoading: boolean;
  onLoadPreview: (id: string, code: string) => void;
}

function TemplateCard({ template, isActive, onSelect, preview, isLoading, onLoadPreview }: TemplateCardProps) {
  useEffect(() => {
    onLoadPreview(template.id, template.code);
  }, [template.id, template.code, onLoadPreview]);

  return (
    <motion.div 
      layoutId={template.id}
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl overflow-hidden",
        isActive ? "border-orange-500 ring-4 ring-orange-500/10 shadow-lg shadow-orange-500/5" : "border-slate-200 hover:border-slate-300"
      )}
    >
      {/* Preview Container */}
      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden group-hover:bg-slate-200 transition-colors">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-orange-600 animate-spin" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rendering...</span>
          </div>
        ) : preview ? (
          <div className="absolute inset-0 origin-top transform scale-[0.4] w-[250%] h-[250%] pointer-events-none">
            <iframe 
              srcDoc={preview} 
              className="w-full h-full border-none pointer-events-none" 
              title={template.name}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
            <Mail className="w-12 h-12" />
            <span className="text-[10px] font-bold uppercase tracking-widest">No Preview</span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-white text-black px-4 py-2 rounded-full text-xs font-black uppercase tracking-tighter flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
            Use Template <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {isActive && (
          <div className="absolute top-4 right-4 bg-orange-600 text-white p-1.5 rounded-full shadow-lg">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Info Part */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{template.name}</h3>
          <button 
            className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
            title="View Fullscreen"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6 flex-1">
          A professional, versatile template perfect for {template.name.toLowerCase()} purposes. Fully responsive and tested across all major mail clients.
        </p>
        
        <button 
          onClick={() => onSelect(template)}
          className={cn(
            "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            isActive 
              ? "bg-slate-100 text-slate-400 cursor-default" 
              : "bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-600/20 active:translate-y-0.5"
          )}
        >
          {isActive ? "Currently Active" : "Select Template"}
        </button>
      </div>
    </motion.div>
  );
}

export default function TemplateShowcase({ onSelect, onClose, activeTemplateId }: TemplateShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loadingPreviews, setLoadingPreviews] = useState<Record<string, boolean>>({});

  const filteredTemplates = TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load preview for a template when needed
  const loadPreview = React.useCallback(async (templateId: string, code: string) => {
    if (previews[templateId] || loadingPreviews[templateId]) return;

    setLoadingPreviews(prev => ({ ...prev, [templateId]: true }));
    try {
      const html = await exportToHTML(code);
      setPreviews(prev => ({ ...prev, [templateId]: html }));
    } catch (err) {
      console.error(`Error loading preview for ${templateId}:`, err);
    } finally {
      setLoadingPreviews(prev => ({ ...prev, [templateId]: false }));
    }
  }, [previews, loadingPreviews]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Email Templates</h2>
              <p className="text-xs text-slate-500 font-medium">Choose a base to start your next campaign</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-white border border-slate-200 rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
              />
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-50/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <TemplateCard 
                key={template.id}
                template={template}
                isActive={activeTemplateId === template.id}
                onSelect={onSelect}
                preview={previews[template.id]}
                isLoading={loadingPreviews[template.id]}
                onLoadPreview={loadPreview}
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No templates found</h3>
              <p className="text-slate-500 max-w-xs">
                We couldn't find any templates matching "{searchQuery}". Try a different search term.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-100/50 border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            More templates coming soon • © 2026 Email Template Pro
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
