'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Check,
  Code2,
  ExternalLink,
  Github,
  Key,
  Lock,
  Mail,
  Menu,
  X,
  Sparkles,
  Smartphone,
  Laptop,
  ShieldCheck,
  Cpu,
  Layers,
  FileCode2,
  ChevronRight,
  Terminal
} from 'lucide-react';

import TemplateShowcase, { OFFICIAL_REACT_EMAIL_METRICS } from './template-showcase';
import { Template } from '@/lib/types';
import { TEMPLATES } from '@/lib/templates';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface LandingPageProps {
  onStart: () => void;
  onSelectTemplate?: (template: Template) => void;
}

export default function LandingPage({
  onStart,
  onSelectTemplate,
}: LandingPageProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [templateCategory, setTemplateCategory] = useState<'All' | 'Transactional' | 'Marketing' | 'System'>('All');
  const [heroPreviewMode, setHeroPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // BYOK Key Management State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('email_pro_gemini_api_key');
      if (savedKey) setUserApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      if (userApiKey.trim()) {
        localStorage.setItem('email_pro_gemini_api_key', userApiKey.trim());
      } else {
        localStorage.removeItem('email_pro_gemini_api_key');
      }
      setKeySaved(true);
      setTimeout(() => {
        setKeySaved(false);
        setShowKeyModal(false);
      }, 900);
    }
  };

  const handleSelectAndStart = (templateId: string) => {
    const tmpl = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
    onSelectTemplate?.(tmpl);
    onStart();
  };

  // Filter canonical templates
  const filteredTemplates = TEMPLATES.filter((t) => {
    if (templateCategory === 'All') return true;
    return t.folder === templateCategory;
  });

  return (
    <div className="min-h-screen bg-app text-fg font-sans antialiased selection:bg-accent selection:text-white overflow-x-hidden">
      
      {/* 1. NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-app/90 backdrop-blur-md border-b border-border-base px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              aria-label="Email.Pro Home"
            >
              
              <span className="font-black text-xl tracking-tight text-fg">
                Email<span className="text-emerald-500">.Pro</span>
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-fg-muted">
              <a href="#features" className="hover:text-fg transition-colors">Capabilities</a>
              <a href="#templates" className="hover:text-fg transition-colors">Templates</a>
              <a href="#architecture" className="hover:text-fg transition-colors">Architecture</a>
              <a href="#deliverability" className="hover:text-fg transition-colors">Deliverability</a>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                userApiKey
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-surface-raised hover:bg-surface-hover border-border-base text-fg-secondary'
              }`}
              title="Configure your Google Gemini API Key"
            >
              <Key className={`w-3.5 h-3.5 ${userApiKey ? 'text-emerald-400' : 'text-fg-muted'}`} />
              <span>{userApiKey ? 'Gemini Key Active' : 'Gemini BYOK'}</span>
            </button>

            <button
              onClick={() => setShowGallery(true)}
              className="px-3.5 py-2 rounded-full border border-border-base bg-surface hover:bg-surface-hover text-fg-secondary hover:text-fg text-xs font-bold transition-all cursor-pointer"
            >
              Blueprints
            </button>

            <ThemeToggle />

            <button
              onClick={onStart}
              className="bg-accent hover:bg-accent-hover text-accent-fg text-xs font-bold px-4.5 py-2 rounded-full flex items-center gap-2 transition-all shadow-md shadow-accent/20 cursor-pointer active:scale-95"
            >
              <span>Launch Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-fg-secondary hover:bg-surface-hover rounded-lg border border-border-base"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-border-base mt-3 space-y-3 px-2">
            <nav className="space-y-2 text-sm font-semibold text-fg-secondary">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-surface-hover"
              >
                Capabilities
              </a>
              <a 
                href="#templates" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-surface-hover"
              >
                Templates
              </a>
              <a 
                href="#architecture" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-surface-hover"
              >
                Architecture
              </a>
            </nav>
            <div className="pt-2 border-t border-border-base space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowKeyModal(true);
                }}
                className="w-full bg-surface-raised text-fg-secondary font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-border-base"
              >
                <Key className="w-4 h-4 text-emerald-400" />
                <span>{userApiKey ? 'Gemini Key Configured' : 'Configure Gemini Key'}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStart();
                }}
                className="w-full bg-accent hover:bg-accent-hover text-accent-fg font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-accent/30"
              >
                <span>Launch Editor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-10 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Product Positioning & Action */}
          <div className="lg:col-span-6 space-y-6">
            

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-fg leading-[1.05]">
              React component to pixel-perfect email in real time.
            </h1>

            <p className="text-sm sm:text-base text-fg-muted leading-relaxed max-w-xl font-normal">
              A high-fidelity design environment for React-powered email templates. Experience sub-50ms sandboxed live rendering, automated CSS inlining, and Google Gemini AI assistance.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onStart}
                className="bg-accent hover:bg-accent-hover text-accent-fg text-sm font-bold px-7 py-3.5 rounded-full inline-flex items-center justify-center gap-2.5 shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Open Editor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#templates"
                className="bg-surface hover:bg-surface-hover text-fg-secondary hover:text-fg border border-border-base text-sm font-semibold px-6 py-3.5 rounded-full inline-flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
              >
                <span>Explore Blueprints</span>
                <ChevronRight className="w-4 h-4 text-fg-muted" />
              </a>
            </div>

            {/* Assurance Badges */}
            <div className="pt-4 border-t border-border-base flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-fg-muted">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero build config</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Gmail 102KB safe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Outlook table inliner</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Product / Editor Viewport Mockup */}
          <div className="lg:col-span-6">
            <div className="bg-surface rounded-2xl border border-border-base shadow-2xl overflow-hidden">
              
              {/* Window Title Bar */}
              <div className="h-10 bg-surface-raised border-b border-border-base px-4 flex items-center justify-between text-xs text-fg-muted">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  <span className="font-mono text-[11px] text-fg-secondary ml-2">welcome.tsx</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ✓ Rendered 18ms
                  </span>
                  <div className="flex bg-surface border border-border-base rounded-lg p-0.5">
                    <button
                      onClick={() => setHeroPreviewMode('desktop')}
                      className={`p-1 rounded ${heroPreviewMode === 'desktop' ? 'bg-surface-elevated text-fg' : 'text-fg-muted'}`}
                      title="Desktop View"
                      aria-label="Desktop preview mode"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setHeroPreviewMode('mobile')}
                      className={`p-1 rounded ${heroPreviewMode === 'mobile' ? 'bg-surface-elevated text-fg' : 'text-fg-muted'}`}
                      title="Mobile View"
                      aria-label="Mobile preview mode"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Split-Screen Code & Preview Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-base min-h-[340px]">
                
                {/* Left Pane: Code Editor Snippet */}
                <div className="p-4 bg-app font-mono text-[11px] leading-relaxed text-fg-secondary overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="text-fg-muted text-[10px] mb-2">
                      <span>&#47;&#47; React Email Component</span>
                    </div>
                    <div><span className="text-purple-400">import</span> &#123; <span className="text-blue-300">Html, Container, Text, Button</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;@react-email/components&apos;</span>;</div>
                    <br />
                    <div><span className="text-purple-400">export default function</span> <span className="text-amber-300">WelcomeEmail</span>() &#123;</div>
                    <div className="pl-3"><span className="text-purple-400">return</span> (</div>
                    <div className="pl-6 text-fg-muted">&lt;<span className="text-accent">Container</span> <span className="text-cyan-300">className</span>=<span className="text-emerald-300">&quot;p-6 max-w-lg&quot;</span>&gt;</div>
                    <div className="pl-9 text-fg-muted">&lt;<span className="text-accent">Text</span> <span className="text-cyan-300">className</span>=<span className="text-emerald-300">&quot;text-xl font-bold&quot;</span>&gt;</div>
                    <div className="pl-12 text-fg">Welcome aboard! 👋</div>
                    <div className="pl-9 text-fg-muted">&lt;/<span className="text-accent">Text</span>&gt;</div>
                    <div className="pl-9 text-fg-muted">&lt;<span className="text-accent">Button</span> <span className="text-cyan-300">href</span>=<span className="text-emerald-300">&quot;/onboarding&quot;</span>&gt;</div>
                    <div className="pl-12 text-fg">Get Started</div>
                    <div className="pl-9 text-fg-muted">&lt;/<span className="text-accent">Button</span>&gt;</div>
                    <div className="pl-6 text-fg-muted">&lt;/<span className="text-accent">Container</span>&gt;</div>
                    <div className="pl-3">);</div>
                    <div>&#125;</div>
                  </div>

                  <div className="pt-3 border-t border-border-base flex items-center justify-between text-[10px] text-fg-muted">
                    <span>TypeScript 5.9</span>
                    <span>UTF-8</span>
                  </div>
                </div>

                {/* Right Pane: Sandboxed Email Preview */}
                <div className="p-4 bg-surface-raised flex items-center justify-center overflow-hidden">
                  <div 
                    className={`bg-white text-neutral-900 rounded-xl p-5 shadow-lg transition-all duration-300 flex flex-col justify-between ${
                      heroPreviewMode === 'desktop' ? 'w-full max-w-sm' : 'w-56'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <div className="flex items-center gap-1.5">
                          
                          <span className="text-xs font-black tracking-tight text-neutral-900">Email.Pro</span>
                        </div>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">Onboarding</span>
                      </div>

                      <div className="space-y-1 text-center pt-2">
                        <h4 className="text-sm font-extrabold text-neutral-900">Welcome aboard! 👋</h4>
                        <p className="text-[11px] text-neutral-500 leading-snug">
                          Your developer workspace is ready. Start building responsive email templates in minutes.
                        </p>
                      </div>

                      <div className="pt-2 text-center">
                        <button
                          onClick={onStart}
                          className="bg-accent text-white text-[11px] font-bold px-4 py-2 rounded-lg shadow-sm w-full cursor-pointer hover:bg-accent-hover transition-colors"
                        >
                          Launch Workspace
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 text-center text-[9px] text-neutral-400">
                      Payload: 24.6 KB (Gmail Safe)
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. CORE CAPABILITIES (Reduced Clutter, Focused Pillars) */}
      <section id="features" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-border-base">
        <div className="space-y-3 mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Product Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-fg">
            Built for modern email engineering
          </h2>
          <p className="text-xs sm:text-sm text-fg-muted leading-relaxed font-normal">
            Everything required to write, preview, test, and ship responsive HTML emails without tedious manual table slicing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: React Email Architecture */}
          <div className="bg-surface border border-border-base rounded-2xl p-6 flex flex-col justify-between hover:border-accent/40 transition-colors shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-accent-muted border border-accent-border flex items-center justify-center text-accent">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-fg tracking-tight">
                React Email &amp; JSX
              </h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                Compose clean, modular layouts with standard React components. Full TypeScript autocomplete, props validation, and zero context switching.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-base text-[11px] font-mono text-accent font-semibold">
              React 19 + TypeScript
            </div>
          </div>

          {/* Card 2: Isolated Real-time Renderer */}
          <div className="bg-surface border border-border-base rounded-2xl p-6 flex flex-col justify-between hover:border-success/40 transition-colors shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-success-bg border border-success-border flex items-center justify-center text-success">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-fg tracking-tight">
                Sandboxed Live Rendering
              </h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                Render previews in secure, disposable workers with 400ms debounce. Instant visual feedback without page reloads or UI stuttering.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-base text-[11px] font-mono text-success font-semibold">
              &lt; 50ms Render Latency
            </div>
          </div>

          {/* Card 3: Deliverability & Gmail Guard */}
          <div className="bg-surface border border-border-base rounded-2xl p-6 flex flex-col justify-between hover:border-warning/40 transition-colors shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-warning-bg border border-warning-border flex items-center justify-center text-warning">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-fg tracking-tight">
                Gmail 102KB Guard
              </h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                Real-time payload monitoring detects when compiled code approaches Gmail&apos;s strict 102KB clipping ceiling, keeping emails intact.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-base text-[11px] font-mono text-warning font-semibold">
              Live Payload Auditor
            </div>
          </div>

          {/* Card 4: Gemini AI Copilot */}
          <div className="bg-surface border border-border-base rounded-2xl p-6 flex flex-col justify-between hover:border-accent/40 transition-colors shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-accent-muted border border-accent-border flex items-center justify-center text-accent">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-fg tracking-tight">
                Gemini 3.5 AI Copilot
              </h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                Generate high-converting copy, structural variations, and subject lines on demand. Bring your own Gemini API key with zero rate limits.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-base text-[11px] font-mono text-accent font-semibold">
              BYOK Client Storage
            </div>
          </div>

        </div>
      </section>

      {/* 4. TEMPLATE DISCOVERY SECTION */}
      <section id="templates" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-border-base">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent bg-accent-muted border border-accent-border px-3 py-1 rounded-full">
              Canonical Blueprints
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-fg">
              Start with tested email blueprints
            </h2>
            <p className="text-xs sm:text-sm text-fg-muted max-w-xl font-normal">
              Pre-configured templates ready for customization. Click any card to launch immediately into the Monaco editor with full source code.
            </p>
          </div>

          {/* Category Filter Pills & Open Gallery Button */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Transactional', 'Marketing', 'System'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setTemplateCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  templateCategory === cat
                    ? 'bg-accent text-accent-fg shadow-sm'
                    : 'bg-surface text-fg-secondary hover:text-fg border border-border-base'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setShowGallery(true)}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-accent hover:text-accent-hover border border-accent-border hover:bg-accent-muted transition-all cursor-pointer ml-1"
            >
              Browse All ({TEMPLATES.length}) →
            </button>
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.slice(0, 6).map((template) => {
            const meta = OFFICIAL_REACT_EMAIL_METRICS[template.id] || {
              name: template.name,
              category: 'Curated' as const,
              readTime: '1m read',
              type: 'official' as const,
              sizeEstimate: '32 KB',
              complexity: 'Simple' as const,
              description: 'Curated production email blueprint.'
            };

            return (
              <div
                key={template.id}
                onClick={() => handleSelectAndStart(template.id)}
                className="bg-surface border border-border-base hover:border-accent/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer group hover:scale-[1.01] shadow-sm"
              >
                <div className="space-y-4">
                  {/* Top Header inside card */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-fg-muted bg-surface-raised border border-border-base px-2 py-0.5 rounded">
                      {template.language === 'html' ? 'HTML' : 'React JSX'}
                    </span>
                    <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider">
                      {template.folder}
                    </span>
                  </div>

                  {/* Title and description */}
                  <div>
                    <h3 className="text-base font-bold text-fg group-hover:text-accent transition-colors">
                      {meta.name}
                    </h3>
                    <p className="text-xs text-fg-muted mt-1.5 line-clamp-2 leading-relaxed">
                      {meta.description}
                    </p>
                  </div>

                  {/* Visual Layout Mock Frame */}
                  <div className="h-28 bg-surface-raised rounded-xl border border-border-base p-3 flex flex-col justify-between overflow-hidden group-hover:border-border-strong transition-colors">
                    <div className="flex items-center justify-between border-b border-border-base pb-1.5">
                      <div className="h-2 w-16 bg-border-strong rounded" />
                      <div className="h-2 w-8 bg-border-base rounded" />
                    </div>
                    <div className="space-y-1.5 py-1">
                      <div className="h-2.5 w-3/4 bg-border-strong rounded" />
                      <div className="h-2 w-full bg-border-base rounded" />
                    </div>
                    <div className="flex justify-end">
                      <div className="h-5 w-20 bg-accent rounded" />
                    </div>
                  </div>
                </div>

                {/* Footer action bar */}
                <div className="mt-5 pt-3.5 border-t border-border-base flex items-center justify-between text-xs">
                  <span className="text-fg-muted font-mono text-[11px]">{meta.sizeEstimate}</span>
                  <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    <span>Open in Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ARCHITECTURE & DELIVERABILITY SECTION */}
      <section id="architecture" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-border-base">
        <div id="deliverability" className="space-y-3 mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Technical Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-fg">
            Universal ESP Compatibility
          </h2>
          <p className="text-xs sm:text-sm text-fg-muted leading-relaxed font-normal">
            Exported code compiles modern CSS into inline attributes and table structures recognized by all major inbox rendering engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-surface border border-border-base rounded-2xl p-6 space-y-3">
            <div className="text-accent font-mono text-xs font-bold uppercase">01 / Inlining</div>
            <h3 className="text-lg font-bold text-fg">Automated CSS Inlining</h3>
            <p className="text-xs text-fg-muted leading-relaxed">
              Converts CSS class declarations directly into inline style tags while preserving responsive media queries for modern mobile clients.
            </p>
          </div>

          <div className="bg-surface border border-border-base rounded-2xl p-6 space-y-3">
            <div className="text-success font-mono text-xs font-bold uppercase">02 / Outlook VML</div>
            <h3 className="text-lg font-bold text-fg">Fallback Outlook Tables</h3>
            <p className="text-xs text-fg-muted leading-relaxed">
              Injects conditional MSO comments and nested table wrappers so complex buttons, columns, and spacers display reliably in desktop Outlook.
            </p>
          </div>

          <div className="bg-surface border border-border-base rounded-2xl p-6 space-y-3">
            <div className="text-accent font-mono text-xs font-bold uppercase">03 / Privacy</div>
            <h3 className="text-lg font-bold text-fg">Zero Telemetry &amp; BYOK</h3>
            <p className="text-xs text-fg-muted leading-relaxed">
              Your template code and custom Gemini API keys are processed locally or through secure server endpoints without persistent tracking.
            </p>
          </div>

        </div>

        {/* ESP Compatibility Tag Row */}
        <div className="mt-10 p-4 bg-surface border border-border-base rounded-2xl flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-fg-muted uppercase">
          <span className="font-bold text-fg">Gmail</span>
          <span>•</span>
          <span className="font-bold text-fg">Apple Mail</span>
          <span>•</span>
          <span className="font-bold text-fg">Outlook</span>
          <span>•</span>
          <span className="font-bold text-fg">Resend</span>
          <span>•</span>
          <span className="font-bold text-fg">Klaviyo</span>
          <span>•</span>
          <span className="font-bold text-fg">SendGrid</span>
          <span>•</span>
          <span className="font-bold text-fg">Mailchimp</span>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-surface-raised border border-border-base rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-fg max-w-3xl mx-auto leading-tight">
            Ready to build production-ready emails?
          </h2>
          <p className="text-xs sm:text-sm text-fg-muted max-w-lg mx-auto leading-relaxed">
            Jump straight into the code editor or explore curated blueprints. No sign-up required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onStart}
              className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-accent-fg text-sm font-bold px-8 py-4 rounded-full inline-flex items-center justify-center gap-2.5 shadow-xl shadow-accent/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Launch Email.Pro Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowGallery(true)}
              className="w-full sm:w-auto bg-surface hover:bg-surface-hover text-fg-secondary hover:text-fg border border-border-base text-sm font-semibold px-6 py-4 rounded-full transition-all cursor-pointer"
            >
              Browse All Blueprints
            </button>
          </div>
        </div>
      </section>

      {/* 7. PROFESSIONAL FOOTER */}
      <footer className="bg-app border-t border-border-base pt-12 pb-8 px-4 sm:px-8 text-fg-muted text-xs">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Top Brand & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-border-base">
            <div className="flex items-center gap-2.5">
              
              <span className="font-black text-lg text-fg">Email<span className="text-emerald-500">.Pro</span></span>
              <span className="text-[11px] text-fg-muted ml-2 font-mono">v0.1.0</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-fg-secondary">
              <button
                onClick={() => setShowKeyModal(true)}
                className="hover:text-fg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-fg-muted" />
                <span>Configure Gemini Key</span>
              </button>
              <a
                href="https://github.com/dheeraj080/Email-Pro"
                target="_blank"
                rel="noreferrer"
                className="hover:text-fg transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <button
                onClick={onStart}
                className="bg-surface-raised hover:bg-surface-hover text-fg border border-border-base px-3.5 py-1.5 rounded-full font-bold transition-colors cursor-pointer"
              >
                Open Studio →
              </button>
            </div>
          </div>

          {/* Bottom Copyright and Status */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-fg-muted">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All Systems Operational • Isolated Sandboxed Workers Active</span>
            </div>
            <span>© 2026 Email.Pro. High-fidelity React email engineering.</span>
          </div>

        </div>
      </footer>

      {/* MODAL: BYOK GEMINI API KEY */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              className="bg-surface-elevated border border-border-base rounded-2xl p-6 w-full max-w-md shadow-2xl relative text-fg-secondary"
            >
              <button
                onClick={() => setShowKeyModal(false)}
                className="absolute right-4 top-4 text-fg-muted hover:text-fg p-1 rounded-lg transition-colors"
                aria-label="Close API Key Configuration Dialog"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-fg">Google Gemini API Key</h3>
                  <p className="text-[11px] text-fg-muted font-mono">Bring Your Own Key (BYOK)</p>
                </div>
              </div>

              <p className="text-xs text-fg-muted mb-4 leading-relaxed">
                Save your personal Gemini API key safely in your browser&apos;s localStorage for unlimited AI assistance inside the email editor.
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="password"
                    value={userApiKey}
                    onChange={(e) => setUserApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-surface-raised border border-border-base focus:border-accent rounded-xl px-3.5 py-2.5 text-xs text-fg outline-none pr-9 font-mono focus:ring-1 focus:ring-accent transition-all"
                  />
                  <Lock className="w-4 h-4 text-fg-muted absolute right-3 top-3" />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Get a Gemini API Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {userApiKey && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserApiKey('');
                        if (typeof window !== 'undefined') {
                          localStorage.removeItem('email_pro_gemini_api_key');
                        }
                      }}
                      className="text-danger hover:underline font-medium"
                    >
                      Clear Key
                    </button>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-hover text-fg-secondary text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveApiKey}
                    className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-fg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-accent/20 transition-all cursor-pointer"
                  >
                    {keySaved ? <Check className="w-4 h-4 text-emerald-300" /> : 'Save Key'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL BLUEPRINTS GALLERY MODAL (TemplateShowcase) */}
      <AnimatePresence>
        {showGallery && (
          <TemplateShowcase
            onSelect={(template) => {
              setShowGallery(false);
              onSelectTemplate?.(template);
              onStart();
            }}
            onClose={() => setShowGallery(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
