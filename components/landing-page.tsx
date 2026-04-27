'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Code2, 
  Zap, 
  ShieldCheck, 
  Layers,
  ArrowRight,
  Mail,
  ExternalLink,
  Command,
  ChevronRight,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TemplateShowcase from './template-showcase';
import { TEMPLATES } from '@/lib/templates';
import { Template } from '@/lib/types';

interface LandingPageProps {
  onStart: () => void;
  onSelectTemplate?: (template: Template) => void;
}

export default function LandingPage({ onStart, onSelectTemplate }: LandingPageProps) {
  const [showGallery, setShowGallery] = React.useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-900 selection:text-white overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <Mail className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Email.Studio</span>
          </div>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setShowGallery(true)}
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
            >
              Templates
            </button>
            <button 
              onClick={onStart}
              className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
            >
              Open Editor
            </button>
          </div>
        </div>
      </nav>

      <main className="relative pt-32">
        {/* Simple Hero Section */}
        <section className="px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">
                Code-First Design
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.05]"
            >
              Email engineering,<br />
              <span className="text-slate-300">simplified.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-lg text-slate-500 mb-12 leading-relaxed"
            >
              Craft responsive, React-powered email templates with real-time feedback and production-ready exports.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button 
                onClick={onStart}
                className="group h-14 px-10 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 shadow-lg active:scale-95"
              >
                Start Building <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Minimal Feature Grid */}
        <section className="py-24 border-y border-slate-100 bg-slate-50/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12 lg:gap-24">
              {[
                { title: "React Components", desc: "Build modular templates using standard React components and compositional logic." },
                { title: "Real-time Preview", desc: "View changes instantly as you type with our high-performance rendering engine." },
                { title: "Reliability", desc: "Automatic optimization for production deliverability across 50+ mail clients." }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">{feature.title}</h3>
                  <div className="h-0.5 w-8 bg-slate-900 mb-2" />
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-6">
            <span className="text-slate-900">© 2026 Email.Studio</span>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Discord</a>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <AnimatePresence>
        {showGallery && (
          <TemplateShowcase 
            onClose={() => setShowGallery(false)}
            onSelect={(template) => {
              if (onSelectTemplate) {
                onSelectTemplate(template);
              }
              setShowGallery(false);
              onStart();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
