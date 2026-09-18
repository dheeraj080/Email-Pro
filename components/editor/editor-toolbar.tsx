'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Save,
  Download,
  Copy,
  Check,
  Eye,
  Code2,
  TrendingUp,
  Columns2,
  RefreshCw,
  SendHorizontal,
  Sparkles,
  Settings2,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  Archive,
  FileCode,
  MoreHorizontal,
  Keyboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmailQualityReport } from '@/lib/email-quality';
import { motion, AnimatePresence } from 'motion/react';

interface EditorToolbarProps {
  templateName: string;
  onSave: () => void;
  onDownload: () => void;
  onDownloadWorkspace?: () => void;
  onCopy: () => void;
  onSendTest: () => void;
  onOpenSettings?: () => void;
  onOpenShortcuts?: () => void;
  onOpenAIAssistant?: () => void;
  qualityReport?: EmailQualityReport | null;
  onOpenQuality?: () => void;
  copied: boolean;
  isExporting: boolean;
  isRendering: boolean;
  activeView: 'split' | 'editor' | 'preview' | 'analytics';
  onViewChange: (view: 'split' | 'editor' | 'preview' | 'analytics') => void;
  onForceRender: () => void;
  lastSaved: number | null;
  hasUnsavedChanges?: boolean;
}

export const EditorToolbar = React.memo(function EditorToolbar({
  onSave,
  onDownload,
  onDownloadWorkspace,
  onCopy,
  onSendTest,
  onOpenSettings,
  onOpenShortcuts,
  onOpenAIAssistant,
  qualityReport,
  onOpenQuality,
  copied,
  isExporting,
  isRendering,
  activeView,
  onViewChange,
  onForceRender,
  lastSaved,
  hasUnsavedChanges
}: EditorToolbarProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* 1. Primary View Switcher: Segmented control with restrained styling */}
      <div className="flex items-center bg-surface-raised p-0.5 rounded-lg border border-border-base">
        {[
          { id: 'split', icon: Columns2, label: 'Split', hideOnMobile: true },
          { id: 'editor', icon: Code2, label: 'Code' },
          { id: 'preview', icon: Eye, label: 'Preview' },
        ].map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onViewChange(v.id as any)}
            className={cn(
              "items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-xs font-medium transition-all",
              v.hideOnMobile ? "hidden sm:flex" : "flex",
              activeView === v.id
                ? "bg-surface-elevated text-fg shadow-xs border border-border-subtle"
                : "text-fg-muted hover:text-fg hover:bg-surface-hover"
            )}
          >
            <v.icon className={cn("w-3.5 h-3.5", activeView === v.id ? "text-accent" : "")} />
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        ))}
      </div>

      {/* 2. Quiet Inline Save Status & Revision Action */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onSave}
          className={cn(
            "h-8 px-2.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border",
            hasUnsavedChanges
              ? "bg-warning-bg text-warning border-warning-border hover:opacity-90"
              : "bg-transparent text-fg-secondary hover:text-fg border-transparent hover:bg-surface-hover"
          )}
          title={hasUnsavedChanges ? "Draft auto-saved • Click or ⌘S to save revision" : "Draft saved • Click or ⌘S to save revision"}
        >
          <Save className={cn("w-3.5 h-3.5", hasUnsavedChanges ? "text-warning" : "text-fg-muted")} />
          <span className="hidden sm:inline">{hasUnsavedChanges ? "Save" : "Saved"}</span>
          {hasUnsavedChanges && (
            <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
          )}
        </button>

        {/* 3. Secondary Action: Send Test Email */}
        <button
          type="button"
          onClick={onSendTest}
          className="h-8 px-2.5 rounded-lg text-xs font-medium text-fg-secondary hover:text-fg hover:bg-surface-hover transition-colors hidden md:flex items-center gap-1.5"
          title="Send Test Email via Resend"
        >
          <SendHorizontal className="w-3.5 h-3.5 text-fg-muted" />
          <span>Send Test</span>
        </button>

        {/* 4. Quick Action: Copy HTML */}
        <button
          type="button"
          onClick={onCopy}
          className="h-8 w-8 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors hidden sm:flex items-center justify-center"
          title={copied ? "Copied!" : "Copy compiled HTML"}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        {/* 5. Primary CTA: High-Confidence Export Dropdown */}
        <div className="relative" ref={exportMenuRef}>
          <button
            type="button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="h-8 px-3 rounded-lg bg-accent hover:bg-accent-hover text-accent-fg text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
            title="Export HTML or Workspace"
          >
            <Download className="w-3.5 h-3.5 text-white/90" />
            <span>Export</span>
            <ChevronDown className={cn("w-3 h-3 text-white/70 transition-transform", showExportMenu && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1.5 w-60 bg-surface-elevated border border-border-base rounded-xl shadow-2xl z-50 overflow-hidden text-fg p-1"
              >
                <div className="px-2.5 py-1.5 text-[11px] font-medium text-fg-muted border-b border-border-subtle mb-1">
                  Export Options
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onDownload();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-surface-hover rounded-lg transition-colors text-left group"
                >
                  <FileCode className="w-4 h-4 text-accent shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-fg group-hover:text-accent">
                      Download HTML (.html)
                    </div>
                    <div className="text-[11px] text-fg-muted truncate">
                      Production inlined email
                    </div>
                  </div>
                </button>

                {onDownloadWorkspace && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      onDownloadWorkspace();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-surface-hover rounded-lg transition-colors text-left group"
                  >
                    <Archive className="w-4 h-4 text-success shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-fg group-hover:text-success">
                        Download Workspace (.zip)
                      </div>
                      <div className="text-[11px] text-fg-muted truncate">
                        All templates & folders
                      </div>
                    </div>
                  </button>
                )}

                <div className="border-t border-border-subtle my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onCopy();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-surface-hover rounded-lg transition-colors text-left group"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 text-fg-muted group-hover:text-accent shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-fg group-hover:text-accent">
                      {copied ? 'Copied to Clipboard' : 'Copy HTML to Clipboard'}
                    </div>
                    <div className="text-[11px] text-fg-muted truncate">
                      Direct paste into sender
                    </div>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. Compact Overflow Menu (Tertiary Actions) */}
        <div className="relative" ref={moreMenuRef}>
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="h-8 w-8 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors flex items-center justify-center"
            title="More actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showMoreMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1.5 w-56 bg-surface-elevated border border-border-base rounded-xl shadow-2xl z-50 overflow-hidden text-fg p-1"
              >
                {onOpenAIAssistant && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenAIAssistant();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-surface-hover rounded-lg transition-colors text-left text-xs text-fg-secondary hover:text-fg"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>AI Assistant</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onViewChange(activeView === 'analytics' ? 'split' : 'analytics');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-surface-hover rounded-lg transition-colors text-left text-xs text-fg-secondary hover:text-fg"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-accent" />
                  <span>{activeView === 'analytics' ? 'Exit Analytics' : 'Campaign Analytics'}</span>
                </button>

                {qualityReport && onOpenQuality && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenQuality();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-surface-hover rounded-lg transition-colors text-left text-xs text-fg-secondary hover:text-fg"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-success" />
                      <span>Quality Inspector</span>
                    </div>
                    <span className="text-[10px] font-mono text-fg-muted">{qualityReport.size.kb} KB</span>
                  </button>
                )}

                <div className="border-t border-border-subtle my-1" />

                {/* Mobile-friendly fallback items */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onSendTest();
                  }}
                  className="md:hidden w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-surface-hover rounded-lg transition-colors text-left text-xs text-fg-secondary hover:text-fg"
                >
                  <SendHorizontal className="w-3.5 h-3.5 text-fg-muted" />
                  <span>Send Test Email</span>
                </button>

                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-surface-hover rounded-lg transition-colors text-left text-xs text-fg-secondary hover:text-fg"
                  >
                    <Settings2 className="w-3.5 h-3.5 text-fg-muted" />
                    <span>Branding & Tokens</span>
                  </button>
                )}

                {onOpenShortcuts && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenShortcuts();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-surface-hover rounded-lg transition-colors text-left text-xs text-fg-secondary hover:text-fg"
                  >
                    <div className="flex items-center gap-2.5">
                      <Keyboard className="w-3.5 h-3.5 text-fg-muted" />
                      <span>Shortcuts</span>
                    </div>
                    <kbd className="text-[10px] font-mono text-fg-muted">?</kbd>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onForceRender();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-surface-hover rounded-lg transition-colors text-left text-xs text-fg-secondary hover:text-fg"
                >
                  <div className="flex items-center gap-2.5">
                    <RefreshCw className={cn("w-3.5 h-3.5 text-fg-muted", isRendering && "animate-spin text-accent")} />
                    <span>Force Re-render</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-fg-muted">⌘↵</kbd>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

