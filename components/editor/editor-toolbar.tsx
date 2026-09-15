'use client';

import React from 'react';
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
  Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EditorToolbarProps {
  templateName: string;
  onSave: () => void;
  onDownload: () => void;
  onCopy: () => void;
  onSendTest: () => void;
  onOpenSettings?: () => void;
  onOpenAIAssistant?: () => void;
  copied: boolean;
  isExporting: boolean;
  isRendering: boolean;
  activeView: 'split' | 'editor' | 'preview' | 'analytics';
  onViewChange: (view: 'split' | 'editor' | 'preview' | 'analytics') => void;
  onForceRender: () => void;
  lastSaved: number | null;
}

export const EditorToolbar = React.memo(function EditorToolbar({
  onSave,
  onDownload,
  onCopy,
  onSendTest,
  onOpenSettings,
  onOpenAIAssistant,
  copied,
  isExporting,
  isRendering,
  activeView,
  onViewChange,
  onForceRender,
  lastSaved
}: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-4">
      {/* AI Assistant Copilot Trigger */}
      {onOpenAIAssistant && (
        <Button
          onClick={onOpenAIAssistant}
          className="h-8.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-indigo-500/20 shrink-0 border border-indigo-400/30"
          title="Open AI Template Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>AI Copilot</span>
        </Button>
      )}

      {/* Dynamic View Capsule Switcher */}
      <div className="flex items-center bg-[#07080b] p-0.5 rounded-xl border border-[#1f222e] border-t-white/10 shadow-inner">
        {[
          { id: 'split', icon: Columns2, label: 'Split' },
          { id: 'editor', icon: Code2, label: 'Code' },
          { id: 'preview', icon: Eye, label: 'Preview' },
          { id: 'analytics', icon: TrendingUp, label: 'Stats' },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id as any)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all active:scale-[0.96]",
              activeView === v.id
                ? "bg-[#12141c] text-white shadow-sm border border-[#1f222e] border-t-white/15"
                : "text-neutral-400 hover:text-white"
            )}
          >
            <v.icon className={cn("w-3.5 h-3.5", activeView === v.id ? "text-indigo-400" : "")} />
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        ))}
      </div>

      {/* Button Action Groups */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={onForceRender}
          disabled={isRendering}
          className="h-8.5 w-8.5 rounded-xl bg-[#0c0d12] border-[#1f222e] hover:bg-[#12141c] hover:border-neutral-700 transition-all shadow-xs"
          title="Force Re-render"
        >
          <RefreshCw className={cn("w-3.5 h-3.5 text-neutral-400", isRendering ? "animate-spin text-indigo-400" : "")} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onSave}
          className="h-8.5 w-8.5 rounded-xl bg-[#0c0d12] border-[#1f222e] hover:bg-[#12141c] hover:border-neutral-700 transition-all shadow-xs"
          title="Save Version"
        >
          <Save className="w-3.5 h-3.5 text-neutral-400" />
        </Button>

        {onOpenSettings && (
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenSettings}
            className="h-8.5 w-8.5 rounded-xl bg-[#0c0d12] border-[#1f222e] hover:bg-[#12141c] hover:border-neutral-700 transition-all shadow-xs"
            title="Branding & Color Settings"
          >
            <Settings2 className="w-3.5 h-3.5 text-neutral-400" />
          </Button>
        )}

        <div className="h-4 w-[1px] bg-[#1f222e] mx-0.5" />

        <Button
          variant="outline"
          size="icon"
          onClick={onCopy}
          className="h-8.5 w-8.5 rounded-xl bg-[#0c0d12] border-[#1f222e] hover:bg-[#12141c] hover:border-neutral-700 transition-all shadow-xs"
          title={copied ? "Copied!" : "Copy HTML"}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onSendTest}
          className="h-8.5 w-8.5 rounded-xl bg-[#0c0d12] border-[#1f222e] hover:bg-[#12141c] hover:border-neutral-700 transition-all shadow-xs"
          title="Send Test Email"
        >
          <SendHorizontal className="w-3.5 h-3.5 text-neutral-400" />
        </Button>

        <Button
          variant="outline"
          onClick={onDownload}
          isLoading={isExporting}
          className="h-8.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm shrink-0"
          title="Export Template File"
        >
          {!isExporting && <Download className="w-3.5 h-3.5 text-white/90" />}
          <span>Export</span>
        </Button>
      </div>

      {/* Pulsating Autosaved Status */}
      {lastSaved && (
        <div className="hidden lg:flex items-center gap-2 bg-[#0c0d12] px-3 py-1.5 border border-[#1f222e] rounded-xl text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
          </span>
          <span>
            {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      )}
    </div>
  );
});
