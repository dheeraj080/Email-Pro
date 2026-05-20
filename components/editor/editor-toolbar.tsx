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
  SendHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EditorToolbarProps {
  templateName: string;
  onSave: () => void;
  onDownload: () => void;
  onCopy: () => void;
  onSendTest: () => void;
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
  copied,
  isExporting,
  isRendering,
  activeView,
  onViewChange,
  onForceRender,
  lastSaved
}: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-5">
      {/* Dynamic View Capsule Switcher */}
      <div className="flex items-center bg-neutral-100 p-0.5 rounded-xl border border-neutral-200/60 shadow-inner">
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
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
              activeView === v.id
                ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/60"
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            <v.icon className={cn("w-3.5 h-3.5", activeView === v.id ? "text-indigo-600" : "")} />
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
          className="h-8.5 w-8.5 rounded-xl bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs"
          title="Force Re-render"
        >
          <RefreshCw className={cn("w-3.5 h-3.5 text-neutral-500", isRendering ? "animate-spin text-indigo-600" : "")} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onSave}
          className="h-8.5 w-8.5 rounded-xl bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs"
          title="Save Version"
        >
          <Save className="w-3.5 h-3.5 text-neutral-500" />
        </Button>

        <div className="h-4 w-[1px] bg-neutral-200/80 mx-0.5" />

        <Button
          variant="outline"
          size="icon"
          onClick={onCopy}
          className="h-8.5 w-8.5 rounded-xl bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs"
          title={copied ? "Copied!" : "Copy HTML"}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onSendTest}
          className="h-8.5 w-8.5 rounded-xl bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs"
          title="Send Test Email"
        >
          <SendHorizontal className="w-3.5 h-3.5 text-neutral-500" />
        </Button>

        <Button
          variant="outline"
          onClick={onDownload}
          isLoading={isExporting}
          className="h-8.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm shrink-0"
          title="Export Template File"
        >
          {!isExporting && <Download className="w-3.5 h-3.5 text-white/90" />}
          <span>Export</span>
        </Button>
      </div>

      {/* Pulsating Autosaved Status */}
      {lastSaved && (
        <div className="hidden lg:flex items-center gap-2 bg-neutral-50 px-3 py-1.5 border border-neutral-200/50 rounded-xl text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span>
            {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      )}
    </div>
  );
});
