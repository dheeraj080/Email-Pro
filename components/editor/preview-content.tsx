'use client';

import React from 'react';
import { 
  Smartphone, 
  Monitor, 
  Trash2,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  Tablet,
  Copy,
  Check,
  Moon,
  Sun,
  Code,
  FileJson,
  ShieldCheck,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { QualityInspector } from './quality-inspector';
import { EmailQualityReport } from '@/lib/email-quality';

interface FrameProps {
  html?: string;
  className?: string;
  title?: string;
  isDarkMode?: boolean;
}

function Frame({ html = '', className, title, isDarkMode = false }: FrameProps) {
  const processedHtml = isDarkMode 
    ? `<style>
        html, body { background-color: #121212 !important; color: #f3f4f6 !important; }
        .bg-white, table.bg-white { background-color: #1e1e28 !important; }
        p, h1, h2, h3, h4, td, span { color: #e2e8f0 !important; }
       </style>` + html 
    : html;

  return (
    <iframe 
      title={title} 
      className={className} 
      srcDoc={processedHtml}
      style={{ width: '100%', height: '100%', border: 'none' }}
      sandbox="allow-same-origin"
    />
  );
}

interface PreviewContentProps {
  previewHtml: string;
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  previewTab: 'design' | 'html' | 'json' | 'quality';
  setPreviewTab: (tab: 'design' | 'html' | 'json' | 'quality') => void;
  customDimensions: { width: number; height: number } | null;
  setCustomDimensions: (dims: { width: number; height: number } | null) => void;
  isRendering: boolean;
  isDirty?: boolean;
  error: string | null;
  isSplit: boolean;
  onResize: (e: React.MouseEvent, direction: string) => void;
  activeTemplate: any;
  currentCode: string;
  qualityReport?: EmailQualityReport | null;
}

const DEVICE_PRESETS = [
  { name: 'iPhone 14', width: 393, height: 852, icon: Smartphone },
  { name: 'iPhone 13', width: 390, height: 844, icon: Smartphone },
  { name: 'Pixel 7', width: 412, height: 915, icon: Smartphone },
  { name: 'iPad Pro', width: 834, height: 1194, icon: Tablet },
  { name: 'iPad Mini', width: 768, height: 1024, icon: Tablet },
  { name: 'Desktop HD', width: 1280, height: 800, icon: Monitor },
  { name: 'Desktop Full HD', width: 1920, height: 1080, icon: Monitor },
];

export const PreviewContent = React.memo(function PreviewContent({
  previewHtml,
  previewMode,
  setPreviewMode,
  previewTab,
  setPreviewTab,
  customDimensions,
  setCustomDimensions,
  isRendering,
  error,
  isSplit,
  onResize,
  activeTemplate,
  currentCode,
  qualityReport
}: PreviewContentProps) {
  const [showPresets, setShowPresets] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isClientDarkMode, setIsClientDarkMode] = React.useState(false);
  const presetsRef = React.useRef<HTMLDivElement>(null);
  
  const [copiedHtml, setCopiedHtml] = React.useState(false);
  const [copiedJson, setCopiedJson] = React.useState(false);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(previewHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const jsonCode = React.useMemo(() => {
    return JSON.stringify({
      id: activeTemplate?.id || 'custom-template',
      name: activeTemplate?.name || 'Custom Template',
      language: activeTemplate?.language || 'typescript',
      code: currentCode
    }, null, 2);
  }, [activeTemplate, currentCode]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonCode);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  React.useEffect(() => {
    setIsMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (presetsRef.current && !presetsRef.current.contains(event.target as Node)) {
        setShowPresets(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const ResizeHandle = ({ direction }: { direction: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' }) => {
    const isHorizontal = direction === 'e' || direction === 'w';
    const isCorner = direction.length === 2;

    const positions: Record<string, string> = {
      n: "top-0 left-0 w-full h-1.5 cursor-ns-resize",
      s: "bottom-0 left-0 w-full h-1.5 cursor-ns-resize",
      e: "top-0 right-0 w-1.5 h-full cursor-ew-resize",
      w: "top-0 left-0 w-1.5 h-full cursor-ew-resize",
      ne: "top-0 right-0 w-4 h-4 cursor-nesw-resize z-40",
      nw: "top-0 left-0 w-4 h-4 cursor-nwse-resize z-40",
      se: "bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-40",
      sw: "bottom-0 left-0 w-4 h-4 cursor-nesw-resize z-40",
    };

    return (
      <div 
        className={cn(
          "absolute flex items-center justify-center group/handle z-50 pointer-events-auto",
          positions[direction],
          "hover:bg-accent/20 transition-all cursor-inherit"
        )}
        style={{ cursor: positions[direction].split(' ').find(c => c.startsWith('cursor-'))?.replace('cursor-', '') }}
        onMouseDown={(e) => onResize(e, direction)}
      >
        {isCorner ? (
          <div className="w-2 h-2 bg-fg-muted border border-border-strong rounded-full scale-75 group-hover/handle:scale-125 transition-transform" />
        ) : (
          <div className={cn(
            "bg-border-strong group-hover/handle:bg-accent transition-colors rounded-full opacity-0 group-hover/handle:opacity-100",
            isHorizontal ? "w-0.5 h-6" : "w-6 h-0.5"
          )} />
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-app">
      {/* 1. Preview Top Bar: Calm tabs & viewport controls */}
      <div className="h-9 border-b border-border-base bg-surface px-3 flex items-center justify-between shrink-0 select-none">
        {/* View Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPreviewTab('design')}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors",
              previewTab === 'design' 
                ? "bg-surface-elevated text-fg border border-border-subtle" 
                : "text-fg-muted hover:text-fg hover:bg-surface-hover"
            )}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Design</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewTab('html')}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors",
              previewTab === 'html' 
                ? "bg-surface-elevated text-fg border border-border-subtle" 
                : "text-fg-muted hover:text-fg hover:bg-surface-hover"
            )}
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewTab('json')}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors",
              previewTab === 'json' 
                ? "bg-surface-elevated text-fg border border-border-subtle" 
                : "text-fg-muted hover:text-fg hover:bg-surface-hover"
            )}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewTab('quality')}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors",
              previewTab === 'quality' 
                ? "bg-surface-elevated text-fg border border-border-subtle" 
                : "text-fg-muted hover:text-fg hover:bg-surface-hover"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quality</span>
            {qualityReport && (
              <span className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                qualityReport.size.status === 'critical' || qualityReport.counts.errors > 0
                  ? "bg-danger"
                  : qualityReport.size.status === 'warning' || qualityReport.counts.warnings > 0
                  ? "bg-warning"
                  : "bg-success"
              )} />
            )}
          </button>
        </div>

        {/* Viewport & Render Controls */}
        <div className="flex items-center gap-2">
          {isRendering && (
            <div className="flex items-center gap-1.5 text-xs text-accent mr-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="hidden sm:inline text-[11px]">Updating</span>
            </div>
          )}

          {previewTab === 'design' && (
            <>
              {/* Dark mode simulation */}
              <button
                type="button"
                onClick={() => setIsClientDarkMode(!isClientDarkMode)}
                className={cn(
                  "p-1.5 rounded text-xs transition-colors",
                  isClientDarkMode 
                    ? "bg-accent/20 text-accent border border-accent/30" 
                    : "text-fg-muted hover:text-fg hover:bg-surface-hover"
                )}
                title={isClientDarkMode ? "Client dark mode simulated" : "Simulate client dark mode"}
              >
                {isClientDarkMode ? <Moon className="w-3.5 h-3.5 text-accent" /> : <Sun className="w-3.5 h-3.5" />}
              </button>

              <div className="h-3 w-[1px] bg-border-base" />

              {/* Viewport size toggles */}
              <div className="flex items-center gap-0.5">
                <button 
                  type="button"
                  onClick={() => { setPreviewMode('mobile'); setCustomDimensions(null); }}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    previewMode === 'mobile' && !customDimensions 
                      ? "bg-surface-elevated text-fg border border-border-subtle" 
                      : "text-fg-muted hover:text-fg hover:bg-surface-hover"
                  )}
                  title="Mobile viewport (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button"
                  onClick={() => { setPreviewMode('desktop'); setCustomDimensions(null); }}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    previewMode === 'desktop' && !customDimensions 
                      ? "bg-surface-elevated text-fg border border-border-subtle" 
                      : "text-fg-muted hover:text-fg hover:bg-surface-hover"
                  )}
                  title="Desktop viewport"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Preset Selector */}
              <div className="relative" ref={presetsRef}>
                <button 
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded text-xs text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors",
                    showPresets && "bg-surface-elevated text-fg"
                  )}
                  title="Device presets"
                >
                  <span className="hidden sm:inline text-[11px]">Presets</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", showPresets && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {showPresets && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      className="absolute top-full right-0 mt-1.5 w-44 bg-surface-elevated border border-border-base rounded-xl shadow-2xl z-[100] p-1 overflow-hidden text-fg"
                    >
                      {DEVICE_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setCustomDimensions({ width: preset.width, height: preset.height });
                            setShowPresets(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-surface-hover rounded-lg transition-colors group text-left"
                        >
                          <div className="flex items-center gap-2">
                            <preset.icon className="w-3.5 h-3.5 text-fg-muted group-hover:text-accent" />
                            <span className="text-xs text-fg-secondary group-hover:text-fg">{preset.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-fg-muted">{preset.width}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {customDimensions && (
                <button 
                  type="button"
                  onClick={() => setCustomDimensions(null)}
                  className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-mono text-fg-muted hover:text-danger rounded hover:bg-danger/10 transition-colors"
                  title="Reset custom size"
                >
                  <span>{Math.round(customDimensions.width)}×{Math.round(customDimensions.height)}</span>
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 2. Main Stage Area */}
      <div className="flex-1 relative overflow-hidden bg-bg-app">
        {/* Error notification banner if any */}
        {error && (
          <div className="absolute top-3 left-3 right-3 z-50 bg-danger/15 border border-danger/40 rounded-xl p-3 shadow-xl flex items-start justify-between gap-3 text-fg">
            <div className="flex items-start gap-2.5 min-w-0">
              <AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-semibold text-danger">Template Compilation Error</div>
                <div className="text-xs text-danger/90 font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto custom-scrollbar">
                  {error}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-2 py-1 text-xs bg-danger/20 hover:bg-danger/30 border border-danger/40 rounded-md text-fg shrink-0 transition-colors"
            >
              Reload
            </button>
          </div>
        )}

        <div className="h-full w-full overflow-auto custom-scrollbar p-4 md:p-8 flex items-center justify-center">
          {previewTab === 'quality' ? (
            <div className="w-full h-full max-w-4xl bg-surface rounded-xl border border-border-base overflow-hidden">
              <QualityInspector report={qualityReport || null} isRendering={isRendering} />
            </div>
          ) : previewTab === 'design' ? (
            /* Clean Email Canvas (NO fake browser chrome) */
            <div 
              id={isSplit ? 'preview-container-split' : 'preview-container'}
              className={cn(
                "relative shrink-0 shadow-2xl transition-all duration-300 flex flex-col border border-border-base",
                customDimensions
                  ? "rounded-xl"
                  : previewMode === 'mobile'
                  ? "w-[375px] h-[667px] max-w-full rounded-2xl"
                  : "w-full max-w-[680px] h-full rounded-xl"
              )}
              style={customDimensions ? {
                width: `${customDimensions.width}px`,
                height: `${customDimensions.height}px`,
              } : {}}
            >
              {/* Paper Canvas */}
              <div className={cn("flex-1 relative overflow-hidden transition-colors duration-200 rounded-inherit", isClientDarkMode ? "bg-[#121212]" : "bg-white")}>
                {isMounted && previewHtml ? (
                  <Frame 
                    html={previewHtml}
                    className="w-full h-full border-none"
                    isDarkMode={isClientDarkMode}
                    title="Email Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-2 opacity-60">
                    <div className="w-4 h-4 rounded-full border-2 border-border-base border-t-accent animate-spin" />
                    <span className="text-xs text-fg-muted">Rendering preview...</span>
                  </div>
                )}
              </div>
              
              <ResizeHandle direction="e" />
              <ResizeHandle direction="w" />
              <ResizeHandle direction="s" />
              <ResizeHandle direction="se" />
              <ResizeHandle direction="sw" />
            </div>
          ) : previewTab === 'html' ? (
            /* Clean Compiled HTML View */
            <div className="w-full h-full max-w-4xl bg-surface rounded-xl border border-border-base overflow-hidden flex flex-col">
              <div className="h-9 border-b border-border-base px-3 flex items-center justify-between shrink-0 select-none bg-surface">
                <span className="text-xs font-mono text-fg-muted">compiled.html</span>
                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-fg-secondary hover:text-fg hover:bg-surface-hover transition-colors"
                >
                  {copiedHtml ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" />
                      <span className="text-success">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-accent" />
                      <span>Copy HTML</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex-1 p-4 overflow-auto custom-scrollbar bg-surface-raised">
                <pre className="text-xs font-mono leading-relaxed text-warning whitespace-pre-wrap select-text">
                  {previewHtml}
                </pre>
              </div>
            </div>
          ) : (
            /* Clean JSON View */
            <div className="w-full h-full max-w-4xl bg-surface rounded-xl border border-border-base overflow-hidden flex flex-col">
              <div className="h-9 border-b border-border-base px-3 flex items-center justify-between shrink-0 select-none bg-surface">
                <span className="text-xs font-mono text-fg-muted">template.json</span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-fg-secondary hover:text-fg hover:bg-surface-hover transition-colors"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" />
                      <span className="text-success">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-accent" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex-1 p-4 overflow-auto custom-scrollbar bg-surface-raised">
                <pre className="text-xs font-mono leading-relaxed text-success whitespace-pre-wrap select-text">
                  {jsonCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
