'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Check,
  ExternalLink,
  Mail,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEMPLATES } from '@/lib/templates';
import { exportToHTML } from '@/lib/render-email';
import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

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
      className="group relative"
    >
      <Card className={cn(
        "flex flex-col p-0 transition-all duration-500",
        isActive ? "ring-4 ring-powder-blue-500/10 border-powder-blue-300" : "hover:border-powder-blue-200"
      )}>
        {/* Preview Container */}
        <div className="aspect-[4/3] bg-alabaster-grey-50 relative overflow-hidden group-hover:bg-alabaster-grey-100 transition-colors border-b border-ink-black-100">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-alabaster-grey-200 border-t-powder-blue-600 animate-spin" />
              <span className="text-[10px] font-black text-ink-black-400 uppercase tracking-widest">Rendering...</span>
            </div>
          ) : preview ? (
            <div className="absolute inset-0 origin-top transform scale-[0.4] w-[250%] h-[250%] pointer-events-none transition-transform duration-700 group-hover:scale-[0.42]">
              <iframe
                srcDoc={preview}
                className="w-full h-full border-none pointer-events-none"
                title={template.name}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink-black-300">
              <Mail className="w-12 h-12" />
              <span className="text-[10px] font-bold uppercase tracking-widest">No Preview</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-ink-black-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
            <div className="bg-white text-ink-black-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
              Use Template <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {isActive && (
            <div className="absolute top-4 right-4 bg-powder-blue-600 text-white p-2 rounded-full shadow-lg z-20">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Info Part */}
        <div className="p-6 flex flex-col flex-1 bg-white">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg text-ink-black-900 group-hover:text-powder-blue-600 transition-colors">{template.name}</h3>
              <p className="text-[9px] font-black uppercase tracking-widest text-ink-black-400 mt-0.5">Enterprise Ready</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-xl"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
          <p className="text-xs text-ink-black-500 line-clamp-2 leading-relaxed mb-6 flex-1 font-medium italic opacity-70">
            Tested across all major mail clients for guaranteed deliverability.
          </p>

          <Button
            onClick={() => onSelect(template)}
            variant={isActive ? "outline" : "primary"}
            className="w-full h-11"
            disabled={isActive}
          >
            {isActive ? "Currently Active" : "Select Template"}
          </Button>
        </div>
      </Card>
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-ink-black-900/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-ink-black-100"
      >
        {/* Header */}
        <div className="p-8 border-b border-ink-black-100 flex items-center justify-between bg-alabaster-grey-50/50">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink-black-900">Campaign Library</h2>
            <p className="text-xs text-ink-black-400 font-bold uppercase tracking-widest mt-1">Start with a precision base</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block w-72">
              <Input
                placeholder="Search base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="h-11 shadow-inner bg-white"
              />
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              size="icon"
              className="rounded-full h-11 w-11 shadow-sm"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-alabaster-grey-50/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 bg-alabaster-grey-100 rounded-[32px] flex items-center justify-center mb-8 shadow-inner">
                <Search className="w-10 h-10 text-ink-black-200" />
              </div>
              <h3 className="text-2xl font-bold text-ink-black-900 mb-2">No base found</h3>
              <p className="text-sm font-medium text-ink-black-400 max-w-xs leading-relaxed">
                We couldn't find any templates matching your search criteria.
              </p>
            </div>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
}
