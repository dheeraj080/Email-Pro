'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Template } from '@/lib/types';
import { TEMPLATES, blankReactEmailTemplate, blankHtmlEmailTemplate } from '@/lib/templates';
import { exportToHTML } from '@/lib/render-email';
import { analyzeEmail, EmailMetrics } from '@/lib/analytics-utils';
import { auditEmailQuality, EmailQualityReport, sanitizeRenderError } from '@/lib/email-quality';
import { 
  saveDraft, 
  loadDraft, 
  clearDraft, 
  isCodeDirty, 
  EmailDraft 
} from '@/lib/draft-storage';

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

export function useEmailEditor(initialTemplate?: Template) {
  const [mounted, setMounted] = useState(false);
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState<Template>(initialTemplate || TEMPLATES[0]);
  const [code, setCode] = useState(activeTemplate.code);
  const [history, setHistory] = useState<Record<string, { id: string; timestamp: number; code: string }[]>>({});
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [customDimensions, setCustomDimensions] = useState<{ width: number; height: number } | null>(null);
  const [view, setView] = useState<'split' | 'editor' | 'preview' | 'analytics'>('split');
  const [language, setLanguage] = useState<'typescript' | 'javascript' | 'html'>(
    (initialTemplate?.language as any) || TEMPLATES[0].language || 'typescript'
  );
  const [previewTab, setPreviewTab] = useState<'design' | 'html' | 'json' | 'quality'>('design');
  const [isRendering, setIsRendering] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<EmailMetrics | null>(null);

  // Authoritative static quality analysis derived immediately from compiled HTML
  const qualityReport: EmailQualityReport | null = useMemo(() => {
    if (!previewHtml) return null;
    return auditEmailQuality(previewHtml);
  }, [previewHtml]);

  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateFolder, setNewTemplateFolder] = useState('');
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Phase 15 Unsaved Work Protection & Recovery States
  const [pendingDraftRecovery, setPendingDraftRecovery] = useState<EmailDraft | null>(null);
  const [pendingSwitchTemplate, setPendingSwitchTemplate] = useState<Template | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const renderSeqRef = useRef(0);

  const showToast = useCallback((title: string, message?: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const newToast: ToastNotification = {
      id: Math.random().toString(36).substring(7),
      title,
      message,
      type
    };
    setToast(newToast);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  const hideToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast(null);
  }, []);

  // Compute whether user has unsaved modifications compared to active template baseline
  const hasUnsavedChanges = useMemo(() => {
    return isCodeDirty(code, activeTemplate.code);
  }, [code, activeTemplate.code]);

  // Prevent accidental browser closure / reload when unsaved changes exist
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Load saved templates, active template, history, and check for draft recovery on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Auto-migrate and force reload newly designed premium v3 templates
    const currentVersion = 'v3';
    const savedVersion = localStorage.getItem('email_pro_templates_version');
    
    if (savedVersion !== currentVersion) {
      localStorage.removeItem('email_pro_templates');
      localStorage.removeItem('email_pro_active_template_id');
      localStorage.removeItem('email_pro_history');
      localStorage.setItem('email_pro_templates_version', currentVersion);
      
      const targetTmpl = initialTemplate || TEMPLATES[0];
      setTemplates(TEMPLATES);
      setActiveTemplate(targetTmpl);
      setCode(targetTmpl.code);
      setLanguage(targetTmpl.language || 'typescript');
      setMounted(true);
      return;
    }

    const savedTemplates = localStorage.getItem('email_pro_templates');
    const savedActiveId = localStorage.getItem('email_pro_active_template_id');
    const savedHistory = localStorage.getItem('email_pro_history');

    let loadedTemplates = TEMPLATES;
    let chosenTemplate = initialTemplate || TEMPLATES[0];

    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedTemplates = parsed;
          setTemplates(parsed);
          
          if (!initialTemplate && savedActiveId) {
            const active = parsed.find((t: any) => t.id === savedActiveId);
            if (active) {
              chosenTemplate = active;
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

    setActiveTemplate(chosenTemplate);
    setCode(chosenTemplate.code);
    if (chosenTemplate.language) {
      setLanguage(chosenTemplate.language);
    }

    // Check for existing local draft recovery
    const savedDraft = loadDraft();
    if (savedDraft && savedDraft.templateId === chosenTemplate.id) {
      if (isCodeDirty(savedDraft.code, chosenTemplate.code)) {
        setPendingDraftRecovery(savedDraft);
      }
    }

    setMounted(true);
  }, [initialTemplate]);

  // Debounced Local Draft Persistence (Phase 15D)
  useEffect(() => {
    if (!mounted) return;

    const timeout = setTimeout(() => {
      if (hasUnsavedChanges) {
        saveDraft({
          templateId: activeTemplate.id,
          code,
          language
        });
        setLastSaved(Date.now());
      } else {
        // If code is back to template baseline, remove draft
        clearDraft();
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [code, language, activeTemplate.id, hasUnsavedChanges, mounted]);

  // Save history to local storage when history state changes
  useEffect(() => {
    if (!mounted) return;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('email_pro_history', JSON.stringify(history));
      } catch (err) {
        console.warn('Failed to save history to localStorage:', err);
      }
    }
  }, [history, mounted]);

  const performRender = useCallback(async (codeToRender: string, currentLanguage?: string) => {
    const seq = ++renderSeqRef.current;
    setIsRendering(true);
    try {
      const html = await exportToHTML(codeToRender, currentLanguage || language, activeTemplate.id, templates);
      if (seq === renderSeqRef.current) {
        setPreviewHtml(html);
        setError(null);
        setIsDirty(false);
      }
      return true;
    } catch (err: any) {
      if (seq === renderSeqRef.current) {
        console.error('Preview render failure:', err);
        const cleanMessage = sanitizeRenderError(err?.message || String(err));
        setError(cleanMessage);
      }
      return false;
    } finally {
      if (seq === renderSeqRef.current) {
        setIsRendering(false);
      }
    }
  }, [language, activeTemplate.id, templates]);

  // Single debounced background compilation for authoritative server rendering
  useEffect(() => {
    if (!mounted) return;
    
    setIsDirty(true);

    const timeout = setTimeout(() => {
      performRender(code, language);
    }, 400);

    return () => clearTimeout(timeout);
  }, [code, language, mounted, performRender]);

  useEffect(() => {
    if (!mounted) return;
    
    const handleAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const results = await analyzeEmail(code, previewHtml);
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
  }, [code, previewHtml, view, mounted]);

  // Template Switching with Unsaved Work Protection (Phase 15C & 15G)
  const handleTemplateChange = (template: Template) => {
    if (template.id === activeTemplate.id) return;

    if (hasUnsavedChanges) {
      // Prompt user with options: Save revision & switch, discard & switch, or cancel
      setPendingSwitchTemplate(template);
    } else {
      // Clean template switch
      executeTemplateSwitch(template);
    }
  };

  const executeTemplateSwitch = (template: Template) => {
    clearDraft();
    setActiveTemplate(template);
    setCode(template.code);
    if (template.language) {
      setLanguage(template.language);
    }
    setError(null);
    setPendingSwitchTemplate(null);
    setPendingDraftRecovery(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('email_pro_active_template_id', template.id);
    }
  };

  const confirmSwitchSaveRevision = () => {
    if (!pendingSwitchTemplate) return;
    // Save current version to history
    handleSaveVersion();
    showToast('Revision saved', `Saved a version for ${activeTemplate.name}`, 'success');
    executeTemplateSwitch(pendingSwitchTemplate);
  };

  const confirmSwitchDiscard = () => {
    if (!pendingSwitchTemplate) return;
    showToast('Changes discarded', `Switched to ${pendingSwitchTemplate.name}`, 'info');
    executeTemplateSwitch(pendingSwitchTemplate);
  };

  const cancelSwitch = () => {
    setPendingSwitchTemplate(null);
  };

  // Draft Recovery Handlers (Phase 15E)
  const handleRestoreDraft = () => {
    if (!pendingDraftRecovery) return;
    setCode(pendingDraftRecovery.code);
    if (pendingDraftRecovery.language) {
      setLanguage(pendingDraftRecovery.language);
    }
    setPendingDraftRecovery(null);
    showToast('Draft restored', 'Restored your previous unsaved edits', 'success');
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setPendingDraftRecovery(null);
    showToast('Draft discarded', 'Reverted to the clean template baseline', 'info');
  };

  const handleCreateTemplate = () => {
    setIsCreating(true);
    setNewTemplateName('');
    setNewTemplateFolder('');
  };

  // Blank email and starter support (Phase 15H)
  const confirmCreateTemplate = (
    folderName?: string, 
    starterType: 'blank-tsx' | 'blank-html' | 'current' = 'blank-tsx'
  ) => {
    if (!newTemplateName.trim()) {
      setIsCreating(false);
      return;
    }

    const id = newTemplateName.toLowerCase().replace(/\s+/g, '-');
    const folderToUse = folderName !== undefined ? folderName : newTemplateFolder;
    
    let starterCode = blankReactEmailTemplate;
    let starterLanguage: 'typescript' | 'javascript' | 'html' = 'typescript';

    if (starterType === 'blank-html') {
      starterCode = blankHtmlEmailTemplate;
      starterLanguage = 'html';
    } else if (starterType === 'current') {
      starterCode = code;
      starterLanguage = language;
    }

    const newTemplate: Template = {
      id: `${id}-${Date.now()}`,
      name: newTemplateName.trim(),
      code: starterCode,
      language: starterLanguage,
      folder: folderToUse.trim() ? folderToUse.trim() : undefined
    };

    setTemplates(prev => {
      const updated = [...prev, newTemplate];
      if (typeof window !== 'undefined') {
        localStorage.setItem('email_pro_templates', JSON.stringify(updated));
        localStorage.setItem('email_pro_active_template_id', newTemplate.id);
      }
      return updated;
    });

    clearDraft();
    setActiveTemplate(newTemplate);
    setCode(newTemplate.code);
    setLanguage(newTemplate.language || 'typescript');
    setIsCreating(false);
    setNewTemplateName('');
    setNewTemplateFolder('');
    showToast('Template created', `Created ${newTemplate.name}`, 'success');
  };

  const handleReset = () => {
    if (typeof window !== 'undefined' && window.confirm('This will reset all templates and delete local drafts. Are you sure?')) {
      clearDraft();
      localStorage.removeItem('email_pro_templates');
      localStorage.removeItem('email_pro_active_template_id');
      localStorage.removeItem('email_pro_history');
      localStorage.removeItem('email_pro_templates_version');
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
    setLastSaved(Date.now());
    showToast('Revision saved', `Revision stored in session history`, 'success');
  };

  const handleRevertVersion = (versionCode: string) => {
    if (typeof window !== 'undefined' && window.confirm('Revert editor code to this revision? Current edits will be replaced.')) {
      setCode(versionCode);
      showToast('Reverted revision', 'Loaded previous code state', 'info');
    }
  };

  const handleCopyHTML = async () => {
    try {
      const html = previewHtml || await exportToHTML(code, language, activeTemplate.id, templates);
      await navigator.clipboard.writeText(html);
      setCopied(true);
      showToast('HTML copied', 'Compiled HTML copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      console.error('Copy to Clipboard error:', err);
      showToast('Copy failed', err?.message || 'Failed to copy to clipboard', 'error');
    }
  };

  const handleMoveTemplate = useCallback((templateId: string, targetFolder: string) => {
    setTemplates(prev => {
      const updated = prev.map(t => {
        if (t.id === templateId) {
          return { ...t, folder: targetFolder.trim() ? targetFolder.trim() : undefined };
        }
        return t;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('email_pro_templates', JSON.stringify(updated));
      }
      return updated;
    });

    if (activeTemplate.id === templateId) {
      setActiveTemplate(prev => ({
        ...prev,
        folder: targetFolder.trim() ? targetFolder.trim() : undefined
      }));
    }
  }, [activeTemplate.id]);

  const handleDeleteTemplate = useCallback((templateId: string) => {
    if (templates.length <= 1) {
      alert("You cannot delete the only remaining template in your workspace.");
      return;
    }
    
    const updated = templates.filter(t => t.id !== templateId);
    setTemplates(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('email_pro_templates', JSON.stringify(updated));
    }
    
    if (activeTemplate.id === templateId) {
      const nextActive = updated[0];
      executeTemplateSwitch(nextActive);
    }
  }, [templates, activeTemplate.id]);

  const handleDownloadWorkspace = async () => {
    setIsExporting(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const t of templates) {
        const templateCode = t.id === activeTemplate.id ? code : t.code;
        const fileName = `${t.name.toLowerCase().replace(/\s+/g, '-')}.html`;

        let finalHtml = '';
        if (t.language === 'html') {
          finalHtml = templateCode;
        } else {
          try {
            finalHtml = await exportToHTML(templateCode, t.language || 'typescript', t.id, templates);
          } catch (compileErr: any) {
            console.error(`Failed to compile template ${t.name}:`, compileErr);
            finalHtml = `<!-- COMPILATION FAILED: ${compileErr.message || compileErr} -->\n${templateCode}`;
          }
        }

        if (t.folder) {
          zip.folder(t.folder)?.file(fileName, finalHtml);
        } else {
          zip.file(fileName, finalHtml);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-pro-templates.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Workspace exported', `Downloaded zip containing ${templates.length} templates`, 'success');
    } catch (err: any) {
      console.error('Workspace export error:', err);
      showToast('Export failed', err?.message || 'Could not bundle workspace', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const html = previewHtml || await exportToHTML(code, language, activeTemplate.id, templates);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `${activeTemplate.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('File exported', `Downloaded ${fileName}`, 'success');
    } catch (err: any) {
      console.error('Export error:', err);
      showToast('Export failed', err?.message || 'Could not export HTML', 'error');
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
    newTemplateFolder,
    setNewTemplateFolder,
    lastSaved,
    handleTemplateChange,
    handleCreateTemplate,
    confirmCreateTemplate,
    handleReset,
    handleSaveVersion,
    handleRevertVersion,
    handleCopyHTML,
    handleDownload,
    handleDownloadWorkspace,
    handleDeleteTemplate,
    handleMoveTemplate,
    isDirty,
    performRender,
    qualityReport,
    // Phase 15 additions
    hasUnsavedChanges,
    pendingDraftRecovery,
    handleRestoreDraft,
    handleDiscardDraft,
    pendingSwitchTemplate,
    confirmSwitchSaveRevision,
    confirmSwitchDiscard,
    cancelSwitch,
    toast,
    showToast,
    hideToast
  };
}
