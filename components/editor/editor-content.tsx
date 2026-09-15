'use client';

import React, { useRef, useCallback, memo } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { 
  Code2, 
  History,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemePicker } from './theme-picker';
import { SnippetsPicker } from './snippets-picker';

// Pre-warm Monaco
if (typeof window !== 'undefined') {
  loader.init().then(monaco => {
    (monaco.languages as any).typescript.typescriptDefaults.setCompilerOptions({
      target: (monaco.languages as any).typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: (monaco.languages as any).typescript.ModuleResolutionKind.NodeJs,
      module: (monaco.languages as any).typescript.ModuleKind.CommonJS,
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

  const handleFormatCode = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  }, []);

  const handleInsertSnippet = useCallback((snippetCode: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      
      const range = {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn
      };
      
      editor.executeEdits('snippets-inserter', [
        {
          range: range,
          text: snippetCode,
          forceMoveMarkers: true
        }
      ]);
      
      // Keep editor in focus
      editor.focus();
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#07080b]">
      <div className="flex-1 min-h-0 relative overflow-hidden group/editor border-b border-[#1f222e]">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: false,
            padding: { top: 16, bottom: 16 },
            fontFamily: 'var(--font-mono)',
            fontWeight: '500',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            wordWrap: 'off',
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalScrollbarSize: 7,
              horizontalScrollbarSize: 7,
              alwaysConsumeMouseWheel: true
            },
            experimental: {
              showCompleteInList: true
            }
          } as any}
        />
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none opacity-0 group-hover/editor:opacity-100 transition-opacity" />
      </div>

      {/* Bottom Status Bar */}
      <div className="h-9.5 border-t border-[#1f222e] bg-[#0c0d12] px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex bg-[#07080b] border border-[#1f222e] rounded-lg p-0.5 shadow-xs">
            {[
              { id: 'typescript', label: 'TSX' },
              { id: 'javascript', label: 'JSX' },
              { id: 'html', label: 'HTML' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => onLanguageChange(lang.id as any)}
                className={cn(
                  "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-all",
                  language === lang.id 
                    ? "bg-[#12141c] text-white shadow-xs border border-[#1f222e]" 
                    : "text-neutral-400 hover:text-white"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-[#1f222e]" />

          <button 
            onClick={handleFormatCode}
            className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            title="Format Code (Alt+Shift+F)"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Format</span>
          </button>

          <button 
            onClick={onToggleHistory}
            className={cn(
              "flex items-center gap-1 text-[9px] font-black uppercase tracking-wider transition-colors",
              !isHistoryCollapsed 
                ? "text-indigo-400 font-extrabold" 
                : "text-neutral-400 hover:text-white"
            )}
          >
            <History className={cn("w-3.5 h-3.5", !isHistoryCollapsed ? "text-indigo-400" : "text-neutral-400")} />
            <span>History</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {language !== 'html' && (
            <>
              <ThemePicker currentCode={code} onCodeChange={onChange} />
              <SnippetsPicker onInsert={handleInsertSnippet} />
            </>
          )}
        </div>
      </div>
    </div>
  );
});
