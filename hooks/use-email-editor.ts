'use client';

import { useState, useEffect, useCallback } from 'react';
import { Template } from '@/lib/types';
import { TEMPLATES } from '@/lib/templates';
import { exportToHTML } from '@/lib/render-email';
import { analyzeEmail, EmailMetrics } from '@/lib/analytics-utils';

export function useEmailEditor(initialTemplate?: Template) {
  const [mounted, setMounted] = useState(false);
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState<Template>(initialTemplate || TEMPLATES[0]);
  const [code, setCode] = useState(activeTemplate.code);
  const [history, setHistory] = useState<Record<string, { id: string; timestamp: number; code: string }[]>>({});
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewComponent, setPreviewComponent] = useState<React.ReactNode>(null);
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
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  // Load saved templates, active template, and history from local storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedTemplates = localStorage.getItem('email_studio_templates');
    const savedActiveId = localStorage.getItem('email_studio_active_template_id');
    const savedHistory = localStorage.getItem('email_studio_history');

    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        setTemplates(parsed);
        
        if (savedActiveId) {
          const active = parsed.find((t: any) => t.id === savedActiveId);
          if (active) {
            setActiveTemplate(active);
            setCode(active.code);
            if (active.language) {
              setLanguage(active.language);
            }
          }
        }
      } catch (err) {
        console.error('Failed to parse saved templates:', err);
      }
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Failed to parse saved history:', err);
      }
    }

    setMounted(true);
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
    }, 1000);

    return () => clearTimeout(timeout);
  }, [code, templates, activeTemplate.id, mounted]);

  // Save history to local storage when history state changes
  useEffect(() => {
    if (!mounted) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('email_studio_history', JSON.stringify(history));
    }
  }, [history, mounted]);

  const performRender = useCallback(async (codeToRender: string, currentLanguage?: string) => {
    // Only call server-side render if we actually need the HTML
    setIsRendering(true);
    try {
      const html = await exportToHTML(codeToRender, currentLanguage || language);
      setPreviewHtml(html);
      setError(null);
    } catch (err: any) {
      console.error('Preview error:', err);
      setError(err.message || 'An error occurred while rendering');
    } finally {
      setIsRendering(false);
    }
  }, [language]);

  // Fast local React rendering for visual preview
  useEffect(() => {
    if (!mounted) return;

    const timeout = setTimeout(() => {
      try {
        const { renderEmailToReact } = require('@/lib/render-email');
        const Component = renderEmailToReact(code);
        setPreviewComponent(Component);
        setError(null);
      } catch (err: any) {
        console.warn('Local render error:', err);
        // Don't set error state yet, as the server-side might handle it better 
        // or we don't want to flicker errors while typing
      }
    }, 100); // Very fast debounce for local render

    return () => clearTimeout(timeout);
  }, [code, mounted]);

  // Debounced server-side render for HTML tab and export
  useEffect(() => {
    if (!mounted) return;
    
    // Only trigger server render faster if we are in HTML tab
    const delay = previewTab === 'html' ? 300 : 1500; 

    const timeout = setTimeout(() => {
      performRender(code, language);
    }, delay);

    return () => clearTimeout(timeout);
  }, [code, language, mounted, performRender, previewTab]);

  useEffect(() => {
    if (!mounted) return;
    
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

    if (view === 'analytics') {
      const timeout = setTimeout(handleAnalysis, 1000);
      return () => clearTimeout(timeout);
    }
  }, [code, view, mounted]);

  const handleTemplateChange = (template: Template) => {
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

    setTemplates(prev => prev.map(t => t.id === activeTemplate.id ? { ...t, code } : t));

    const id = newTemplateName.toLowerCase().replace(/\s+/g, '-');
    const newTemplate: Template = {
      id: `${id}-${Date.now()}`,
      name: newTemplateName,
      code: language === 'html' ? '<!-- New HTML Template -->' : TEMPLATES[0].code,
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
      localStorage.removeItem('email_studio_history');
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
      [activeTemplate.id]: [newVersion, ...(prev[activeTemplate.id] || [])].slice(0, 50)
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
      console.error('Copy to Clipboard error:', err);
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
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    mounted,
    templates,
    activeTemplate,
    code,
    setCode,
    history,
    previewHtml,
    previewComponent,
    previewMode,
    setPreviewMode,
    customDimensions,
    setCustomDimensions,
    view,
    setView,
    language,
    setLanguage,
    previewTab,
    setPreviewTab,
    isRendering,
    isAnalyzing,
    metrics,
    error,
    copied,
    isExporting,
    isCreating,
    setIsCreating,
    newTemplateName,
    setNewTemplateName,
    lastSaved,
    handleTemplateChange,
    handleCreateTemplate,
    confirmCreateTemplate,
    handleReset,
    handleSaveVersion,
    handleRevertVersion,
    handleCopyHTML,
    handleDownload,
    performRender
  };
}
