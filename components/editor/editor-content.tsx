'use client';

import React, { useRef, useCallback, memo } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { 
  Code2, 
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Pre-warm Monaco
if (typeof window !== 'undefined') {
  loader.init().then(monaco => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ["node_modules/@types"]
    });
  });
}

interface EditorContentProps {
  code: string;
  onChange: (value: string | undefined) => void;
  language: 'typescript' | 'javascript' | 'html';
  onLanguageChange: (lang: 'typescript' | 'javascript' | 'html') => void;
  isHistoryCollapsed: boolean;
  onToggleHistory: () => void;
}

export const EditorContent = memo(function EditorContent({
  code,
  onChange,
  language,
  onLanguageChange,
  isHistoryCollapsed,
  onToggleHistory
}: EditorContentProps) {
  const editorRef = useRef<any>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Set up a custom resize observer for better performance than automaticLayout: true
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      const container = editor.getDomNode()?.parentElement;
      if (container) {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        
        resizeObserverRef.current = new ResizeObserver(() => {
          window.requestAnimationFrame(() => {
            if (editorRef.current) {
              editor.layout();
            }
          });
        });
        resizeObserverRef.current.observe(container);
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // 50ms debounce for the main state update - fast enough for responsiveness, 
    // but slow enough to batch rapid keystrokes and prevent React render noise
    debounceTimer.current = setTimeout(() => {
      onChange(value);
    }, 50);
  }, [onChange]);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-10 border-b border-ink-black-100 bg-alabaster-grey-50 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-ink-black-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-black-400">Editor</span>
          </div>
          <div className="flex bg-white border border-ink-black-100 rounded-lg p-0.5 shadow-sm">
            {[
              { id: 'typescript', label: 'TS' },
              { id: 'javascript', label: 'JS' },
              { id: 'html', label: 'HTML' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => onLanguageChange(lang.id as any)}
                className={cn(
                  "px-2.5 py-0.5 rounded text-[9px] font-bold transition-all",
                  language === lang.id 
                    ? "bg-ink-black-900 text-white shadow-sm" 
                    : "text-ink-black-400 hover:text-ink-black-600"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={onToggleHistory}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-md transition-all text-[10px] font-bold uppercase tracking-widest",
            !isHistoryCollapsed ? "bg-powder-blue-500 text-white" : "text-ink-black-400 hover:text-ink-black-900"
          )}
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>
      <div className="flex-1 min-h-0 relative overflow-hidden group/editor">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          theme="light"
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: false, // Turned off in favor of ResizeObserver
            padding: { top: 20, bottom: 20 },
            fontFamily: 'var(--font-mono)',
            fontWeight: '500',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            wordWrap: 'off', // Performance optimization for large content
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              alwaysConsumeMouseWheel: true
            },
            experimental: {
              showCompleteInList: true
            }
          } as any}
        />
        <div className="absolute top-0 right-0 w-32 h-32 bg-powder-blue-500/5 blur-3xl rounded-full pointer-events-none opacity-0 group-hover/editor:opacity-100 transition-opacity" />
      </div>
    </div>
  );
});
