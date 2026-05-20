'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Check,
  Eye,
  Laptop,
  Tablet,
  Smartphone,
  Layout,
  Code,
  Sparkles,
  Inbox,
  ArrowUpRight,
  Mail,
  Copy,
  Info,
  CheckCircle2,
  FileCode,
  Sliders,
  Scale
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

interface MetricDetails {
  name: string;
  category: 'Curated' | 'Brand Recreation' | 'Barebones';
  readTime: string;
  type: 'official' | 'brand';
  sizeEstimate: string;
  complexity: 'Simple' | 'Medium' | 'Advanced';
  description: string;
}

const OFFICIAL_REACT_EMAIL_METRICS: Record<string, MetricDetails> = {
  'welcome': {
    name: 'Stripe / Developer Onboarding',
    category: 'Brand Recreation',
    readTime: '1.5m read',
    type: 'brand',
    sizeEstimate: '42.1 KB',
    complexity: 'Medium',
    description: 'Clean developers onboarding template based on Stripe\'s signature aesthetic. Highlight grid layout and sleek button blocks.'
  },
  'reset-password': {
    name: 'Notion / Verify Identity',
    category: 'Brand Recreation',
    readTime: '30s read',
    type: 'brand',
    sizeEstimate: '32.8 KB',
    complexity: 'Simple',
    description: 'Security passcode verification layout based on Notion. High readability, minimal style elements.'
  },
  'receipt': {
    name: 'Apple / Store Receipt',
    category: 'Brand Recreation',
    readTime: '1m read',
    type: 'brand',
    sizeEstimate: '65.4 KB',
    complexity: 'Advanced',
    description: 'Double column billing breakdown mockup matching Apple Store purchases. Structured price grids and clean dividing lines.'
  },
  'newsletter': {
    name: 'Newsletter / Matte Theme',
    category: 'Curated',
    readTime: '3m read',
    type: 'official',
    sizeEstimate: '94.2 KB',
    complexity: 'Advanced',
    description: 'Rich publishing template with featured image layouts, columns, and matte cards. Recommended for news and articles.'
  },
  'welcome-v2': {
    name: 'Email.Pro / Welcome Core',
    category: 'Curated',
    readTime: '2m read',
    type: 'official',
    sizeEstimate: '45.0 KB',
    complexity: 'Medium',
    description: 'Our proprietary modern onboarding card. Centered logos, header banner block, and distinct call to actions.'
  },
  'shipping-confirmation': {
    name: 'Nike / Shipping Tracker',
    category: 'Brand Recreation',
    readTime: '1.2m read',
    type: 'brand',
    sizeEstimate: '72.4 KB',
    complexity: 'Advanced',
    description: 'Actionable shipping update template mimicking Nike. Details tracking step indicators and responsive image grid arrays.'
  },
  'tech-summit': {
    name: 'Arcane / Summit RSVP',
    category: 'Curated',
    readTime: '2m read',
    type: 'official',
    sizeEstimate: '81.3 KB',
    complexity: 'Medium',
    description: 'Dark-themed premium event RSVP card. Subtle glow background layers, key details widgets, and inline maps simulation.'
  },
  'legacy-html': {
    name: 'Raw / HTML Boilerplate',
    category: 'Barebones',
    readTime: '1m read',
    type: 'official',
    sizeEstimate: '12.5 KB',
    complexity: 'Simple',
    description: 'Classic nested table email layout using standard clean HTML elements. Zero React compilation required.'
  }
};

// Local read-only Code Highlighter
function CodeHighlighter({ code }: { code: string }) {
  const lines = code.split('\n');

  const highlightLine = (line: string) => {
    if (!line.trim()) return <span className="inline-block h-4" />;
    if (line.trim().startsWith('//')) {
      return <span className="text-[#6A9955]">{line}</span>;
    }
    if (line.trim().startsWith('import ')) {
      const fromIdx = line.indexOf(' from ');
      if (fromIdx !== -1) {
        return (
          <span>
            <span className="text-[#C586C0] font-semibold">import</span>
            <span className="text-[#9CDCFE]">{line.substring(line.indexOf('import') + 6, fromIdx)}</span>
            <span className="text-[#C586C0] font-semibold">from</span>{' '}
            <span className="text-[#CE9178]">{line.substring(fromIdx + 6)}</span>
          </span>
        );
      }
    }
    if (line.includes('<') || line.includes('>')) {
      return <span className="text-[#569CD6]">{line}</span>;
    }
    return <span className="text-[#D4D4D4]">{line}</span>;
  };

  return (
    <pre className="text-[10px] leading-[16px] font-mono text-neutral-300 p-4 bg-neutral-900 overflow-auto h-full max-h-[350px] rounded-xl border border-neutral-800">
      {lines.map((line, idx) => (
        <div key={idx} className="flex">
          <span className="w-6 text-neutral-600 text-right pr-2 select-none border-r border-neutral-800 mr-2 text-[9px]">{idx + 1}</span>
          <span className="whitespace-pre">{highlightLine(line)}</span>
        </div>
      ))}
    </pre>
  );
}

