'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Code, 
  Laptop, 
  Zap, 
  Layout, 
  Smartphone,
  CheckCircle2,
  FileCode,
  Download,
  Copy,
  Clock,
  Inbox
} from 'lucide-react';
import TemplateShowcase from './template-showcase';
import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onStart: () => void;
  onSelectTemplate?: (template: Template) => void;
}

export default function LandingPage({ onStart, onSelectTemplate }: LandingPageProps) {
  const [showGallery, setShowGallery] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-slate-900 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-6.5 h-6.5 bg-slate-900 rounded flex items-center justify-center text-white font-black text-xs italic shadow-sm">
              EP
            </div>
            <span className="text-xs font-black tracking-tight text-slate-900 uppercase">Email.Pro</span>
          </div>
          
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <button onClick={() => setShowGallery(true)} className="hover:text-slate-900 transition-colors">Bases Catalog</button>
            <a href="#capabilities" className="hover:text-slate-900 transition-colors">Toolbox Capabilities</a>
          </div>

          <div>
            <Button onClick={onStart} className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 h-8 text-[10px] font-bold uppercase tracking-wider">
              Launch Workspace
              <ArrowRight className="w-3 h-3 ml-1.5" />
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Honest Minimal Hero Section */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-full shadow-sm text-slate-500 text-[9px] font-bold uppercase tracking-widest mx-auto">
              <Zap className="w-3 h-3 text-slate-800 fill-slate-800" />
              Offline Developer Sandbox
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-2xl mx-auto">
              Local React Email Playground.<br />
              <span className="text-slate-400 font-bold">Build, audit, and export.</span>
            </h1>
            
            <p className="max-w-lg mx-auto text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
              An offline design sandbox for building responsive email templates. Choose a blueprint, live edit in the Monaco workspace, check Gmail clipping limits, and export compiled HTML instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button onClick={onStart} className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Open Local Workspace
              </Button>
              <Button variant="outline" onClick={() => setShowGallery(true)} className="h-10 px-6 rounded-lg text-[10px] font-bold uppercase tracking-wider border-slate-200 hover:bg-slate-50">
                Browse Presets catalog
              </Button>
            </div>
          </div>
        </section>

        {/* Real Product Capabilities Grid */}
        <section id="capabilities" className="py-16 px-6 bg-white border-y border-slate-200/80">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="max-w-xl mx-auto text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Real Sandbox Capabilities</h2>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">A transparent breakdown of what the application does</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Cap 1 */}
              <div className="p-6 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col space-y-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Monaco Editor Workspace</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Write templates in React (TypeScript/JavaScript) or plain HTML. Includes real-time syntax checking, auto-formatting, and autocomplete.
                  </p>
                </div>
              </div>

              {/* Cap 2 */}
              <div className="p-6 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col space-y-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">8 Preset Blueprints</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Quick-start from pre-built, responsive templates optimized for onboarding, transactional invoices, and security alerts.
                  </p>
                </div>
              </div>

              {/* Cap 3 */}
              <div className="p-6 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col space-y-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Responsive Preview</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Audit template responsive formatting with standard mobile, tablet, desktop, or custom-resizable preview iframe containers.
                  </p>
                </div>
              </div>

              {/* Cap 4 */}
              <div className="p-6 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col space-y-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Gmail Size Alert Heuristics</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Calculates the exact raw HTML character bundle size in real-time, warning you before exceeding Gmail's 102KB clipping limit.
                  </p>
                </div>
              </div>

              {/* Cap 5 */}
              <div className="p-6 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col space-y-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Offline History Versions</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Maintains an history backup sidebar tracking your modifications locally. Saved entirely within your browser's local storage.
                  </p>
                </div>
              </div>

              {/* Cap 6 */}
              <div className="p-6 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col space-y-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Direct HTML Export</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    One-click copying of compiled, table-inlined HTML output or quick file download to use in any dispatch software (Resend, SES, Mailgun).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simplest Get Started CTA */}
        <section className="py-20 px-6 bg-slate-50/50">
          <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-5">
            <h3 className="font-black text-xl text-slate-900">Get Started Offline</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
              Email.Pro runs entirely on client-side JS inside your browser. No remote database connection required to start designing.
            </p>
            <Button onClick={onStart} className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 px-6 text-[10px] font-bold uppercase tracking-wider">
              Open Workspace
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200/80 py-12 px-6 text-center">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 bg-slate-900 rounded flex items-center justify-center text-white font-black text-xs italic shadow-sm">
              EP
            </div>
            <span className="text-xs font-black tracking-tight text-slate-900 uppercase">Email.Pro</span>
          </div>

          <div className="flex gap-6 text-[9px] font-bold uppercase tracking-wider text-slate-400">
            <button onClick={() => setShowGallery(true)} className="hover:text-slate-900 transition-colors">Bases Catalog</button>
            <a href="#capabilities" className="hover:text-slate-900 transition-colors">Capabilities</a>
          </div>

          <p className="text-[9px] text-slate-400 font-semibold tracking-wide">
            © 2026 Email.Pro Laboratories. Static offline workspace for email template designs.
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showGallery && (
          <TemplateShowcase 
            onClose={() => setShowGallery(false)}
            onSelect={(template) => {
              if (onSelectTemplate) onSelectTemplate(template);
              setShowGallery(false);
              onStart();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
