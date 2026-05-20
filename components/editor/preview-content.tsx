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
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';

interface FrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

function Frame({ children, className, title }: FrameProps) {
  const [contentRef, setContentRef] = React.useState<HTMLIFrameElement | null>(null);
  const [iframeLoaded, setIframeLoaded] = React.useState(false);
  const mountNode = contentRef?.contentWindow?.document?.body;

  React.useEffect(() => {
    if (!contentRef) return;
    const doc = contentRef.contentWindow?.document;
    if (!doc) return;

    const style = doc.createElement('style');
    style.innerHTML = `
      html, body {
        margin: 0;
        padding: 0;
        background-color: #ffffff;
        font-family: ui-sans-serif, system-ui, sans-serif;
        overflow-x: hidden;
      }
      /* Custom scrollbars inside iframe */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #e5e5e5;
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #d4d4d4;
      }
    `;
    doc.head.appendChild(style);
    setIframeLoaded(true);
  }, [contentRef]);

  return (
    <iframe 
      title={title} 
      className={className} 
      ref={setContentRef}
      onLoad={() => setIframeLoaded(true)}
    >
      {mountNode && iframeLoaded && createPortal(children, mountNode)}
    </iframe>
  );
}

interface PreviewContentProps {
  previewHtml: string;
  previewComponent: React.ReactNode;
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  previewTab: 'design' | 'html';
  setPreviewTab: (tab: 'design' | 'html') => void;
  customDimensions: { width: number; height: number } | null;
  setCustomDimensions: (dims: { width: number; height: number } | null) => void;
  isRendering: boolean;
  error: string | null;
  isSplit: boolean;
  onResize: (e: React.MouseEvent, direction: string) => void;
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
  previewComponent,
  previewMode,
  setPreviewMode,
  previewTab,
  setPreviewTab,
  customDimensions,
  setCustomDimensions,
  isRendering,
  error,
  isSplit,
  onResize
}: PreviewContentProps) {
  const [showPresets, setShowPresets] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const presetsRef = React.useRef<HTMLDivElement>(null);

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
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 bg-[#F8FAF9] relative overflow-hidden flex flex-col">
        {error && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-neutral-950/40 backdrop-blur-sm">
            <div className="max-w-lg w-full bg-[#181818] border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col text-left space-y-4">
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-wider">Transpilation / Build Failure</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-white mb-1">Sucrase Parsing Error</h3>
                <p className="text-[10px] text-neutral-400 font-mono bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 break-all leading-relaxed whitespace-pre-wrap">
                  {error}
                </p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-800/80">
                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Compiler Telemetry</span>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[9px] font-bold text-neutral-400 hover:text-white transition-colors flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg border border-neutral-700 shadow-2xs"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" /> Retry Build
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
                    "bg-white shadow-xl relative shrink-0 overflow-hidden border border-neutral-200/80 flex flex-col",
                    !customDimensions && (previewMode === 'mobile' ? "w-[375px] h-[667px] rounded-[24px] transition-all duration-500" : "w-full h-full rounded-[14px] transition-all duration-500")
                  )}
                  style={customDimensions ? {
                    width: `${customDimensions.width}px`,
                    height: `${customDimensions.height}px`,
                    borderRadius: customDimensions.width < 450 ? '24px' : '14px'
                  } : {}}
                >
                  {/* Browser Mock top navigation strip */}
                  <div className="h-10 bg-neutral-50/80 border-b border-neutral-200/50 px-4 flex items-center justify-between shrink-0 select-none">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-300/85" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-300/85" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-300/85" />
                    </div>

                    <div className="flex-1 max-w-[280px] bg-white border border-neutral-200/50 rounded-lg py-1 px-3.5 flex items-center gap-1.5 justify-center shadow-3xs mx-4">
                      <Lock className="w-3 h-3 text-emerald-500" />
                      <span className="text-[9px] font-mono text-neutral-400 truncate tracking-wide">sandbox.email.pro/preview</span>
                    </div>

                    <div className="w-12 flex justify-end">
                      <RefreshCw className="w-3 h-3 text-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors" />
                    </div>
                  </div>

                  {/* Browser body view */}
                  <div className="flex-1 bg-white relative overflow-hidden">
                    {isMounted && previewComponent ? (
                      <Frame className="w-full h-full border-none bg-white" title="Email Preview">
                        <div className={cn(
                          "w-full min-h-full flex justify-center",
                          previewMode === 'mobile' || (customDimensions && customDimensions.width < 600)
                            ? "p-0"
                            : "p-4 md:p-8"
                        )}>
                          <div 
                            className="w-full max-w-full md:max-w-2xl bg-white origin-top"
                            suppressHydrationWarning
                          >
                            {previewComponent}
                          </div>
                        </div>
                      </Frame>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-55">
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-200 border-t-neutral-800 animate-spin" />
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
              ) : (
                /* Raw HTML Code Output Display Panel */
                <div className="w-full h-full bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs flex flex-col">
                  <div className="h-9.5 bg-neutral-50/80 border-b border-neutral-200/50 px-4 flex items-center justify-between shrink-0 select-none">
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">compiled-output.html</span>
                    <span className="text-[8px] font-mono text-neutral-400/80">Read-Only</span>
                  </div>
                  <div className="flex-1 p-6 overflow-auto custom-scrollbar">
                    <pre className="text-[10px] font-mono leading-relaxed text-neutral-600 bg-neutral-50/50 p-5 rounded-xl border border-neutral-200/50 whitespace-pre-wrap">
                      {previewHtml}
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
                className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-neutral-200 px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2 z-50 select-none"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-wider text-neutral-800">Compiling Blueprint</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-9.5 border-t border-neutral-200/80 bg-white px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-100 border border-neutral-200/60 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setPreviewTab('design')}
              className={cn(
                "px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-all",
                previewTab === 'design' 
                  ? "bg-white text-neutral-900 shadow-2xs border border-neutral-200/50" 
                  : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              DESIGN
            </button>
            <button
              onClick={() => setPreviewTab('html')}
              className={cn(
                "px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-all",
                previewTab === 'html' 
                  ? "bg-white text-neutral-900 shadow-2xs border border-neutral-200/50" 
                  : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              HTML
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {customDimensions && (
            <span className="text-[9px] font-mono font-bold text-neutral-400 bg-neutral-50 border border-neutral-200/50 px-2 py-0.5 rounded-md">
              {Math.round(customDimensions.width)} × {Math.round(customDimensions.height)} px
            </span>
          )}

          <div className="relative" ref={presetsRef}>
            <button 
              onClick={() => setShowPresets(!showPresets)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold text-neutral-500 hover:text-neutral-950 transition-all bg-transparent uppercase tracking-wider",
                showPresets && "bg-neutral-100 text-neutral-950"
              )}
              title="Select device size presets"
            >
              <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
              <span>Presets</span>
              <ChevronDown className={cn("w-3 h-3 transition-transform text-neutral-400", showPresets && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showPresets && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-neutral-200/60 rounded-xl shadow-lg z-[100] overflow-hidden"
                >
                  <div className="p-1">
                    {DEVICE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setCustomDimensions({ width: preset.width, height: preset.height });
                          setShowPresets(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-50 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <preset.icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-indigo-600" />
                          <span className="text-[10px] font-bold text-neutral-600 truncate">{preset.name}</span>
                        </div>
                        <span className="text-[8px] font-mono text-neutral-400">{preset.width}×{preset.height}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-[1px] bg-neutral-200" />

          <div className="flex items-center bg-neutral-100 border border-neutral-200/60 rounded-lg p-0.5 shadow-2xs">
            <button 
              onClick={() => { setPreviewMode('mobile'); setCustomDimensions(null); }}
              className={cn(
                "p-1 rounded-md transition-all",
                previewMode === 'mobile' && !customDimensions ? "bg-white text-neutral-900 shadow-2xs border border-neutral-200/50" : "text-neutral-400 hover:text-neutral-600"
              )}
              title="Standard Mobile Viewport"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => { setPreviewMode('desktop'); setCustomDimensions(null); }}
              className={cn(
                "p-1 rounded-md transition-all",
                previewMode === 'desktop' && !customDimensions ? "bg-white text-neutral-900 shadow-2xs border border-neutral-200/50" : "text-neutral-400 hover:text-neutral-600"
              )}
              title="Standard Desktop Viewport"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {customDimensions && (
            <button 
              onClick={() => setCustomDimensions(null)}
              className="p-1 text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
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
