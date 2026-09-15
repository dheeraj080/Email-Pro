'use client';

import React from 'react';
import { 
  History, 
  RotateCcw,
  Clock,
  Archive,
  Save
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
}: HistorySidebarProps) {
  if (isCollapsed) return null;

  return (
    <div className="w-64 border-l border-[#1f222e] bg-[#0c0d12] flex flex-col h-full select-none text-neutral-300">
      <div className="p-5 border-b border-[#1f222e] bg-[#07080b]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Version History</h3>
          </div>
          <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[#12141c] border border-[#1f222e] text-indigo-400 font-mono">
            {history.length}
          </span>
        </div>
        <p className="text-[9px] text-neutral-400 leading-normal font-medium">Auto-saved versions from this editing session.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar bg-[#0c0d12]">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-3 opacity-50">
            <div className="w-10 h-10 rounded-2xl bg-[#07080b] border border-[#1f222e] flex items-center justify-center text-neutral-400 shadow-xs">
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400">No revisions yet</p>
              <span className="text-[8px] text-neutral-500 font-medium leading-normal block mt-1">Updates will save automatically.</span>
            </div>
          </div>
        ) : (
          history.map((version) => (
            <button
              key={version.id}
              onClick={() => onRevert(version.code)}
              className="w-full text-left p-3.5 bg-[#07080b] rounded-xl border border-[#1f222e] hover:border-indigo-500/50 shadow-xs transition-all group relative flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold text-white font-mono">
                    {new Date(version.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[8px] text-neutral-400 font-medium font-mono">
                    ({Math.round(version.code.length / 102.4) / 10} KB)
                  </span>
                </div>
                <div className="text-[8px] text-neutral-400 font-black uppercase tracking-wider">
                  {new Date(version.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="p-1.5 rounded-lg bg-[#12141c] border border-[#1f222e] text-indigo-400 opacity-0 group-hover:opacity-100 transition-all shadow-xs scale-90 group-hover:scale-100 shrink-0">
                <RotateCcw className="w-3.5 h-3.5" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
});
