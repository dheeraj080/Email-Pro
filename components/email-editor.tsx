'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Home,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Panel, Group, Separator } from 'react-resizable-panels';

import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/error-boundary';
import { Template } from '@/lib/types';
import { useEmailEditor } from '@/hooks/use-email-editor';

// Sub-components
import { TemplateSidebar } from './editor/template-sidebar';
import { EditorToolbar } from './editor/editor-toolbar';
import { EditorContent } from './editor/editor-content';
import { PreviewContent } from './editor/preview-content';
import { AnalyticsView } from './editor/analytics-view';
import { CreateTemplateDialog } from './editor/create-template-dialog';
import { HistorySidebar } from './editor/history-sidebar';
import { SendTestDialog } from './editor/send-test-dialog';
import { AIAssistantDialog } from './editor/ai-assistant-dialog';
import { EditorSettingsDialog } from './editor/editor-settings-dialog';
import { DraftRecoveryBanner } from './editor/draft-recovery-banner';
import { UnsavedChangesDialog } from './editor/unsaved-changes-dialog';
import { KeyboardShortcutsDialog } from './editor/keyboard-shortcuts-dialog';
import { ToastContainer } from './editor/toast-container';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface EmailEditorProps {
  onBack?: () => void;
  initialTemplate?: Template;
}

