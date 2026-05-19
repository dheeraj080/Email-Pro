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
  Tablet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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
          "hover:bg-powder-blue-500/20 transition-all cursor-inherit"
        )}
        style={{ cursor: positions[direction].split(' ').find(c => c.startsWith('cursor-'))?.replace('cursor-', '') }}
        onMouseDown={(e) => onResize(e, direction)}
      >
        {isCorner ? (
          <div className="w-2.5 h-2.5 bg-white border-2 border-powder-blue-500 rounded-full shadow-sm scale-75 group-hover/handle:scale-110 transition-transform" />
        ) : (
          <div className={cn(
            "bg-alabaster-grey-200 group-hover/handle:bg-powder-blue-500 transition-colors rounded-full",
            isHorizontal ? "w-0.5 h-8" : "w-8 h-0.5"
          )} />
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 bg-alabaster-grey-100 relative overflow-hidden flex flex-col">
        {error && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-white/80 backdrop-blur-sm">
            <div className="max-w-md w-full bg-white border border-red-100 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-ink-black-900">Rendering Error</h3>
              <p className="text-xs text-red-600 font-mono bg-red-50/50 p-3 rounded-lg border border-red-50 break-all">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs font-bold text-ink-black-400 hover:text-ink-black-900 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-3 h-3" /> Try Refreshing
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 overflow-auto custom-scrollbar p-4 md:p-8">
            <div className="h-full w-full flex items-center justify-center">
              {previewTab === 'design' ? (
                <div 
                  id={isSplit ? 'preview-container-split' : 'preview-container'}
                  className={cn(
                    "bg-white shadow-2xl relative shrink-0 overflow-auto custom-scrollbar",
                    !customDimensions && (previewMode === 'mobile' ? "w-[375px] h-[667px] rounded-[32px] ring-8 ring-ink-black-900/5 transition-all duration-500" : "w-full h-full rounded-lg transition-all duration-500")
                  )}
                  style={customDimensions ? {
                    width: `${customDimensions.width}px`,
                    height: `${customDimensions.height}px`,
                    borderRadius: customDimensions.width < 450 ? '32px' : '8px'
                  } : {}}
                >
                  <div className="w-full min-h-full p-4 md:p-8 flex justify-center overflow-x-hidden">
                    <div 
                      className="w-full max-w-full md:max-w-2xl bg-white origin-top"
                      suppressHydrationWarning
                    >
                      {isMounted && previewComponent ? previewComponent : (
                        <div className="flex flex-col items-center justify-center h-48 space-y-4 opacity-50">
                          <div className="w-8 h-8 rounded-full border-2 border-t-powder-blue-500 border-alabaster-grey-200 animate-spin" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Warming engine...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ResizeHandle direction="e" />
                  <ResizeHandle direction="w" />
                  <ResizeHandle direction="s" />
                  <ResizeHandle direction="se" />
                  <ResizeHandle direction="sw" />
                </div>
              ) : (
                <div className="w-full h-full bg-white rounded-xl border border-ink-black-100 overflow-hidden shadow-sm flex flex-col">
                  <div className="flex-1 p-6 overflow-auto custom-scrollbar">
                    <pre className="text-[10px] font-mono leading-relaxed text-ink-black-600 bg-alabaster-grey-50 p-6 rounded-lg border border-ink-black-50 whitespace-pre-wrap">
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
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-powder-blue-100 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-50"
              >
                <RefreshCw className="w-3 h-3 text-powder-blue-500 animate-spin" />
                <span className="text-[9px] font-black uppercase tracking-widest text-powder-blue-600">Rendering</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-8 border-t border-ink-black-100/80 bg-white px-3 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex bg-alabaster-grey-100 border border-ink-black-100/80 rounded-md p-0.5 shadow-sm">
            <button
              onClick={() => setPreviewTab('design')}
              className={cn(
                "px-2.5 py-0.5 rounded text-[9px] font-bold transition-all",
                previewTab === 'design' 
                  ? "bg-white text-ink-black-900 shadow-sm border border-ink-black-100/50" 
                  : "text-ink-black-400 hover:text-ink-black-600"
              )}
            >
              DESIGN
            </button>
            <button
              onClick={() => setPreviewTab('html')}
              className={cn(
                "px-2.5 py-0.5 rounded text-[9px] font-bold transition-all",
                previewTab === 'html' 
                  ? "bg-white text-ink-black-900 shadow-sm border border-ink-black-100/50" 
                  : "text-ink-black-400 hover:text-ink-black-600"
              )}
            >
              HTML
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {customDimensions && (
            <span className="text-[10px] font-mono text-ink-black-400">
              {Math.round(customDimensions.width)} × {Math.round(customDimensions.height)}
            </span>
          )}

          <div className="relative" ref={presetsRef}>
            <button 
              onClick={() => setShowPresets(!showPresets)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold text-ink-black-500 hover:text-ink-black-900 transition-colors bg-transparent",
                showPresets && "text-ink-black-950 bg-ink-black-50"
              )}
              title="Select device size presets"
            >
              <Smartphone className="w-3.5 h-3.5 text-ink-black-400" />
              <span>Devices</span>
              <ChevronDown className={cn("w-3 h-3 transition-transform text-ink-black-400", showPresets && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showPresets && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute bottom-full right-0 mb-1.5 w-48 bg-white border border-ink-black-100 rounded-xl shadow-2xl z-[100] overflow-hidden"
                >
                  <div className="p-1">
                    {DEVICE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setCustomDimensions({ width: preset.width, height: preset.height });
                          setShowPresets(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-alabaster-grey-50 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <preset.icon className="w-3.5 h-3.5 text-ink-black-400 group-hover:text-powder-blue-500" />
                          <span className="text-[10px] font-medium text-ink-black-600 truncate">{preset.name}</span>
                        </div>
                        <span className="text-[8px] font-mono text-ink-black-300">{preset.width}×{preset.height}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-3 w-[1px] bg-ink-black-100" />

          <div className="flex items-center bg-alabaster-grey-100 border border-ink-black-100/80 rounded-md p-0.5 shadow-sm">
            <button 
              onClick={() => { setPreviewMode('mobile'); setCustomDimensions(null); }}
              className={cn(
                "p-1 rounded transition-all",
                previewMode === 'mobile' && !customDimensions ? "bg-white text-ink-black-900 shadow-sm border border-ink-black-100/50" : "text-ink-black-300 hover:text-ink-black-600"
              )}
              title="Standard Mobile Viewport"
            >
              <Smartphone className="w-3 h-3" />
            </button>
            <button 
              onClick={() => { setPreviewMode('desktop'); setCustomDimensions(null); }}
              className={cn(
                "p-1 rounded transition-all",
                previewMode === 'desktop' && !customDimensions ? "bg-white text-ink-black-900 shadow-sm border border-ink-black-100/50" : "text-ink-black-300 hover:text-ink-black-600"
              )}
              title="Standard Desktop Viewport"
            >
              <Monitor className="w-3 h-3" />
            </button>
          </div>

          {customDimensions && (
            <button 
              onClick={() => setCustomDimensions(null)}
              className="p-1 text-red-500 hover:bg-red-50 rounded-md border border-red-150 transition-colors"
              title="Reset view back to standard viewport"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
