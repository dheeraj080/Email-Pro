'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
// Remove prism imports as Monaco handles its own highlighting
// import { highlight, languages } from 'prismjs';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-typescript';
// import 'prismjs/components/prism-jsx';
// import 'prismjs/components/prism-tsx';
import { renderEmailToReact, exportToHTML } from '@/lib/render-email';
import { TEMPLATES } from '@/lib/templates';
import { 
  Code2, 
  Eye, 
  Download, 
  Copy, 
  Check, 
  Smartphone, 
  Monitor, 
  Trash2, 
  FilePlus2,
  ChevronRight,
  SendHorizontal,
  GripVertical,
  History,
  RotateCcw,
  Save,
  AlertCircle,
  Loader2,
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  LayoutGrid,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { ErrorBoundary } from '@/components/error-boundary';
import TemplateShowcase from '@/components/template-showcase';
import AnalyticsDashboard from '@/components/analytics-dashboard';
import { analyzeEmail, EmailMetrics } from '@/lib/analytics-utils';
import { Template } from '@/lib/types';

export default function EmailEditor({ onBack, initialTemplate }: { onBack?: () => void, initialTemplate?: Template }) {
  const [mounted, setMounted] = useState(false);
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState<Template>(initialTemplate || TEMPLATES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [code, setCode] = useState(activeTemplate.code);
  const [history, setHistory] = useState<Record<string, { id: string; timestamp: number; code: string }[]>>({});
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [customDimensions, setCustomDimensions] = useState<{ width: number; height: number } | null>(null);
  const [view, setView] = useState<'split' | 'editor' | 'preview' | 'analytics'>('split');
  const [language, setLanguage] = useState<'typescript' | 'javascript' | 'html'>('typescript');
  const [previewTab, setPreviewTab] = useState<'design' | 'html'>('design');
  const [isRendering, setIsRendering] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<EmailMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [isTemplatesCollapsed, setIsTemplatesCollapsed] = useState(false);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  // Load saved templates and active template from local storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedTemplates = localStorage.getItem('email_studio_templates');
    const savedActiveId = localStorage.getItem('email_studio_active_template_id');

    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        setTemplates(parsed);
        
        if (savedActiveId) {
          const active = parsed.find((t: any) => t.id === savedActiveId);
          if (active) {
            setActiveTemplate(active);
            setCode(active.code);
          }
        }
      } catch (err) {
        console.error('Failed to parse saved templates:', err);
      }
    }
  }, []);

  // Autosave when code or active template changes
  useEffect(() => {
    if (!mounted) return;

    const timeout = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('email_studio_templates', JSON.stringify(templates.map(t => 
          t.id === activeTemplate.id ? { ...t, code } : t
        )));
        localStorage.setItem('email_studio_active_template_id', activeTemplate.id);
        setLastSaved(Date.now());
      }
    }, 1000); // 1 second debounce for autosave

    return () => clearTimeout(timeout);
  }, [code, templates, activeTemplate.id, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const performRender = async (codeToRender: string) => {
    setIsRendering(true);
    try {
      const html = await exportToHTML(codeToRender);
      setPreviewHtml(html);
      setError(null);
    } catch (err: any) {
      console.error('Preview error:', err);
      setError(err.message || 'An error occurred while rendering');
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    
    // Initial render should be fast
    if (!previewHtml && !error && !isRendering) {
      performRender(code);
      return;
    }

    const timeout = setTimeout(() => {
      performRender(code);
    }, 300);
    return () => clearTimeout(timeout);
  }, [code, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    // Only analyze if in analytics view or if code changes when view is analytics
    const handleAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const results = await analyzeEmail(code);
        setMetrics(results);
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const timeout = setTimeout(() => {
      handleAnalysis();
    }, 1000); // Analysis is slightly more expensive, debounce more

    return () => clearTimeout(timeout);
  }, [code, view === 'analytics', mounted]);

  const handleTemplateChange = (template: Template) => {
    // Save current code to templates array before switching
    setTemplates(prev => prev.map(t => t.id === activeTemplate.id ? { ...t, code } : t));
    
    setActiveTemplate(template);
    setCode(template.code);
    if (template.language) {
      setLanguage(template.language);
    }
    setError(null);
    setPreviewTab('design');
  };

  const handleCreateTemplate = () => {
    setIsCreating(true);
    setNewTemplateName('');
  };

  const confirmCreateTemplate = () => {
    if (!newTemplateName.trim()) {
      setIsCreating(false);
      return;
    }

    // Save current code to templates array before creating
    setTemplates(prev => prev.map(t => t.id === activeTemplate.id ? { ...t, code } : t));

    const id = newTemplateName.toLowerCase().replace(/\s+/g, '-');
    const newTemplate: Template = {
      id: `${id}-${Date.now()}`,
      name: newTemplateName,
      code: language === 'html' ? '<!-- New HTML Template -->' : TEMPLATES[0].code, // Use appropriate starter code
      language: language
    };

    setTemplates(prev => [...prev, newTemplate]);
    setActiveTemplate(newTemplate);
    setCode(newTemplate.code);
    setIsCreating(false);
    setNewTemplateName('');
  };

  const handleReset = () => {
    if (window.confirm('This will reset all templates and delete your drafts. Are you sure?')) {
      localStorage.removeItem('email_studio_templates');
      localStorage.removeItem('email_studio_active_template_id');
      window.location.reload();
    }
  };

  const handleSaveVersion = () => {
    const newVersion = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      code: code
    };
    
    setHistory(prev => ({
      ...prev,
      [activeTemplate.id]: [newVersion, ...(prev[activeTemplate.id] || [])].slice(0, 50) // Keep last 50 versions
    }));
  };

  const handleRevertVersion = (versionCode: string) => {
    if (window.confirm('Are you sure you want to revert to this version? Current changes will be replaced.')) {
      setCode(versionCode);
    }
  };

  const handleCopyHTML = async () => {
    try {
      const html = await exportToHTML(code);
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const html = await exportToHTML(code);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTemplate.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleResize = (e: React.MouseEvent, direction: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw', isSplit: boolean) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    
    const containerId = isSplit ? 'preview-container-split' : 'preview-container';
    const previewEl = document.getElementById(containerId);
    if (!previewEl) return;
    
    const rect = previewEl.getBoundingClientRect();
    const startWidth = rect.width;
    const startHeight = rect.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // Handle horizontal resize (doubled because it's centered)
      if (direction.includes('e')) newWidth = startWidth + deltaX * 2;
      else if (direction.includes('w')) newWidth = startWidth - deltaX * 2;

      // Handle vertical resize (not centered vertically)
      if (direction.includes('s')) newHeight = startHeight + deltaY;
      else if (direction.includes('n')) newHeight = startHeight - deltaY;

      setCustomDimensions({
        width: Math.max(300, newWidth),
        height: Math.max(100, newHeight)
      });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const ResizeHandle = ({ direction, isSplit }: { direction: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw', isSplit: boolean }) => {
    const isHorizontal = direction === 'e' || direction === 'w';
    const isVertical = direction === 'n' || direction === 's';
    const isCorner = direction.length === 2;

    const positions: Record<string, string> = {
      n: "top-0 left-0 w-full h-1.5 cursor-ns-resize",
      s: "bottom-0 left-0 w-full h-1.5 cursor-ns-resize",
      e: "top-0 right-0 w-1.5 h-full cursor-ew-resize",
      w: "top-0 left-0 w-1.5 h-full cursor-ew-resize",
      ne: "top-0 right-0 w-5 h-5 cursor-nesw-resize z-40",
      nw: "top-0 left-0 w-5 h-5 cursor-nwse-resize z-40",
      se: "bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-40",
      sw: "bottom-0 left-0 w-5 h-5 cursor-nesw-resize z-40",
    };

    return (
      <div 
        className={cn(
          "absolute transition-all flex items-center justify-center group/handle z-30",
          positions[direction],
          "hover:bg-blue-500/10"
        )}
        onMouseDown={(e) => handleResize(e, direction, isSplit)}
      >
        {isCorner ? (
          <div className="w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-full shadow-sm scale-75 group-hover/handle:scale-110 transition-transform" />
        ) : (
          <div className={cn(
            "bg-slate-200 group-hover/handle:bg-blue-500 transition-colors rounded-full",
            isHorizontal ? "w-0.5 h-8" : "w-8 h-0.5"
          )} />
        )}
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-slate-900 border-slate-100 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900 border border-slate-200"
              title="Back to Landing Page"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
          <div className="h-6 w-[1px] bg-slate-200 mx-1" />
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs italic shadow-sm">EP</div>
          <h1 className="text-sm font-semibold tracking-tight flex items-center">
            Email Pro <span className="text-slate-400 font-normal mx-2">/</span> 
            <span className="font-medium text-slate-600">{activeTemplate.id.replace(/-/g, '_')}.tsx</span>
            {lastSaved && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                key={lastSaved}
                className="ml-3 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-400 flex items-center gap-1 shadow-sm"
              >
                <Check className="w-2.5 h-2.5 text-green-500" />
                DRAFT SAVED {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </motion.span>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button 
              onClick={() => {
                setPreviewMode('mobile');
                setCustomDimensions(null);
              }} 
              className={cn(
                "p-2 rounded-md transition-all flex items-center justify-center",
                previewMode === 'mobile' && !customDimensions ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-400 hover:text-slate-600"
              )}
              title="Mobile Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                setPreviewMode('desktop');
                setCustomDimensions(null);
              }} 
              className={cn(
                "p-2 rounded-md transition-all flex items-center justify-center",
                previewMode === 'desktop' && !customDimensions ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-400 hover:text-slate-600"
              )}
              title="Desktop Preview"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100/50 border border-slate-200 rounded-lg p-0.5 px-2">
            <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
              <span className="text-[9px] font-bold text-slate-400">W</span>
              <input 
                type="number"
                value={customDimensions?.width || (previewMode === 'mobile' ? 375 : 1024)}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCustomDimensions(prev => ({
                    width: isNaN(val) ? 320 : val,
                    height: prev?.height || (previewMode === 'mobile' ? 667 : 800)
                  }));
                }}
                className="w-10 bg-transparent text-[10px] font-bold text-slate-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold text-slate-400">H</span>
              <input 
                type="number"
                value={customDimensions?.height || (previewMode === 'mobile' ? 667 : 800)}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCustomDimensions(prev => ({
                    width: prev?.width || (previewMode === 'mobile' ? 375 : 1024),
                    height: isNaN(val) ? 200 : val
                  }));
                }}
                className="w-10 bg-transparent text-[10px] font-bold text-slate-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-200" />

          <div className="flex bg-slate-100 p-1 rounded-md">
            <button 
              onClick={() => setView('editor')} 
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded transition-all", 
                view === 'editor' ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-800"
              )}
            >
              Code
            </button>
            <button 
              onClick={() => setView('split')} 
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded transition-all", 
                view === 'split' ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-800"
              )}
            >
              Split
            </button>
            <button 
              onClick={() => setView('preview')} 
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded transition-all", 
                view === 'preview' ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-800"
              )}
            >
              Preview
            </button>
            <button 
              onClick={() => setView('analytics')} 
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded transition-all flex items-center gap-2", 
                view === 'analytics' ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Insights
            </button>
          </div>
          
          <div className="h-4 w-[1px] bg-slate-200" />
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyHTML}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 px-2"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy HTML'}
            </button>
            <button 
              onClick={handleDownload}
              disabled={isExporting}
              className="bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : <><Download className="w-3.5 h-3.5" /> Export HTML</>}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {!isSidebarCollapsed && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 overflow-hidden"
            >
              <div className="w-72 p-5 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="w-1 h-1 bg-slate-300 rounded-full group-focus-within:bg-blue-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 focus:border-slate-300 outline-none transition-all shadow-sm"
              />
            </div>

            <ErrorBoundary name="Templates">
              <section>
                <div 
                  className="flex items-center justify-between mb-4 cursor-pointer group/header"
                  onClick={() => setIsTemplatesCollapsed(!isTemplatesCollapsed)}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: isTemplatesCollapsed ? 0 : 90 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </motion.div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Templates</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowShowcase(true);
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-400 hover:text-slate-900"
                      title="Templates Gallery"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateTemplate();
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-500 hover:text-slate-900"
                      title="New Template"
                    >
                      <FilePlus2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                      }}
                      className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-slate-400 hover:text-red-500"
                      title="Reset All Data"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <AnimatePresence initial={false}>
                  {!isTemplatesCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 pb-4">
                        {isCreating && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-3 p-3 bg-white border border-blue-200 rounded-xl shadow-sm space-y-3"
                          >
                            <input 
                              autoFocus
                              value={newTemplateName}
                              onChange={(e) => setNewTemplateName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') confirmCreateTemplate();
                                if (e.key === 'Escape') setIsCreating(false);
                              }}
                              placeholder="Template name..."
                              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-blue-200"
                            />
                            <div className="flex gap-2">
                              <button 
                                onClick={confirmCreateTemplate}
                                className="flex-1 bg-blue-600 text-white py-1.5 rounded-md text-[10px] font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                              >
                                <Check className="w-3 h-3" /> CREATE
                              </button>
                              <button 
                                onClick={() => setIsCreating(false)}
                                className="flex-1 bg-slate-100 text-slate-600 py-1.5 rounded-md text-[10px] font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> CANCEL
                              </button>
                            </div>
                          </motion.div>
                        )}
                        {templates
                          .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((template) => (
                            <button
                              key={template.id}
                              onClick={() => handleTemplateChange(template)}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all border group",
                                activeTemplate.id === template.id 
                                  ? "bg-white border-slate-200 shadow-sm text-slate-900 font-semibold" 
                                  : "bg-transparent border-transparent text-slate-500 hover:bg-white hover:border-slate-100 hover:text-slate-700"
                              )}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  activeTemplate.id === template.id ? "bg-blue-500" : "bg-slate-300 group-hover:bg-slate-400"
                                )} />
                                <span className="truncate">{template.name}</span>
                              </div>
                              <ChevronRight className={cn(
                                "w-3 h-3 transition-transform",
                                activeTemplate.id === template.id ? "text-slate-400 translate-x-0" : "text-slate-300 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                              )} />
                            </button>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </ErrorBoundary>
            
            <ErrorBoundary name="History">
              <section>
                <div 
                  className="flex items-center justify-between mb-4 cursor-pointer group/header"
                  onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: isHistoryCollapsed ? 0 : 90 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </motion.div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Version History</h3>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveVersion();
                    }}
                    className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-500 hover:text-slate-900"
                  >
                    <Save className="w-3.5 h-3.5" />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {!isHistoryCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 -mr-1 pb-4">
                        {(!history[activeTemplate.id] || history[activeTemplate.id].length === 0) ? (
                          <div className="py-8 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <History className="w-5 h-5 text-slate-300 mx-auto mb-2 opacity-50" />
                            <p className="text-[10px] text-slate-400 font-medium">
                              No versions yet
                            </p>
                          </div>
                        ) : (
                          history[activeTemplate.id].map((v) => (
                            <div 
                              key={v.id}
                              className="group flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-default"
                            >
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[11px] font-bold text-slate-700">
                                  {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-[9px] text-slate-400 font-medium font-mono uppercase tracking-tight">
                                  {new Date(v.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <button 
                                onClick={() => handleRevertVersion(v.code)}
                                className="p-1.5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-lg transition-all text-slate-400 shadow-sm border border-slate-100"
                              >
                                <RotateCcw className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </ErrorBoundary>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {view === 'editor' ? (
              <motion.div 
                key="editor-only"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full h-full flex flex-col bg-[#1e1e1e]"
              >
                <div className="h-9 flex items-center px-4 bg-[#252526] border-b border-[#333] shrink-0">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px] text-slate-400 font-mono tracking-tight">
                      {activeTemplate.id}.{language === 'html' ? 'html' : 'tsx'}
                    </span>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="bg-[#2d2d2d] border border-[#3c3c3c] rounded text-[10px] text-slate-400 px-2 py-1 outline-none hover:bg-[#333] transition-colors"
                    >
                      <option value="typescript">TSX</option>
                      <option value="javascript">JSX</option>
                      <option value="html">HTML</option>
                    </select>
                  </div>
                </div>
                <ErrorBoundary name="Editor" onReset={() => setCode(activeTemplate.code)} className="h-full bg-[#1e1e1e] border-none rounded-none">
                  <div className="flex-1 overflow-hidden">
                    <Editor
                      height="100%"
                      defaultLanguage={language}
                      language={language}
                      value={code}
                      onChange={(value) => setCode(value || '')}
                      theme="vs-dark"
                      options={{
                        fontSize: 13,
                        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                        minimap: { enabled: false },
                        lineNumbers: 'on',
                        folding: true,
                        bracketPairColorization: { enabled: true },
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        padding: { top: 24, bottom: 24 },
                        renderLineHighlight: 'all',
                        cursorBlinking: 'smooth',
                        smoothScrolling: true,
                        wordWrap: 'on',
                      }}
                    />
                  </div>
                </ErrorBoundary>
              </motion.div>
            ) : view === 'preview' ? (
              <motion.div 
                key="preview-only"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full h-full bg-slate-100 flex flex-col"
              >
                <div className="h-9 flex items-center justify-between px-4 bg-slate-50 border-b border-slate-200 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Preview</span>
                    </div>
                    <div className="flex bg-slate-200/50 p-0.5 rounded-md h-6">
                      <button 
                        onClick={() => setPreviewTab('design')}
                        className={cn(
                          "px-2 rounded flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-all",
                          previewTab === 'design' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        Design
                      </button>
                      <button 
                        onClick={() => setPreviewTab('html')}
                        className={cn(
                          "px-2 rounded flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-all",
                          previewTab === 'html' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        HTML
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {customDimensions && (
                      <button 
                        onClick={() => setCustomDimensions(null)}
                        className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100 transition-colors font-bold uppercase tracking-wider"
                      >
                        Reset Size
                      </button>
                    )}
                  </div>
                </div>
                <ErrorBoundary name="Preview" onReset={() => performRender(code)} className="h-full bg-slate-50 border-none rounded-none">
                  <div className="flex-1 flex items-start justify-center p-6 overflow-auto">
                    <div 
                      id="preview-container"
                      className={cn(
                        "bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-xl transition-all duration-500 overflow-hidden border border-slate-200/60 relative groupPreview",
                        !customDimensions && (previewMode === 'mobile' ? "w-[375px] h-[667px]" : "w-full max-w-5xl h-full min-h-[500px]")
                      )}
                      style={customDimensions ? { width: customDimensions.width, height: customDimensions.height, transition: 'none' } : {}}
                    >
                      {/* Resize Overlay to capture mouse events during resize */}
                      {isResizing && <div className="absolute inset-0 z-50 cursor-grabbing" />}

                      {/* Resize Handles */}
                      <ResizeHandle direction="n" isSplit={false} />
                      <ResizeHandle direction="s" isSplit={false} />
                      <ResizeHandle direction="e" isSplit={false} />
                      <ResizeHandle direction="w" isSplit={false} />
                      <ResizeHandle direction="ne" isSplit={false} />
                      <ResizeHandle direction="nw" isSplit={false} />
                      <ResizeHandle direction="se" isSplit={false} />
                      <ResizeHandle direction="sw" isSplit={false} />

                      <div className="w-full h-full bg-white relative">
                        {error ? (
                          <div className="flex flex-col items-center justify-center p-8 h-full text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                              <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Render Error</h3>
                            <p className="text-sm text-slate-500 max-w-xs overflow-hidden text-ellipsis mb-6">{error}</p>
                            <button 
                              onClick={() => performRender(code)} 
                              disabled={isRendering}
                              className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                              {isRendering ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                              Retry Render
                            </button>
                          </div>
                        ) : previewHtml ? (
                          <>
                            {previewTab === 'design' ? (
                              <iframe srcDoc={previewHtml} className="w-full h-full border-none" title="Email Preview" />
                            ) : (
                              <div className="w-full h-full">
                                <Editor
                                  height="100%"
                                  defaultLanguage="html"
                                  value={previewHtml}
                                  theme="vs-dark"
                                  options={{
                                    readOnly: true,
                                    fontSize: 12,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    wordWrap: 'on'
                                  }}
                                />
                              </div>
                            )}
                            {isRendering && (
                              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur shadow-sm border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 z-50">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                                <span className="tracking-widest uppercase">Rendering</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center justify-center p-20 text-center flex-col gap-4 h-full">
                            <div className="w-8 h-8 rounded-full border-2 border-t-slate-900 border-slate-100 animate-spin" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Initializing Preview...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ErrorBoundary>
              </motion.div>
            ) : view === 'analytics' ? (
              <motion.div 
                key="analytics-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full h-full bg-white overflow-hidden"
              >
                <AnalyticsDashboard metrics={metrics} isAnalyzing={isAnalyzing} />
              </motion.div>
            ) : (
              <motion.div 
                key="split-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <Group orientation="horizontal">
                  <Panel defaultSize={50} minSize={30}>
                    <ErrorBoundary name="Split Editor" onReset={() => setCode(activeTemplate.code)} className="h-full bg-[#1e1e1e] border-none rounded-none">
                      <div className="w-full h-full flex flex-col bg-[#1e1e1e] overflow-hidden border-r border-[#333]">
                        <div className="h-9 flex items-center px-4 bg-[#252526] border-b border-[#333] shrink-0">
                          <div className="flex items-center gap-2">
                            <Code2 className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px] text-slate-400 font-mono tracking-tight">
                              {activeTemplate.id}.{language === 'html' ? 'html' : 'tsx'}
                            </span>
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            <select 
                              value={language}
                              onChange={(e) => setLanguage(e.target.value as any)}
                              className="bg-[#2d2d2d] border border-[#3c3c3c] rounded text-[10px] text-slate-400 px-2 py-1 outline-none hover:bg-[#333] transition-colors font-sans"
                            >
                              <option value="typescript">TSX</option>
                              <option value="javascript">JSX</option>
                              <option value="html">HTML</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <Editor
                            height="100%"
                            defaultLanguage={language}
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            theme="vs-dark"
                            options={{
                              fontSize: 13,
                              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                              minimap: { enabled: false },
                              lineNumbers: 'on',
                              folding: true,
                              bracketPairColorization: { enabled: true },
                              automaticLayout: true,
                              scrollBeyondLastLine: false,
                              padding: { top: 24, bottom: 24 },
                              renderLineHighlight: 'all',
                              cursorBlinking: 'smooth',
                              smoothScrolling: true,
                              wordWrap: 'on',
                            }}
                          />
                        </div>
                      </div>
                    </ErrorBoundary>
                  </Panel>
                  
                  <Separator className="w-1.5 bg-slate-200 hover:bg-slate-300 transition-colors flex items-center justify-center relative touch-none group">
                    <div className="w-[1px] h-8 bg-slate-300 group-hover:bg-slate-400 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-slate-200 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <GripVertical className="w-2.5 h-2.5 text-slate-400" />
                    </div>
                  </Separator>
                  
                  <Panel defaultSize={50} minSize={30}>
                    <ErrorBoundary name="Split Preview" onReset={() => performRender(code)} className="h-full bg-slate-50 border-none rounded-none">
                      <div className="w-full h-full bg-slate-100 flex flex-col overflow-hidden">
                        <div className="h-9 flex items-center justify-between px-4 bg-slate-50 border-b border-slate-200 shrink-0">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Preview</span>
                            </div>
                            <div className="flex bg-slate-200/50 p-0.5 rounded-md h-6">
                              <button 
                                onClick={() => setPreviewTab('design')}
                                className={cn(
                                  "px-2 rounded flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-all",
                                  previewTab === 'design' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                              >
                                Design
                              </button>
                              <button 
                                onClick={() => setPreviewTab('html')}
                                className={cn(
                                  "px-2 rounded flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-all",
                                  previewTab === 'html' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                              >
                                HTML
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {customDimensions && (
                              <button 
                                onClick={() => setCustomDimensions(null)}
                                className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100 transition-colors font-bold uppercase tracking-wider"
                              >
                                Reset Size
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 flex items-start justify-center p-6 overflow-auto">
                          <div 
                            id="preview-container-split"
                            className={cn(
                              "bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-xl transition-all duration-500 overflow-hidden border border-slate-200/60 relative groupPreview",
                              !customDimensions && (previewMode === 'mobile' ? "w-[375px] h-[667px]" : "w-full max-w-5xl h-full min-h-[400px]")
                            )}
                            style={customDimensions ? { width: customDimensions.width, height: customDimensions.height, transition: 'none' } : {}}
                          >
                            {/* Resize Overlay to capture mouse events during resize */}
                            {isResizing && <div className="absolute inset-0 z-50 cursor-grabbing" />}

                            {/* Resize Handles */}
                            <ResizeHandle direction="n" isSplit={true} />
                            <ResizeHandle direction="s" isSplit={true} />
                            <ResizeHandle direction="e" isSplit={true} />
                            <ResizeHandle direction="w" isSplit={true} />
                            <ResizeHandle direction="ne" isSplit={true} />
                            <ResizeHandle direction="nw" isSplit={true} />
                            <ResizeHandle direction="se" isSplit={true} />
                            <ResizeHandle direction="sw" isSplit={true} />

                            <div className="w-full h-full bg-white relative">
                              {error ? (
                                <div className="flex flex-col items-center justify-center p-8 h-full text-center">
                                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                  </div>
                                  <h3 className="font-bold text-slate-900 mb-2">Render Error</h3>
                                  <p className="text-sm text-slate-500 max-w-xs overflow-hidden text-ellipsis mb-6">{error}</p>
                                  <button 
                                    onClick={() => performRender(code)} 
                                    disabled={isRendering}
                                    className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                                  >
                                    {isRendering ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                    Retry Render
                                  </button>
                                </div>
                              ) : previewHtml ? (
                                <>
                                  {previewTab === 'design' ? (
                                    <iframe srcDoc={previewHtml} className="w-full h-full border-none" title="Email Preview" />
                                  ) : (
                                    <div className="w-full h-full">
                                      <Editor
                                        height="100%"
                                        defaultLanguage="html"
                                        value={previewHtml}
                                        theme="vs-dark"
                                        options={{
                                          readOnly: true,
                                          fontSize: 12,
                                          minimap: { enabled: false },
                                          scrollBeyondLastLine: false,
                                          automaticLayout: true,
                                          wordWrap: 'on'
                                        }}
                                      />
                                    </div>
                                  )}
                                  {isRendering && (
                                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur shadow-sm border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 z-50">
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                                      <span className="tracking-widest uppercase">Rendering</span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="flex items-center justify-center p-20 text-center flex-col gap-4 h-full">
                                  <div className="w-8 h-8 rounded-full border-2 border-t-slate-900 border-slate-100 animate-spin" />
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Initializing Preview...</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ErrorBoundary>
                  </Panel>
                </Group>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer bar */}
      <footer className="h-8 bg-slate-900 text-slate-400 flex items-center justify-between px-4 text-[10px] font-mono shrink-0 shadow-[0_-1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-4">
          <span className="text-white flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            main*
          </span>
          <span className="opacity-60">{code.split('\n').length} lines</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-white cursor-pointer transition-colors text-slate-500">UTF-8</span>
          <span className="hover:text-white cursor-pointer transition-colors text-slate-500 underline underline-offset-4 decoration-slate-700">TypeScript React</span>
          <span className="text-green-400 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Preview Sync On
          </span>
        </div>
      </footer>

      <AnimatePresence>
        {showShowcase && (
          <TemplateShowcase 
            onClose={() => setShowShowcase(false)}
            onSelect={(template) => {
              handleTemplateChange(template);
              setShowShowcase(false);
            }}
            activeTemplateId={activeTemplate.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