export default function EmailEditor({ onBack, initialTemplate }: EmailEditorProps) {
  const {
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
    lastSaved,
    handleTemplateChange,
    handleCreateTemplate,
    confirmCreateTemplate,
    handleReset,
    handleSaveVersion,
    handleRevertVersion,
    handleCopyHTML,
    handleDownload,
    newTemplateFolder,
    setNewTemplateFolder,
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
    hideToast
  } = useEmailEditor(initialTemplate);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [showSendTest, setShowSendTest] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleResize = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    
    const isSplit = view === 'split';
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

      if (direction.includes('e')) newWidth = startWidth + deltaX * 2;
      else if (direction.includes('w')) newWidth = startWidth - deltaX * 2;

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

  const handleForceRender = useCallback(() => performRender(code), [performRender, code]);
  const handleToggleHistory = useCallback(() => setIsHistoryCollapsed(prev => !prev), []);
  const handleToggleSidebar = useCallback(() => setIsSidebarCollapsed(prev => !prev), []);

  const handleOpenQuality = useCallback(() => {
    if (view === 'editor') {
      setView('split');
    }
    setPreviewTab('quality');
  }, [view, setView, setPreviewTab]);

  // Global Keyboard Shortcuts (Phase 15I)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S -> Save version & update draft
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveVersion();
        return;
      }

      // Ctrl/Cmd + Enter -> Force authoritative re-render
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleForceRender();
        return;
      }

      // Ctrl/Cmd + P -> Cycle view (split -> editor -> preview -> split)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p' && !e.shiftKey) {
        e.preventDefault();
        setView(prev => {
          if (prev === 'split') return 'editor';
          if (prev === 'editor') return 'preview';
          return 'split';
        });
        return;
      }

      // Ctrl/Cmd + Shift + Q -> Open Quality tab
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        handleOpenQuality();
        return;
      }

      // ? -> Open keyboard shortcuts dialog when not focused in input/textarea
      const target = e.target as HTMLElement;
      const isInputFocused = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === '?' && !isInputFocused) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
        return;
      }

      // Escape -> close dialogs
      if (e.key === 'Escape') {
        setShowShortcuts(false);
        setShowSendTest(false);
        setShowAIAssistant(false);
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveVersion, handleForceRender, setView, handleOpenQuality]);

  const handleSafeBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes in this email template. Are you sure you want to return to the home screen?'
      );
      if (!confirmLeave) return;
    }
    if (onBack) onBack();
  };

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen bg-bg-app items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-accent border-border-base animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg-app text-fg overflow-hidden font-sans select-none transition-colors">
      <header className="h-14 bg-surface/95 backdrop-blur-md border-b border-border-base flex items-center justify-between px-3 sm:px-5 shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onBack && (
            <button 
              onClick={handleSafeBack}
              className="p-1.5 text-fg-muted hover:text-fg rounded-lg hover:bg-surface-hover transition-colors shrink-0"
              title="Back to Landing Page"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={handleToggleSidebar}
            className="p-1.5 text-fg-muted hover:text-fg rounded-lg hover:bg-surface-hover transition-colors shrink-0"
            title={isSidebarCollapsed ? "Show Template Library" : "Hide Template Library"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
          
          <div className="h-4 w-[1px] bg-border-base mx-0.5 shrink-0" />
          
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold text-fg-secondary tracking-tight hidden md:inline">
              Email.Pro
            </span>
            <span className="text-border-strong hidden md:inline font-light">/</span>
            <span className="text-xs sm:text-sm font-medium text-fg truncate max-w-[140px] sm:max-w-[260px]">
              {activeTemplate.name || 'Untitled'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />
          <EditorToolbar 
            templateName={activeTemplate.name || 'Untitled'}
            onSave={handleSaveVersion}
            onDownload={handleDownload}
            onDownloadWorkspace={handleDownloadWorkspace}
            onCopy={handleCopyHTML}
            onSendTest={() => setShowSendTest(true)}
            onOpenSettings={() => setShowSettings(true)}
            onOpenShortcuts={() => setShowShortcuts(true)}
            onOpenAIAssistant={() => setShowAIAssistant(true)}
            qualityReport={qualityReport}
            onOpenQuality={handleOpenQuality}
            copied={copied}
            isExporting={isExporting}
            isRendering={isRendering}
            activeView={view}
            onViewChange={setView}
            onForceRender={handleForceRender}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        </div>
      </header>

      {/* Local Draft Recovery Notification Banner */}
      <DraftRecoveryBanner 
        draft={pendingDraftRecovery} 
        onRestore={handleRestoreDraft} 
        onDiscard={handleDiscardDraft} 
      />

      <main className="flex-1 flex min-h-0 relative">
        <TemplateSidebar 
          templates={templates}
          activeTemplate={activeTemplate}
          onTemplateChange={handleTemplateChange}
          onCreateTemplate={handleCreateTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onDownloadWorkspace={handleDownloadWorkspace}
          onMoveTemplate={handleMoveTemplate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <ErrorBoundary>
            {view === 'analytics' ? (
              <AnalyticsView 
                metrics={metrics} 
                qualityReport={qualityReport} 
                isAnalyzing={isAnalyzing} 
                onBackToEditor={() => setView('split')}
              />
            ) : view === 'editor' ? (
              <div className="flex-1 min-h-0 flex overflow-hidden">
                <div className="flex-1 flex flex-col">
                  <EditorContent 
                    code={code}
                    onChange={(v) => setCode(v || '')}
                    language={language}
                    onLanguageChange={setLanguage}
                    isHistoryCollapsed={isHistoryCollapsed}
                    onToggleHistory={handleToggleHistory}
                  />
                </div>
                {!isHistoryCollapsed && (
                  <HistorySidebar 
                    history={history[activeTemplate.id] || []}
                    onRevert={handleRevertVersion}
                    isCollapsed={isHistoryCollapsed}
                    onToggleCollapse={handleToggleHistory}
                  />
                )}
              </div>
            ) : view === 'preview' ? (
              <PreviewContent 
                previewHtml={previewHtml}
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                previewTab={previewTab}
                setPreviewTab={setPreviewTab}
                customDimensions={customDimensions}
                setCustomDimensions={setCustomDimensions}
                isRendering={isRendering}
                isDirty={isDirty}
                error={error}
                isSplit={false}
                onResize={handleResize}
                activeTemplate={activeTemplate}
                currentCode={code}
                qualityReport={qualityReport}
              />
            ) : (
              <Group orientation="horizontal">
                <Panel defaultSize={50} minSize={20}>
                  <EditorContent 
                    code={code}
                    onChange={(v) => setCode(v || '')}
                    language={language}
                    onLanguageChange={setLanguage}
                    isHistoryCollapsed={isHistoryCollapsed}
                    onToggleHistory={handleToggleHistory}
                  />
                </Panel>
                <Separator className="w-1 bg-border-base hover:bg-accent/50 transition-colors cursor-col-resize active:bg-accent" />
                <Panel defaultSize={50} minSize={20}>
                  <div className="h-full flex overflow-hidden">
                    <div className="flex-1">
                      <PreviewContent 
                        previewHtml={previewHtml}
                        previewMode={previewMode}
                        setPreviewMode={setPreviewMode}
                        previewTab={previewTab}
                        setPreviewTab={setPreviewTab}
                        customDimensions={customDimensions}
                        setCustomDimensions={setCustomDimensions}
                        isRendering={isRendering}
                        isDirty={isDirty}
                        error={error}
                        isSplit={true}
                        onResize={handleResize}
                        activeTemplate={activeTemplate}
                        currentCode={code}
                        qualityReport={qualityReport}
                      />
                    </div>
                    {!isHistoryCollapsed && (
                      <HistorySidebar 
                        history={history[activeTemplate.id] || []}
                        onRevert={handleRevertVersion}
                        isCollapsed={isHistoryCollapsed}
                        onToggleCollapse={handleToggleHistory}
                      />
                    )}
                  </div>
                </Panel>
              </Group>
            )}
          </ErrorBoundary>
        </div>
      </main>

      {/* Dialogs & Overlays */}
      <CreateTemplateDialog 
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onConfirm={confirmCreateTemplate}
        name={newTemplateName}
        setName={setNewTemplateName}
        folder={newTemplateFolder}
        setFolder={setNewTemplateFolder}
      />

      <UnsavedChangesDialog
        isOpen={!!pendingSwitchTemplate}
        currentTemplate={activeTemplate}
        targetTemplate={pendingSwitchTemplate}
        onSaveAndSwitch={confirmSwitchSaveRevision}
        onDiscardAndSwitch={confirmSwitchDiscard}
        onCancel={cancelSwitch}
      />

      <KeyboardShortcutsDialog
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      <ToastContainer
        toast={toast}
        onDismiss={hideToast}
      />

      <AnimatePresence>
        {showSendTest && (
          <SendTestDialog 
            isOpen={showSendTest}
            onClose={() => setShowSendTest(false)}
            code={code}
            templateName={activeTemplate.name || 'Untitled'}
          />
        )}
        {showAIAssistant && (
          <AIAssistantDialog
            isOpen={showAIAssistant}
            onClose={() => setShowAIAssistant(false)}
            currentCode={code}
            onApplyCode={(newCode) => {
              setCode(newCode);
              performRender(newCode);
            }}
          />
        )}
        {showSettings && (
          <EditorSettingsDialog
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            currentCode={code}
            onCodeChange={(newCode) => {
              setCode(newCode);
              performRender(newCode);
            }}
          />
        )}
      </AnimatePresence>

      {isResizing && (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
          <div className="absolute inset-0 bg-powder-blue-500/5 pointer-events-none" />
        </div>
      )}
    </div>
  );
}
