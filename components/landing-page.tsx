'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight,
  Mail,
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
    <div className="min-h-screen bg-alabaster-grey-50 text-ink-black-900 selection:bg-ink-black-900 selection:text-white overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-ink-black-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-ink-black-900 rounded-lg flex items-center justify-center shadow-lg shadow-ink-black-900/10">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-ink-black-900">Email.Studio</span>
          </div>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setShowGallery(true)}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-black-400 hover:text-ink-black-900 transition-colors"
            >
              Templates
            </button>
            <Button onClick={onStart} size="sm">
              Open Editor
            </Button>
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
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-alabaster-grey-100 border border-ink-black-100 text-ink-black-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-sm">
                Code-First Design Environment
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-bold tracking-tight text-ink-black-900 mb-10 leading-[0.95]"
            >
              Email engineering,<br />
              <span className="text-pale-sky-400">simplified.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-lg md:text-xl text-ink-black-600 mb-14 leading-relaxed font-medium"
            >
              Craft responsive, React-powered email templates with real-time technical audits and production-ready exports.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button onClick={onStart} size="lg" className="px-12 group">
                Start Building 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Minimal Feature Grid */}
        <section className="py-24 border-y border-ink-black-100 bg-alabaster-grey-100/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12 lg:gap-24">
              {[
                { title: "React Components", desc: "Build modular templates using standard React components and compositional logic." },
                { title: "Real-time Preview", desc: "View changes instantly as you type with our high-performance rendering engine." },
                { title: "Technical Audit", desc: "Automatic optimization for production deliverability across all major mail clients." }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col gap-5">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-black-900">{feature.title}</h3>
                  <div className="h-0.5 w-10 bg-ink-black-900/10 mb-1" />
                  <p className="text-sm font-medium text-ink-black-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 px-6 bg-alabaster-grey-50 border-t border-ink-black-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-ink-black-400">
          <div className="flex items-center gap-8">
            <span className="text-ink-black-900">© 2026 Email.Studio</span>
            <a href="#" className="hover:text-ink-black-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-ink-black-900 transition-colors">Terms</a>
          </div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-ink-black-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-ink-black-900 transition-colors">GitHub</a>
            <a href="#" className="hover:text-ink-black-900 transition-colors">Discord</a>
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
