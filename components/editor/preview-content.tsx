'use client';

import React from 'react';
import { 
  Eye, 
  Smartphone, 
  Monitor, 
  Trash2,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  Tablet,
  Lock,
  Globe,
  HelpCircle,
  CheckCircle,
  Settings,
  Copy,
  Check,
  FileJson,
  Moon,
  Sun,
  Variable
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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
  previewTab: 'design' | 'html' | 'json';
  setPreviewTab: (tab: 'design' | 'html' | 'json') => void;
  customDimensions: { width: number; height: number } | null;
  setCustomDimensions: (dims: { width: number; height: number } | null) => void;
  isRendering: boolean;
  isDirty?: boolean;
  error: string | null;
  isSplit: boolean;
  onResize: (e: React.MouseEvent, direction: string) => void;
  activeTemplate: any;
  currentCode: string;
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
  isDirty = false,
  error,
  isSplit,
  onResize,
  activeTemplate,
  currentCode
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
      ne: "top-0 right-0 w-5 h-5 cursor-nesw-resize z-40",
      nw: "top-0 left-0 w-5 h-5 cursor-nwse-resize z-40",
      se: "bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-40",
      sw: "bottom-0 left-0 w-5 h-5 cursor-nesw-resize z-40",
    };

    return (
      <div 
        className={cn(
          "absolute flex items-center justify-center group/handle z-50 pointer-events-auto",
          positions[direction],
          "hover:bg-indigo-500/20 transition-all cursor-inherit"
        )}
        style={{ cursor: positions[direction].split(' ').find(c => c.startsWith('cursor-'))?.replace('cursor-', '') }}
        onMouseDown={(e) => onResize(e, direction)}
      >
        {isCorner ? (
          <div className="w-2.5 h-2.5 bg-white border-2 border-indigo-500 rounded-full shadow-sm scale-75 group-hover/handle:scale-110 transition-transform" />
        ) : (
          <div className={cn(
            "bg-neutral-200 group-hover/handle:bg-indigo-500 transition-colors rounded-full",
            isHorizontal ? "w-0.5 h-8" : "w-8 h-0.5"
          )} />
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#07080b]">
      <div className="flex-1 bg-[#07080b] relative overflow-hidden flex flex-col">
        {error && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-neutral-950/80 backdrop-blur-sm">
            <div className="max-w-lg w-full bg-[#0c0d12] border border-[#1f222e] rounded-2xl p-6 shadow-2xl flex flex-col text-left space-y-4">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-wider">Template Render Failure</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-white mb-1">Template Compilation Error</h3>
                <p className="text-[10px] text-neutral-300 font-mono bg-[#07080b] p-4 rounded-xl border border-[#1f222e] break-all leading-relaxed whitespace-pre-wrap">
                  {error}
                </p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#1f222e]">
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Compiler Telemetry</span>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[9px] font-bold text-neutral-300 hover:text-white transition-colors flex items-center gap-1 bg-[#12141c] hover:bg-[#1f222e] px-3 py-1.5 rounded-lg border border-[#1f222e] shadow-xs"
                >
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" /> Retry Build
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 overflow-auto custom-scrollbar p-6 md:p-8">
            <div className="h-full w-full flex items-center justify-center">
              {previewTab === 'design' ? (
                /* Sleek browser window simulation wrapper */
                <div 
                  id={isSplit ? 'preview-container-split' : 'preview-container'}
                  className={cn(
                    "bg-white shadow-2xl relative shrink-0 overflow-hidden border border-[#1f222e] flex flex-col",
                    !customDimensions && (previewMode === 'mobile' ? "w-[375px] h-[667px] rounded-[24px] transition-all duration-500" : "w-full h-full rounded-[14px] transition-all duration-500")
                  )}
                  style={customDimensions ? {
                    width: `${customDimensions.width}px`,
                    height: `${customDimensions.height}px`,
                    borderRadius: customDimensions.width < 450 ? '24px' : '14px'
                  } : {}}
                >
                  {/* Browser Mock top navigation strip */}
                  <div className="h-10 bg-[#0c0d12] border-b border-[#1f222e] px-4 flex items-center justify-between shrink-0 select-none">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                    </div>

                    <div className="flex-1 max-w-[280px] bg-[#07080b] border border-[#1f222e] rounded-lg py-1 px-3.5 flex items-center gap-1.5 justify-center shadow-xs mx-4">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span className="text-[9px] font-mono text-neutral-400 truncate tracking-wide">sandbox.email.pro/preview</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsClientDarkMode(!isClientDarkMode)}
                        className={cn(
                          "px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all border",
                          isClientDarkMode 
                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" 
                            : "bg-[#12141c] text-neutral-400 border-[#1f222e] hover:text-white"
                        )}
                        title="Simulate Client Dark Mode rendering"
                      >
                        {isClientDarkMode ? <Moon className="w-3 h-3 text-indigo-400" /> : <Sun className="w-3 h-3 text-amber-400" />}
                        <span className="hidden sm:inline">{isClientDarkMode ? "Dark" : "Light"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Browser body view */}
                  <div className={cn("flex-1 relative overflow-hidden transition-colors duration-300", isClientDarkMode ? "bg-[#121212]" : "bg-white")}>
                    {/* Render high-fidelity error banner if compilation failed */}
                    {error && (
                      <div className="absolute top-3 left-3 right-3 z-50 bg-rose-950/90 border border-rose-800 rounded-xl p-3.5 flex items-start gap-3 shadow-md text-white">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-wide">Compilation Error</h4>
                          <p className="text-[11px] text-rose-200 leading-relaxed font-mono whitespace-pre-wrap">{error}</p>
                        </div>
                      </div>
                    )}

                    {isMounted && previewHtml ? (
                      <Frame 
                        html={previewHtml}
                        className="w-full h-full border-none"
                        isDarkMode={isClientDarkMode}
                        title="Email Preview"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-70">
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-700 border-t-indigo-500 animate-spin" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Loading render viewport</span>
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
                /* Raw HTML Code Output Display Panel */
                <div className="w-full h-full bg-[#0c0d12] rounded-2xl border border-[#1f222e] overflow-hidden shadow-xs flex flex-col text-neutral-300">
                  <div className="h-10 bg-[#07080b] border-b border-[#1f222e] px-4 flex items-center justify-between shrink-0 select-none">
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">compiled-output.html</span>
                    <button
                      onClick={handleCopyHtml}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold text-neutral-300 hover:text-white hover:bg-[#1f222e] transition-all bg-[#12141c] border border-[#1f222e] shadow-xs"
                    >
                      {copiedHtml ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-indigo-400" />
                          <span>Copy HTML</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex-1 p-6 overflow-auto custom-scrollbar bg-[#07080b]">
                    <pre className="text-[10px] font-mono leading-relaxed text-amber-300/90 bg-[#0c0d12] p-5 rounded-xl border border-[#1f222e] whitespace-pre-wrap select-text selection:bg-indigo-900/60">
                      {previewHtml}
                    </pre>
                  </div>
                </div>
              ) : (
                /* JSON Configuration Output Display Panel */
                <div className="w-full h-full bg-[#0c0d12] rounded-2xl border border-[#1f222e] overflow-hidden shadow-xs flex flex-col text-neutral-300">
                  <div className="h-10 bg-[#07080b] border-b border-[#1f222e] px-4 flex items-center justify-between shrink-0 select-none">
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">configuration.json</span>
                    <button
                      onClick={handleCopyJson}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold text-neutral-300 hover:text-white hover:bg-[#1f222e] transition-all bg-[#12141c] border border-[#1f222e] shadow-xs"
                    >
                      {copiedJson ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-indigo-400" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex-1 p-6 overflow-auto custom-scrollbar bg-[#07080b]">
                    <pre className="text-[10px] font-mono leading-relaxed text-emerald-300/90 bg-[#0c0d12] p-5 rounded-xl border border-[#1f222e] whitespace-pre-wrap select-text selection:bg-indigo-900/60">
                      {jsonCode}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isRendering && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 right-4 bg-[#0c0d12]/95 backdrop-blur-md border border-[#1f222e] px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2 z-50 select-none"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-wider text-white">Compiling Blueprint</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-9.5 border-t border-[#1f222e] bg-[#0c0d12] px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex bg-[#07080b] border border-[#1f222e] rounded-lg p-0.5 shadow-xs">
            <button
              onClick={() => setPreviewTab('design')}
              className={cn(
                "px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-all",
                previewTab === 'design' 
                  ? "bg-[#12141c] text-white shadow-xs border border-[#1f222e]" 
                  : "text-neutral-400 hover:text-white"
              )}
            >
              DESIGN
            </button>
            <button
              onClick={() => setPreviewTab('html')}
              className={cn(
                "px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-all",
                previewTab === 'html' 
                  ? "bg-[#12141c] text-white shadow-xs border border-[#1f222e]" 
                  : "text-neutral-400 hover:text-white"
              )}
            >
              HTML
            </button>
            <button
              onClick={() => setPreviewTab('json')}
              className={cn(
                "px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-all",
                previewTab === 'json' 
                  ? "bg-[#12141c] text-white shadow-xs border border-[#1f222e]" 
                  : "text-neutral-400 hover:text-white"
              )}
            >
              JSON
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {customDimensions && (
            <span className="text-[9px] font-mono font-bold text-neutral-400 bg-[#07080b] border border-[#1f222e] px-2 py-0.5 rounded-md">
              {Math.round(customDimensions.width)} × {Math.round(customDimensions.height)} px
            </span>
          )}

          <div className="relative" ref={presetsRef}>
            <button 
              onClick={() => setShowPresets(!showPresets)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold text-neutral-400 hover:text-white transition-all bg-transparent uppercase tracking-wider",
                showPresets && "bg-[#12141c] text-white"
              )}
              title="Select device size presets"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Presets</span>
              <ChevronDown className={cn("w-3 h-3 transition-transform text-neutral-400", showPresets && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showPresets && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute bottom-full right-0 mb-2 w-48 bg-[#0c0d12] border border-[#1f222e] rounded-xl shadow-2xl z-[100] overflow-hidden"
                >
                  <div className="p-1">
                    {DEVICE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setCustomDimensions({ width: preset.width, height: preset.height });
                          setShowPresets(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-[#12141c] rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <preset.icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-indigo-400" />
                          <span className="text-[10px] font-bold text-neutral-300 group-hover:text-white truncate">{preset.name}</span>
                        </div>
                        <span className="text-[8px] font-mono text-neutral-500">{preset.width}×{preset.height}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-[1px] bg-[#1f222e]" />

          <div className="flex items-center bg-[#07080b] border border-[#1f222e] rounded-lg p-0.5 shadow-xs">
            <button 
              onClick={() => { setPreviewMode('mobile'); setCustomDimensions(null); }}
              className={cn(
                "p-1 rounded-md transition-all",
                previewMode === 'mobile' && !customDimensions ? "bg-[#12141c] text-white shadow-xs border border-[#1f222e]" : "text-neutral-400 hover:text-white"
              )}
              title="Standard Mobile Viewport"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => { setPreviewMode('desktop'); setCustomDimensions(null); }}
              className={cn(
                "p-1 rounded-md transition-all",
                previewMode === 'desktop' && !customDimensions ? "bg-[#12141c] text-white shadow-xs border border-[#1f222e]" : "text-neutral-400 hover:text-white"
              )}
              title="Standard Desktop Viewport"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {customDimensions && (
            <button 
              onClick={() => setCustomDimensions(null)}
              className="p-1 text-rose-400 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition-colors"
              title="Reset view back to standard viewport"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
