'use client';

import React from 'react';
import { 
  History, 
  RotateCcw,
  Clock,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistorySidebarProps {
  history: { id: string; timestamp: number; code: string }[];
  onRevert: (code: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const HistorySidebar = React.memo(function HistorySidebar({
  history,
  onRevert,
  isCollapsed,
  onToggleCollapse
}: HistorySidebarProps) {
  if (isCollapsed) return null;

  return (
    <div className="w-56 border-l border-border-base bg-surface flex flex-col h-full select-none text-fg shrink-0">
      <div className="h-9 px-3 border-b border-border-base bg-surface flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-medium text-fg">History</span>
          <span className="text-[10px] text-fg-muted font-mono ml-1">
            {history.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1 rounded text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors"
          title="Close history"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-3 text-center space-y-2 opacity-50">
            <Clock className="w-5 h-5 text-fg-muted" />
            <p className="text-xs text-fg font-medium">No revisions yet</p>
            <span className="text-[10px] text-fg-muted leading-normal">
              Edits save automatically as you type.
            </span>
          </div>
        ) : (
          history.map((version) => (
            <button
              key={version.id}
              type="button"
              onClick={() => onRevert(version.code)}
              className="w-full text-left px-2.5 py-2 rounded-lg bg-surface-raised hover:bg-surface-hover border border-border-base transition-colors group flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-xs font-medium text-fg font-mono">
                  {new Date(version.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-[10px] text-fg-muted">
                  {new Date(version.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} · {Math.round(version.code.length / 102.4) / 10} KB
                </div>
              </div>
              <div className="p-1 rounded text-fg-muted group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100 shrink-0" title="Revert to this revision">
                <RotateCcw className="w-3 h-3" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
});
