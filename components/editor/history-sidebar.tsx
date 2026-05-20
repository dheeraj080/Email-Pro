'use client';

import React from 'react';
import { 
  History, 
  RotateCcw,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
}: HistorySidebarProps) {
  if (isCollapsed) return null;

  return (
    <div className="w-64 border-l border-ink-black-100 bg-white flex flex-col hide-scrollbar">
      <div className="p-5 border-b border-ink-black-100 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <History className="w-3.5 h-3.5 text-ink-black-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-black-400">Archived Version</h3>
          </div>
          <Badge variant="neutral">{history.length}</Badge>
        </div>
        <p className="text-[9px] text-ink-black-400 leading-relaxed font-black uppercase tracking-widest opacity-60">Auto-saves from this session.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 opacity-20">
            <Clock className="w-10 h-10 text-ink-black-200" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed">System standby</p>
          </div>
        ) : (
          history.map((version) => (
            <button
              key={version.id}
              onClick={() => onRevert(version.code)}
              className="w-full text-left p-4 rounded-2xl hover:bg-alabaster-grey-50 border border-transparent hover:border-ink-black-100 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black font-mono text-ink-black-900">
                  {new Date(version.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="p-1.5 rounded-lg bg-white border border-ink-black-50 text-powder-blue-600 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                  <RotateCcw className="w-3 h-3" />
                </div>
              </div>
              <div className="text-[10px] text-ink-black-400 font-bold uppercase tracking-widest">
                {new Date(version.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
});