function TemplateCard({ template, isActive, onSelect, onZoom, preview, isLoading, onLoadPreview }: TemplateCardProps) {
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

  const complexityColors = {
    Simple: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Medium: 'bg-amber-50 text-amber-600 border-amber-100',
    Advanced: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };

  return (
    <div className="group flex flex-col relative">
      {/* Aspect visual frame - Safari browser mock styling */}
      <div 
        onClick={() => onSelect(template)}
        className={cn(
          "aspect-[16/11] bg-white relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col shadow-sm",
          isActive 
            ? "border-neutral-900 ring-1 ring-neutral-900 shadow-md" 
            : "border-neutral-200/60 hover:border-neutral-300 hover:shadow-md"
        )}
      >
        {/* Safari Top Bar Header */}
        <div className="h-7 bg-neutral-50 border-b border-neutral-200/50 px-3 flex items-center justify-between shrink-0">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
          </div>
          <div className="bg-white border border-neutral-200/40 rounded px-2.5 py-0.5 text-[8px] text-neutral-400 font-mono tracking-wide truncate max-w-[120px]">
            {template.id}.tsx
          </div>
          <div className="w-4" />
        </div>

        {/* Viewport Frame */}
        <div className="flex-1 bg-white relative overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
              <div className="w-4 h-4 rounded-full border-2 border-neutral-100 border-t-neutral-800 animate-spin" />
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Compiling</span>
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
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-neutral-300">
              <Mail className="w-7 h-7 stroke-[1.2]" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">No Preview</span>
            </div>
          )}

          {/* Action card buttons floating on hover */}
          <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(template);
              }}
              className="bg-white hover:bg-neutral-50 text-neutral-900 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            >
              Use Blueprint
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onZoom(template);
              }}
              className="bg-neutral-900 hover:bg-neutral-800 text-white p-2 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
              title="Inspect Simulator"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {isActive && (
            <div className="absolute top-2 right-2 bg-neutral-950 text-white p-1 rounded-full shadow-md z-10">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* Typography metadata underneath the card */}
      <div className="mt-3.5 pl-0.5">
        <div className="flex items-start justify-between gap-2">
          <h4 
            onClick={() => onSelect(template)}
            className="font-bold text-[13px] text-neutral-900 tracking-tight hover:text-indigo-600 transition-colors cursor-pointer truncate"
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

export default function TemplateShowcase({ onSelect, onClose, activeTemplateId }: TemplateShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomTemplate, setZoomTemplate] = useState<Template | null>(null);
  const [zoomPreviewMode, setZoomPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeCategory, setActiveCategory] = useState<'all' | 'curated' | 'brands' | 'barebones'>('all');
  const [zoomTab, setZoomTab] = useState<'preview' | 'code'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);
  
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loadingPreviews, setLoadingPreviews] = useState<Record<string, boolean>>({});

  const loadingRefs = React.useRef<Record<string, boolean>>({});
  const loadedRefs = React.useRef<Record<string, boolean>>({});

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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filter templates based on Search and Selected Sidebar Category
  const getFilteredTemplates = () => {
    return TEMPLATES.filter(t => {
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
  };

  const filteredTemplates = getFilteredTemplates();

  // Sidebar count helper
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

  const activeZoomMeta = zoomTemplate ? OFFICIAL_REACT_EMAIL_METRICS[zoomTemplate.id] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-neutral-950/20 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 12 }}
        className="bg-white w-full max-w-[95vw] xl:max-w-7xl h-full max-h-[88vh] rounded-[32px] shadow-2xl flex overflow-hidden border border-neutral-200/50"
      >
        
        {/* SIDEBAR CATEGORY EXPLORER */}
        <div className="w-[240px] bg-neutral-50/80 border-r border-neutral-200/50 p-6 flex flex-col justify-between shrink-0 hidden sm:flex">
          <div className="space-y-7">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-neutral-800" />
              <h3 className="font-bold text-xs tracking-wider uppercase text-neutral-800">Blueprints</h3>
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
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/40"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.label}
                  </span>
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                    activeCategory === item.id
                      ? "bg-neutral-800 text-white border-neutral-700"
                      : "bg-white text-neutral-400 border-neutral-200/60"
                  )}>
                    {getCategoryCount(item.id as any)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-neutral-100/60 border border-neutral-200/60 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-neutral-400">
              <Info className="w-3 h-3 text-neutral-400" /> COMPILER METRICS
            </div>
            <div className="space-y-2 text-[10px] font-semibold text-neutral-500">
              <div className="flex justify-between">
                <span>Output Format:</span>
                <span className="text-neutral-800 font-bold">Inlined CSS</span>
              </div>
              <div className="flex justify-between">
                <span>Size Control:</span>
                <span className="text-neutral-800 font-bold">102KB Warn</span>
              </div>
              <div className="flex justify-between">
                <span>Core Framework:</span>
                <span className="text-neutral-800 font-bold">React Email</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN BLUEPRINTS LIST CONTAINER */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Search Toolbar */}
          <div className="px-8 py-5 border-b border-neutral-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white shrink-0">
            <div>
              <h3 className="font-black text-xl text-neutral-900 tracking-tight leading-none">Select Blueprint</h3>
              <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-1.5">Open source React templates for inlining</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search input field */}
              <div className="relative w-full sm:w-56">
                <Input
                  placeholder="Search blueprint templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-3.5 h-3.5 text-neutral-400" />}
                  className="h-9 bg-neutral-50 rounded-full border-neutral-200/60 focus-visible:ring-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 pl-9"
                />
              </div>

              <button
                onClick={onClose}
                className="w-8.5 h-8.5 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-400 hover:text-neutral-800 transition-all hover:bg-neutral-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Catalog grid body */}
          <div className="flex-grow overflow-y-auto px-8 py-8 bg-[#FAFBFB] custom-scrollbar">
            
            {filteredTemplates.length > 0 ? (
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
                <div className="w-12 h-12 bg-white rounded-2xl border border-neutral-200/60 flex items-center justify-center mb-4 text-neutral-400 shadow-sm">
                  <Inbox className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-800 mb-1">No blueprints matched</h4>
                <p className="text-xs text-neutral-400 font-medium max-w-xs leading-relaxed">
                  We couldn't find any email templates matching your query or selected filters. Try another query.
                </p>
              </div>
            )}

          </div>

        </div>

      </motion.div>

      {/* DOUBLE-PANEL SIMULATOR VIEWPORT INSPECTOR */}
      <AnimatePresence>
        {zoomTemplate && activeZoomMeta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-neutral-950/20 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 12 }}
              className="bg-white w-full max-w-5xl h-full max-h-[82vh] rounded-[28px] overflow-hidden flex flex-col shadow-2xl border border-neutral-200/50"
            >
              
              {/* SIMULATOR MODAL BAR HEADER */}
              <div className="px-6 py-4 border-b border-neutral-200/50 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-700 shadow-2xs">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wide leading-none">
                      {activeZoomMeta.name}
                    </h4>
                    <span className="text-[8px] text-neutral-400 font-black tracking-wider block mt-1.5 uppercase">Interactive Testing Sandbox</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Viewport Width toggle controls */}
                  <div className="flex bg-neutral-50 border border-neutral-200/60 rounded-xl p-0.5 shadow-2xs">
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
                            ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/60" 
                            : "text-neutral-400 hover:text-neutral-600"
                        )}
                      >
                        {btn.icon}
                        {btn.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      onSelect(zoomTemplate);
                      setZoomTemplate(null);
                    }}
                    disabled={activeTemplateId === zoomTemplate.id}
                    className={cn(
                      "h-8.5 rounded-xl px-4.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                      activeTemplateId === zoomTemplate.id 
                        ? "bg-neutral-50 text-neutral-400 border border-neutral-200 cursor-not-allowed shadow-none" 
                        : "bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm"
                    )}
                  >
                    {activeTemplateId === zoomTemplate.id ? 'Selected' : 'Use Blueprint'}
                  </Button>

                  <button
                    onClick={() => setZoomTemplate(null)}
                    className="w-8.5 h-8.5 rounded-full border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-400 hover:text-neutral-800 flex items-center justify-center shadow-2xs p-0 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* MODAL MAIN CONTENT DISPLAY (Split columns) */}
              <div className="flex-1 flex overflow-hidden bg-neutral-50/50">
                
                {/* LEFT: EMAIL RENDER VIEWPORT (Resizeable width) */}
                <div className="flex-1 flex items-center justify-center p-6 md:p-8 overflow-hidden relative border-r border-neutral-200/50">
                  <div 
                    className={cn(
                      "h-full bg-white shadow-md transition-all duration-300 rounded-2xl overflow-hidden border border-neutral-200 flex flex-col",
                      zoomPreviewMode === 'desktop' && "w-full",
                      zoomPreviewMode === 'tablet' && "w-[560px] max-w-full",
                      zoomPreviewMode === 'mobile' && "w-[360px] max-w-full"
                    )}
                  >
                    {/* Simulator Frame Address block */}
                    <div className="h-9 bg-neutral-50 border-b border-neutral-100 px-4 flex items-center justify-between text-[9px] text-neutral-400 font-mono">
                      <span>To: client@sandbox.engine</span>
                      <span>Estimated payload size: {activeZoomMeta.sizeEstimate}</span>
                    </div>

                    <iframe 
                      srcDoc={previews[zoomTemplate.id] || "<html><body style='display:flex;align-items:center;justify-center;font-family:sans-serif;color:#888;font-size:11px'>Rendering...</body></html>"} 
                      className="w-full h-full border-none flex-grow bg-white"
                      title="Fullscreen Preview Simulator"
                    />
                  </div>
                </div>

                {/* RIGHT: DETAILS METADATA & CODE DRAWER (320px width) */}
                <div className="w-[320px] bg-white flex flex-col justify-between shrink-0 p-5 overflow-y-auto custom-scrollbar">
                  
                  <div className="space-y-6">
                    {/* Tab Selection */}
                    <div className="flex bg-neutral-50 border border-neutral-200/60 rounded-xl p-0.5 shadow-2xs">
                      <button
                        onClick={() => setZoomTab('preview')}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5",
                          zoomTab === 'preview' ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/60" : "text-neutral-400"
                        )}
                      >
                        <Scale className="w-3 h-3" /> Info & Quality
                      </button>
                      <button
                        onClick={() => setZoomTab('code')}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5",
                          zoomTab === 'code' ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/60" : "text-neutral-400"
                        )}
                      >
                        <Code className="w-3 h-3" /> React Code
                      </button>
                    </div>

                    {zoomTab === 'preview' ? (
                      /* METADATA INFO PANEL */
                      <div className="space-y-5">
                        <div>
                          <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400 block mb-1">Blueprint Profile</span>
                          <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                            {activeZoomMeta.description}
                          </p>
                        </div>

                        <div className="bg-neutral-50 border border-neutral-200/60 rounded-2xl p-4 space-y-3 shadow-2xs">
                          <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400 block">Accessibility Audits</span>
                          
                          <div className="space-y-2">
                            {[
                              { label: 'Gmail 102KB Limit', status: 'Compliant', desc: `${activeZoomMeta.sizeEstimate} total output` },
                              { label: 'Responsive Flex Grid', status: 'Pass', desc: 'Tested mobile viewport layouts' },
                              { label: 'Image Alt safety', status: 'Pass', desc: 'Default attribute setups' },
                              { label: 'Contrast Ratio (AAA)', status: 'Verified', desc: 'High compliance color set' }
                            ].map((audit) => (
                              <div key={audit.label} className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-[10px] font-bold text-neutral-800 leading-none">{audit.label}</div>
                                  <span className="text-[8px] text-neutral-400 font-medium">{audit.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 text-[10px] font-semibold text-neutral-500 pl-0.5">
                          <div className="flex justify-between">
                            <span>Complexity:</span>
                            <span className="text-neutral-800 font-bold">{activeZoomMeta.complexity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Language:</span>
                            <span className="text-neutral-800 font-bold uppercase">{zoomTemplate.language}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated Read Time:</span>
                            <span className="text-neutral-800 font-bold">{activeZoomMeta.readTime}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* JSX SOURCE CODE TAB PANEL */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5"><FileCode className="w-3.5 h-3.5" /> {zoomTemplate.id}.tsx</span>
                          <button
                            onClick={() => handleCopyCode(zoomTemplate.code)}
                            className="text-[9px] font-black uppercase tracking-wider text-powder-blue-600 hover:text-powder-blue-700 flex items-center gap-1 transition-colors"
                          >
                            {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedCode ? 'Copied' : 'Copy code'}
                          </button>
                        </div>

                        <div className="h-[300px]">
                          <CodeHighlighter code={zoomTemplate.code} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-200/50 mt-4 flex items-center gap-2 text-[9px] font-bold text-neutral-400">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Selected templates sync automatically to your active workspace Monaco Editor.</span>
                  </div>

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
