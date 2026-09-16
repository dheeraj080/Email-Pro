'use client';

import React from 'react';

export function CodeHighlighter({ code }: { code: string }) {
  const lines = code.split('\n');

  const highlightLine = (line: string) => {
    if (!line.trim()) return <span className="inline-block h-4" />;
    if (line.trim().startsWith('//')) {
      return <span className="text-[#6A9955]">{line}</span>;
    }
    if (line.trim().startsWith('import ')) {
      const fromIdx = line.indexOf(' from ');
      if (fromIdx !== -1) {
        return (
          <span>
            <span className="text-[#C586C0] font-semibold">import</span>
            <span className="text-[#9CDCFE]">{line.substring(line.indexOf('import') + 6, fromIdx)}</span>
            <span className="text-[#C586C0] font-semibold">from</span>{' '}
            <span className="text-[#CE9178]">{line.substring(fromIdx + 6)}</span>
          </span>
        );
      }
    }
    if (line.includes('<') || line.includes('>')) {
      return <span className="text-[#569CD6]">{line}</span>;
    }
    return <span className="text-[#D4D4D4]">{line}</span>;
  };

  return (
    <pre className="text-[10px] leading-[16px] font-mono text-neutral-300 p-4 bg-neutral-900 overflow-auto h-full max-h-[350px] rounded-xl border border-neutral-800">
      {lines.map((line, idx) => (
        <div key={idx} className="flex">
          <span className="w-6 text-neutral-600 text-right pr-2 select-none border-r border-neutral-800 mr-2 text-[9px]">
            {idx + 1}
          </span>
          <span className="whitespace-pre">{highlightLine(line)}</span>
        </div>
      ))}
    </pre>
  );
}