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
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 min-h-0 relative overflow-hidden group/editor border-b border-neutral-200/50">
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
        <div className="absolute top-0 right-0 w-32 h-32 bg-powder-blue-500/5 blur-3xl rounded-full pointer-events-none opacity-0 group-hover/editor:opacity-100 transition-opacity" />
      </div>

      {/* Bottom Status Bar */}
      <div className="h-9.5 border-t border-neutral-200/80 bg-white px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-100 border border-neutral-200/60 rounded-lg p-0.5 shadow-2xs">
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
                    ? "bg-white text-neutral-900 shadow-2xs border border-neutral-200/50" 
                    : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-neutral-200" />

          <button 
            onClick={handleFormatCode}
            className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-neutral-500 hover:text-neutral-800 transition-colors"
            title="Format Code (Alt+Shift+F)"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            <span>Format</span>
          </button>

          <button 
            onClick={onToggleHistory}
            className={cn(
              "flex items-center gap-1 text-[9px] font-black uppercase tracking-wider transition-colors",
              !isHistoryCollapsed 
                ? "text-indigo-600 font-extrabold" 
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            <History className={cn("w-3.5 h-3.5", !isHistoryCollapsed ? "text-indigo-600" : "text-neutral-400")} />
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
