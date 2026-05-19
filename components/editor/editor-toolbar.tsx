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
    <div className="flex items-center gap-6">
      <div className="flex items-center bg-alabaster-grey-100 p-1 rounded-xl border border-ink-black-100 shadow-inner">
        {[
          { id: 'split', icon: Columns2, label: 'Split' },
          { id: 'editor', icon: Code2, label: 'Code' },
          { id: 'preview', icon: Eye, label: 'View' },
          { id: 'analytics', icon: TrendingUp, label: 'Stats' },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
              activeView === v.id
                ? "bg-white text-ink-black-900 shadow-sm border border-ink-black-100"
                : "text-ink-black-400 hover:text-ink-black-600"
            )}
          >
            <v.icon className={cn("w-3.5 h-3.5", activeView === v.id ? "text-powder-blue-500" : "")} />
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onForceRender}
          disabled={isRendering}
          title="Force Re-render"
        >
          <RefreshCw className={cn("w-4 h-4", isRendering ? "animate-spin text-powder-blue-500" : "")} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onSave}
          className="h-10 w-10"
          title="Save Version"
        >
          <Save className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onCopy}
          className="h-10 w-10"
          title={copied ? "Copied!" : "Copy HTML"}
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onSendTest}
          className="h-10 w-10"
          title="Send Test Email"
        >
          <SendHorizontal className="w-4 h-4" />
        </Button>

        <Button
          variant="primary"
          size="icon"
          onClick={onDownload}
          isLoading={isExporting}
          className="h-10 w-10"
          title="Export Template File"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {lastSaved && (
        <div className="hidden lg:flex flex-col items-end opacity-50">
          <span className="text-[9px] font-black uppercase tracking-widest text-ink-black-400">Autosaved</span>
          <span className="text-[10px] font-mono tabular-nums text-ink-black-300">
            {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      )}
    </div>
  );
});
