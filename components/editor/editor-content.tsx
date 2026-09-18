'use client';

import React, { useRef, useCallback, memo } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { 
  History, 
  Sparkles,
  FileCode2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemePicker } from './theme-picker';
import { SnippetsPicker } from './snippets-picker';
import { useTheme } from '@/lib/theme-context';

// Pre-warm Monaco with proper JSX, custom semantic themes, and clean diagnostics
if (typeof window !== 'undefined') {
  loader.init().then(monaco => {
    (monaco.languages as any).typescript.typescriptDefaults.setCompilerOptions({
      target: (monaco.languages as any).typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: (monaco.languages as any).typescript.ModuleResolutionKind.NodeJs,
      module: (monaco.languages as any).typescript.ModuleKind.CommonJS,
      noEmit: true,
      jsx: 2, // JsxEmit.React - enables JSX parsing
      typeRoots: ["node_modules/@types"]
    });
    // Suppress missing virtual module errors while preserving syntax errors
    (monaco.languages as any).typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
    (monaco.languages as any).typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });

    // Custom Email.Pro Dark theme: Layered charcoal canvas with restrained, calm syntax colors
    monaco.editor.defineTheme('emailpro-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'F2F4F7' },
        { token: 'comment', foreground: '858D99', fontStyle: 'italic' },
        { token: 'keyword', foreground: '818CF8' },
        { token: 'string', foreground: '34D399' },
        { token: 'number', foreground: 'FB923C' },
        { token: 'type', foreground: '38BDF8' },
        { token: 'tag', foreground: '60A5FA' },
        { token: 'attribute.name', foreground: 'A5B4FC' },
        { token: 'attribute.value', foreground: '34D399' },
        { token: 'delimiter', foreground: 'B8BEC8' },
      ],
      colors: {
        'editor.background': '#20242B',
        'editor.foreground': '#F2F4F7',
        'editorCursor.foreground': '#818CF8',
        'editor.lineHighlightBackground': '#262B34',
        'editorLineNumber.foreground': '#575E6A',
        'editorLineNumber.activeForeground': '#B8BEC8',
        'editor.selectionBackground': '#37415180',
        'editorIndentGuide.background1': '#2D333D',
        'editorIndentGuide.activeBackground1': '#4B5563',
      }
    });

    // Custom Email.Pro Light theme: Crisp off-white canvas with accessible editorial syntax colors
    monaco.editor.defineTheme('emailpro-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: '', foreground: '17191D' },
        { token: 'comment', foreground: '858C97', fontStyle: 'italic' },
        { token: 'keyword', foreground: '4F46E5' },
        { token: 'string', foreground: '059669' },
        { token: 'number', foreground: 'D97706' },
        { token: 'type', foreground: '0284C7' },
        { token: 'tag', foreground: '2563EB' },
        { token: 'attribute.name', foreground: '6366F1' },
        { token: 'attribute.value', foreground: '059669' },
        { token: 'delimiter', foreground: '5F6672' },
      ],
      colors: {
        'editor.background': '#FAFAFA',
        'editor.foreground': '#17191D',
        'editorCursor.foreground': '#4F46E5',
        'editor.lineHighlightBackground': '#F0F2F5',
        'editorLineNumber.foreground': '#A0A7B2',
        'editorLineNumber.activeForeground': '#17191D',
        'editor.selectionBackground': '#E0E7FF80',
        'editorIndentGuide.background1': '#E2E5EA',
        'editorIndentGuide.activeBackground1': '#CBD1DA',
      }
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
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Set up a custom resize observer for smooth layout adjustment
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
      
      editor.focus();
    }
  }, []);

  const lineCount = React.useMemo(() => {
    return (code.match(/\n/g) || []).length + 1;
  }, [code]);

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border-base transition-colors">
      {/* 1. Quiet Editor Top Bar */}
      <div className="h-9 border-b border-border-base bg-surface px-3 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-fg-secondary">
            <FileCode2 className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-fg">
              template.{language === 'html' ? 'html' : 'tsx'}
            </span>
          </div>

          <div className="h-3 w-[1px] bg-border-base" />

          {/* Language Toggle: Clean text tabs */}
          <div className="flex items-center gap-1">
            {[
              { id: 'typescript', label: 'TSX' },
              { id: 'javascript', label: 'JSX' },
              { id: 'html', label: 'HTML' }
            ].map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => onLanguageChange(lang.id as any)}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors",
                  language === lang.id
                    ? "text-fg bg-surface-raised font-semibold shadow-xs border border-border-subtle"
                    : "text-fg-muted hover:text-fg hover:bg-surface-hover"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls: Format, History, Theme, Snippets */}
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={handleFormatCode}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors"
            title="Format document (Alt+Shift+F)"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline text-[11px]">Format</span>
          </button>

          <button 
            type="button"
            onClick={onToggleHistory}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
              !isHistoryCollapsed 
                ? "text-accent bg-accent-muted border border-accent-border" 
                : "text-fg-muted hover:text-fg hover:bg-surface-hover"
            )}
            title="Version history"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">History</span>
          </button>

          {language !== 'html' && (
            <>
              <div className="h-3 w-[1px] bg-border-base mx-1" />
              <ThemePicker currentCode={code} onCodeChange={onChange} />
              <SnippetsPicker onInsert={handleInsertSnippet} />
            </>
          )}
        </div>
      </div>

      {/* 2. Monaco Editor Canvas */}
      <div className="flex-1 min-h-0 relative overflow-hidden bg-editor-surface">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          theme={theme === 'light' ? 'emailpro-light' : 'emailpro-dark'}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 12.5,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: false,
            padding: { top: 14, bottom: 14 },
            fontFamily: 'var(--font-mono), monospace',
            fontWeight: '400',
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
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
              alwaysConsumeMouseWheel: true
            }
          } as any}
        />
      </div>

      {/* 3. Quiet Editor Footer */}
      <div className="h-6 border-t border-border-base bg-surface px-3 flex items-center justify-between shrink-0 select-none text-[11px] text-fg-muted font-mono">
        <div className="flex items-center gap-3">
          <span>{lineCount} lines</span>
          <span>{Math.round(code.length / 102.4) / 10} KB</span>
        </div>
        <div className="flex items-center gap-2">
          <span>UTF-8</span>
          <span className="text-border-base">·</span>
          <span>{language.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
});
