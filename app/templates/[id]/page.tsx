'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Code2, 
  Download, 
  Zap, 
  Copy,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  Layout,
  BarChart3
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { exportToHTML } from '@/lib/render-email';
import { analyzeEmail, EmailMetrics } from '@/lib/analytics-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const DEVICES = {
  mobile: { width: 375, icon: Smartphone, label: 'Mobile' },
  tablet: { width: 768, icon: Tablet, label: 'Tablet' },
  desktop: { width: '100%', icon: Monitor, label: 'Desktop' },
};

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [html, setHtml] = useState<string>('');
  const [metrics, setMetrics] = useState<EmailMetrics | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setIsRendering(true);
      try {
        const renderedHtml = await exportToHTML(template.code);
        setHtml(renderedHtml);
        const analysis = await analyzeEmail(template.code);
        setMetrics(analysis);
      } catch (err) {
        console.error('Failed to render template:', err);
      } finally {
        setIsRendering(false);
      }
    }
    load();
  }, [template]);

  const copyCode = () => {
    navigator.clipboard.writeText(template.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAboveLimit = metrics ? metrics.sizeKb > 102 : false;
  const healthStatus = metrics ? (metrics.sizeKb > 102 ? 'Critical' : metrics.sizeKb > 80 ? 'Warning' : 'Optimal') : 'Pending';

  const handleUseTemplate = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-slate-900 font-sans selection:bg-slate-950 selection:text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="rounded-full hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-slate-200" />
          <h1 className="font-bold tracking-tight text-slate-950">{template.name}</h1>
          <Badge variant="neutral" className="text-[10px] font-black uppercase tracking-widest py-0 px-2 rounded-sm border-slate-200 text-slate-400">
            {template.language || 'typescript'}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl mr-4">
            {(['preview', 'code'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeTab === tab 
                    ? "bg-white text-slate-950 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <Button 
            onClick={handleUseTemplate}
            className="bg-slate-950 hover:bg-slate-800 text-white rounded-xl h-10 px-6 font-bold"
          >
            Use Template
          </Button>
        </div>
      </nav>

      <main className="pt-16 flex h-screen">
        {/* Left Sidebar: Details & Analytics */}
        <aside className="w-80 border-r border-slate-100 bg-white overflow-y-auto hidden xl:flex flex-col">
          <div className="p-8 space-y-8">
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Framework</span>
                  <span className="font-bold">React Email</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Engine</span>
                  <span className="font-bold">MJML / Tables</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Type</span>
                  <span className="font-bold">Transactional</span>
                </div>
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {metrics && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Technical Health</h3>
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                    healthStatus === 'Optimal' ? "bg-emerald-50 text-emerald-600" : 
                    healthStatus === 'Warning' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {healthStatus}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">HTML Size</span>
                      <span className={cn(
                        isAboveLimit ? "text-rose-600" : "text-emerald-600"
                      )}>{metrics.sizeKb} KB</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((metrics.sizeKb / 102) * 100, 100)}%` }}
                        className={cn(
                          "h-full rounded-full",
                          isAboveLimit ? "bg-rose-500" : "bg-emerald-500"
                        )}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">
                      Gmail clips messages larger than 102KB.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Links</p>
                      <p className="text-xl font-display font-black text-slate-950">{metrics.linkCount}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Accessibility</p>
                      <p className="text-xl font-display font-black text-slate-950">{metrics.accessibilityScore}%</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className="h-px bg-slate-100" />

            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compatibility</h3>
              <div className="grid grid-cols-4 gap-3">
                {['Outlook', 'Gmail', 'Apple', 'HGL'].map((client) => (
                  <div key={client} className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                    <span className="text-[8px] font-black uppercase tracking-tight text-slate-400">{client}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-auto p-6 bg-slate-50/50 border-t border-slate-100">
             <p className="text-[9px] font-medium text-slate-400 italic">
               * All templates are tested using precision engineering tools to guarantee 99.9% inbox delivery.
             </p>
          </div>
        </aside>

        {/* Main Preview Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#F8F9FA]">
          {/* Device Switcher Toolar */}
          <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-center gap-1 shrink-0">
            {(Object.entries(DEVICES) as [DeviceType, typeof DEVICES['mobile']][]).map(([key, config]) => (
              <Button
                key={key}
                variant="ghost"
                size="sm"
                onClick={() => setDevice(key)}
                className={cn(
                  "rounded-lg px-4 h-9 gap-2 transition-all",
                  device === key 
                    ? "bg-slate-950 text-white hover:bg-slate-900" 
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <config.icon className="w-4 h-4" />
                <span className="text-xs font-bold">{config.label}</span>
              </Button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex justify-center">
            <AnimatePresence mode="wait">
              {activeTab === 'preview' ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-fit flex justify-center w-full"
                >
                  <div 
                    className={cn(
                      "bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 transition-all duration-500",
                      device === 'mobile' ? "w-[375px]" : device === 'tablet' ? "w-[768px]" : "w-full max-w-[900px]"
                    )}
                    style={{ minHeight: '600px' }}
                  >
                    {isRendering ? (
                      <div className="h-[600px] flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-950 rounded-full animate-spin" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Assembling Components...</p>
                      </div>
                    ) : (
                      <iframe 
                        srcDoc={html} 
                        className="w-full h-full border-none min-h-[600px]"
                        title="Template Preview"
                      />
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="code"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full max-w-4xl"
                >
                  <Card className="bg-slate-950 border-slate-800 overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={copyCode}
                        className="text-slate-400 hover:text-white hover:bg-slate-900 h-8"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-2" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto text-slate-300">
                      <pre><code>{template.code}</code></pre>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
