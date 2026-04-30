'use client';

import React, { useState, useCallback } from 'react';
import { 
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Panel, Group, Separator } from 'react-resizable-panels';

import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/error-boundary';
import TemplateShowcase from '@/components/template-showcase';
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
    performRender
  } = useEmailEditor(initialTemplate);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);

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

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen bg-alabaster-grey-50 items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-ink-black-900 border-ink-black-100 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-alabaster-grey-50 text-ink-black-900 overflow-hidden font-sans">
      <header className="h-14 bg-white border-b border-ink-black-100 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-alabaster-grey-100 rounded-lg transition-colors text-ink-black-400 hover:text-ink-black-900 border border-ink-black-100"
              title="Back to Landing Page"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={handleToggleSidebar}
            className="p-2 hover:bg-alabaster-grey-100 rounded-lg transition-colors text-ink-black-400 hover:text-ink-black-900"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
          <div className="h-6 w-[1px] bg-ink-black-100 mx-1" />
          <div className="w-8 h-8 bg-ink-black-900 rounded-lg flex items-center justify-center text-white font-bold text-xs italic shadow-sm">EP</div>
          <h1 className="text-sm font-semibold tracking-tight flex items-center">
            Email Pro <span className="text-ink-black-300 font-normal mx-2">/</span> 
            <span className="text-powder-blue-600 truncate max-w-[150px]">{activeTemplate.name || 'Untitled'}</span>
          </h1>
        </div>

        <EditorToolbar 
          templateName={activeTemplate.name || 'Untitled'}
          onSave={handleSaveVersion}
          onDownload={handleDownload}
          onCopy={handleCopyHTML}
          copied={copied}
          isExporting={isExporting}
          isRendering={isRendering}
          activeView={view}
          onViewChange={setView}
          onForceRender={handleForceRender}
          lastSaved={lastSaved}
        />
      </header>

      <main className="flex-1 flex min-h-0 relative">
        <TemplateSidebar 
          templates={templates}
          activeTemplate={activeTemplate}
          onTemplateChange={handleTemplateChange}
          onCreateTemplate={handleCreateTemplate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <ErrorBoundary>
            {view === 'analytics' ? (
              <AnalyticsView metrics={metrics} isAnalyzing={isAnalyzing} />
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
                error={error}
                isSplit={false}
                onResize={handleResize}
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
                <Separator className="w-1.5 bg-alabaster-grey-200 hover:bg-powder-blue-500 transition-colors cursor-col-resize active:bg-powder-blue-600" />
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
                        error={error}
                        isSplit={true}
                        onResize={handleResize}
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

        <button 
          onClick={() => setShowShowcase(true)}
          className="absolute bottom-6 right-6 w-12 h-12 bg-white border border-ink-black-100 rounded-2xl shadow-xl flex items-center justify-center text-ink-black-400 hover:text-powder-blue-600 transition-all hover:scale-110 active:scale-95 group z-50"
          title="Template Library"
        >
          <LayoutGrid className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-ink-black-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Template Library
          </span>
        </button>
      </main>

      <CreateTemplateDialog 
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onConfirm={confirmCreateTemplate}
        name={newTemplateName}
        setName={setNewTemplateName}
      />

      <AnimatePresence>
        {showShowcase && (
          <TemplateShowcase 
            onClose={() => setShowShowcase(false)}
            onSelect={(t) => {
              handleTemplateChange(t);
              setShowShowcase(false);
            }}
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed inset-0 z-[1000] pointer-events-none transition-opacity duration-300",
        isResizing ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-powder-blue-500/5 backdrop-blur-[1px]" />
      </div>
    </div>
  );
}
