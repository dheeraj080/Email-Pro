'use client';

import React, { useState, useCallback } from 'react';
import { 
  Home,
  PanelLeftClose,
  PanelLeftOpen
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
import { SendTestDialog } from './editor/send-test-dialog';

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
    handleDeleteTemplate,
    isDirty,
    performRender
  } = useEmailEditor(initialTemplate);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);
  const [showSendTest, setShowSendTest] = useState(false);

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
    <div className="flex flex-col h-screen bg-[#F8FAF9] text-neutral-900 overflow-hidden font-sans select-none">
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-neutral-200/50 flex items-center justify-between px-6 shrink-0 z-20 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-neutral-50 rounded-xl transition-all text-neutral-400 hover:text-neutral-800 border border-neutral-200/60 shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              title="Back to Landing Page"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
          )}
          <button 
            onClick={handleToggleSidebar}
            className="p-2 hover:bg-neutral-50 rounded-xl transition-colors text-neutral-400 hover:text-neutral-800"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4.5 h-4.5" /> : <PanelLeftClose className="w-4.5 h-4.5" />}
          </button>
          
          <div className="h-5 w-[1px] bg-neutral-200/80 mx-1" />
          
          <div className="flex items-center gap-2">
            <div className="w-7.5 h-7.5 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold text-[10px] tracking-tight shadow-sm">
              EP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-900 tracking-tight">Email.Pro</span>
                <span className="text-neutral-300">/</span>
                <span className="text-powder-blue-600 bg-powder-blue-50 border border-powder-blue-100/50 px-2 py-0.5 rounded-md font-extrabold text-[9px] uppercase tracking-wider truncate max-w-[150px]">
                  {activeTemplate.name || 'Untitled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <EditorToolbar 
            templateName={activeTemplate.name || 'Untitled'}
            onSave={handleSaveVersion}
            onDownload={handleDownload}
            onCopy={handleCopyHTML}
            onSendTest={() => setShowSendTest(true)}
            copied={copied}
            isExporting={isExporting}
            isRendering={isRendering}
            activeView={view}
            onViewChange={setView}
            onForceRender={handleForceRender}
            lastSaved={lastSaved}
          />
        </div>
      </header>

      <main className="flex-1 flex min-h-0 relative">
        <TemplateSidebar 
          templates={templates}
          activeTemplate={activeTemplate}
          onTemplateChange={handleTemplateChange}
          onCreateTemplate={handleCreateTemplate}
          onDeleteTemplate={handleDeleteTemplate}
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
                previewComponent={previewComponent}
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
                        previewComponent={previewComponent}
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
        {showSendTest && (
          <SendTestDialog 
            isOpen={showSendTest}
            onClose={() => setShowSendTest(false)}
            code={code}
            templateName={activeTemplate.name || 'Untitled'}
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
