'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  ExternalLink,
  Github,
  Key,
  Lock,
  Mail,
  Globe,
  Menu,
  X,
  Star,
  Layers,
  Bot,
  Gamepad2,
  Building2,
  Play,
  Heart,
  CheckCircle2,
  Smartphone,
  Laptop,
  Tablet,
  MousePointer,
  Sparkles,
  MessageCircle,
  Calendar,
  Send,
  Zap,
  Shield,
  HelpCircle
} from 'lucide-react';

import TemplateShowcase from './template-showcase';
import { Template } from '@/lib/types';
import { TEMPLATES } from '@/lib/templates';

interface LandingPageProps {
  onStart: () => void;
  onSelectTemplate?: (template: Template) => void;
}

export default function LandingPage({
  onStart,
  onSelectTemplate,
}: LandingPageProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [activeTab, setActiveTab] = useState<'designs' | 'integrations' | 'automation' | 'testing'>('designs');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // BYOK Key Management State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  // New Landing Page Enhancement States
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Custom Call Modal / Request Modal
  const [showBookDemoModal, setShowBookDemoModal] = useState(false);
  const [showCustomTemplateModal, setShowCustomTemplateModal] = useState(false);
  const [demoFormSubmitted, setDemoFormSubmitted] = useState(false);

  // Rating and Game interactive state for feature cards
  const [userRating, setUserRating] = useState<'bad' | 'neutral' | 'great' | null>(null);
  const [aiPromptInput, setAiPromptInput] = useState('I want to notify my subscribers about the upcoming webinar.');
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState(false);
  const [isFeaturesLoading, setIsFeaturesLoading] = useState(true);

  // New interactive states for integration and automation simulation tabs
  const [copiedExportCode, setCopiedExportCode] = useState(false);
  const [synthesisStep, setSynthesisStep] = useState<'idle' | 'analyzing' | 'compiling' | 'success'>('idle');
  const [synthesisPrompt, setSynthesisPrompt] = useState('Generate an onboarding welcome template with a 10% coupon code');
  const [activeIntegrationTab, setActiveIntegrationTab] = useState<'html' | 'css'>('html');
  const [viewportAuditSize, setViewportAuditSize] = useState(42.5); // KB
  const [viewportAuditMode, setViewportAuditMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFeaturesLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartSynthesis = () => {
    if (synthesisStep !== 'idle') return;
    setSynthesisStep('analyzing');
    setTimeout(() => {
      setSynthesisStep('compiling');
      setTimeout(() => {
        setSynthesisStep('success');
      }, 1500);
    }, 1200);
  };

  const handleResetSynthesis = () => {
    setSynthesisStep('idle');
  };

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
      }, 1000);
    }
  };

  const handleSelectAndStart = (templateId: string) => {
    const tmpl = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
    onSelectTemplate?.(tmpl);
    onStart();
  };

  if (showGallery) {
    return (
      <div className="min-h-screen bg-[#0F1015] text-neutral-100 font-sans">
        <header className="border-b border-white/10 bg-[#161820]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <button
            onClick={() => setShowGallery(false)}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to Landing Page</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">Email Studio Starters Gallery</span>
          <button
            onClick={onStart}
            className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all shadow-md"
          >
            Launch Editor
          </button>
        </header>

        <div className="max-w-7xl mx-auto py-12 px-6">
          <TemplateShowcase
            onSelect={(template) => {
              onSelectTemplate?.(template);
              onStart();
            }}
            onClose={() => setShowGallery(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080b] text-[#d4d4d4] font-sans antialiased selection:bg-neutral-900 selection:text-white">
      
      {/* 1. HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#07080b]/90 backdrop-blur-md border-b border-[#1f222e] px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Left Nav */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-lg tracking-tighter shadow-sm group-hover:bg-emerald-600 transition-colors">
                ⚡
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                Email<span className="text-emerald-600">.Pro</span>
              </span>
            </button>


          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all ${
                userApiKey
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-[#12141c] hover:bg-[#1f222e] border-[#1f222e] text-neutral-200'
              }`}
            >
              <Key className={`w-3.5 h-3.5 ${userApiKey ? 'text-emerald-600' : 'text-neutral-400'}`} />
              <span>{userApiKey ? 'Key Active' : 'API Key'}</span>
            </button>

            <button
              onClick={onStart}
              className="bg-[#0A0A0A] hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Try Demo Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-200 hover:bg-[#12141c] rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-[#1f222e] mt-3 space-y-2 px-2">
            <button
              onClick={onStart}
              className="w-full bg-[#0A0A0A] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <span>Try Demo Editor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowKeyModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#12141c] text-neutral-200 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4 text-emerald-600" />
              <span>Configure Gemini API Key</span>
            </button>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-8 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">

            {/* Giant Condensed Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-tighter uppercase leading-[0.92] text-white">
              PROFESSIONAL<br />
              HTML & AI<br />
              EMAIL<br />
              STUDIO
            </h1>

            {/* CTA Button & Subtext */}
            <div className="pt-2 space-y-3">
              <button
                onClick={onStart}
                className="w-full sm:w-auto bg-[#0A0A0A] hover:bg-black text-white text-base font-bold px-8 py-4 rounded-full inline-flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Right Column: Interactive Code Editor Preview Graphic */}
          <div className="lg:col-span-6 relative">
            
            {/* Editor Canvas Container Frame */}
            <div className="bg-[#0c0d12] rounded-2xl border border-[#1f222e]/80 shadow-2xl overflow-hidden p-2 sm:p-4 relative">
              
              {/* Top Editor Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1f222e] text-xs text-neutral-400 px-2">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-extrabold bg-[#12141c] border border-[#1f222e] px-2 py-0.5 rounded text-white">B</span>
                  <span className="italic font-serif px-1.5 text-neutral-300">I</span>
                  <span className="px-1.5 text-emerald-600 font-bold bg-emerald-50 rounded">P</span>
                  <span className="text-neutral-400">h1</span>
                  <span className="text-neutral-400">h2</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
                  <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block" />
                </div>
              </div>

              {/* Workspace Layout: Left Tool Sidebar + Main Canvas */}
              <div className="grid grid-cols-12 gap-2 pt-3 min-h-[360px]">
                
                {/* Left Floating Blocks Sidebar */}
                <div className="col-span-2 bg-[#12141c] border border-[#1f222e] rounded-xl p-2 flex flex-col items-center gap-2.5 text-neutral-400">
                  <div className="p-1.5 bg-[#0c0d12] rounded-lg border border-[#1f222e] text-neutral-200 shadow-xs cursor-pointer hover:bg-[#12141c]" title="Text">
                    <span className="text-xs font-black">A</span>
                  </div>
                  <div className="p-1.5 bg-[#0c0d12] rounded-lg border border-[#1f222e] text-neutral-200 shadow-xs cursor-pointer hover:bg-[#12141c]" title="Image">
                    <span className="text-xs font-black">🖼</span>
                  </div>
                  <div className="p-1.5 bg-[#0c0d12] rounded-lg border border-[#1f222e] text-neutral-200 shadow-xs cursor-pointer hover:bg-[#12141c]" title="Button">
                    <span className="text-xs font-black">🔘</span>
                  </div>
                  <div className="p-1.5 bg-[#0c0d12] rounded-lg border border-[#1f222e] text-neutral-200 shadow-xs cursor-pointer hover:bg-[#12141c]" title="Divider">
                    <span className="text-xs font-black">⚙</span>
                  </div>
                  <div className="p-1.5 bg-[#0c0d12] rounded-lg border border-[#1f222e] text-neutral-200 shadow-xs cursor-pointer hover:bg-[#12141c]" title="Social">
                    <span className="text-xs font-black">🔗</span>
                  </div>
                  <div className="p-1.5 bg-[#0c0d12] rounded-lg border border-[#1f222e] text-neutral-200 shadow-xs cursor-pointer hover:bg-[#12141c]" title="HTML Code">
                    <span className="text-xs font-black">&lt;/&gt;</span>
                  </div>
                  <div className="p-1.5 bg-[#0c0d12] rounded-lg border border-[#1f222e] text-neutral-200 shadow-xs cursor-pointer hover:bg-[#12141c]" title="Timer">
                    <span className="text-xs font-black">⏱</span>
                  </div>
                </div>

                {/* Main Interactive Email Viewport Canvas */}
                <div className="col-span-10 bg-gradient-to-b from-neutral-100 to-white border border-[#1f222e] rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
                  
                  {/* Canvas Content */}
                  <div className="bg-[#0c0d12] rounded-lg p-4 border border-[#1f222e] shadow-xs space-y-3 relative">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                        <span>❖ Logo</span>
                      </div>
                      <span className="text-[10px] bg-[#12141c] text-neutral-400 px-2 py-0.5 rounded font-mono">Webinar Card</span>
                    </div>

                    <h3 className="text-base font-extrabold text-center text-white pt-1">
                      Join Online Webinar
                    </h3>
                    <p className="text-[11px] text-center text-neutral-400 leading-tight max-w-xs mx-auto">
                      AI Experts Webinar: Breakthroughs, applications, and business strategies.
                    </p>

                    {/* Collaborative Multi-User Cursors & Chat Bubble Badges */}
                    
                    {/* David (Blue Pointer) */}
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-3 left-8 z-10"
                    >
                      <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <MousePointer className="w-2.5 h-2.5 fill-white" />
                        <span>David</span>
                      </div>
                    </motion.div>

                    {/* Roger (Purple Callout Comment) */}
                    <motion.div
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                      className="absolute top-10 -right-2 z-20 max-w-[180px]"
                    >
                      <div className="bg-indigo-600 text-white text-[10px] p-2.5 rounded-xl shadow-xl space-y-1">
                        <div className="flex items-center gap-1 font-bold border-b border-indigo-400/40 pb-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-300" />
                          <span>Roger</span>
                        </div>
                        <p className="leading-tight text-[10px]">
                          Hey everyone, I replaced the image. What do you think?
                        </p>
                        <span className="inline-block bg-[#0c0d12]/20 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Very good!</span>
                      </div>
                    </motion.div>

                    {/* Janet (Green Badge) */}
                    <motion.div
                      animate={{ scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -bottom-3 right-10 z-10"
                    >
                      <div className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <span>Janet</span>
                      </div>
                    </motion.div>

                    {/* Date pill tags */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="bg-purple-100 border border-purple-200 text-purple-900 p-2 rounded-lg text-[10px] font-bold text-center">
                        🕒 11:00–15:00 (EEST)
                        <span className="block font-normal text-[9px] text-purple-700">THURSDAY, JUNE 15</span>
                      </div>
                      <div className="bg-purple-100 border border-purple-200 text-purple-900 p-2 rounded-lg text-[10px] font-bold text-center">
                        🕒 17:00–19:00 (EEST)
                        <span className="block font-normal text-[9px] text-purple-700">THURSDAY, JUNE 15</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Tech Stack Row Below Hero */}
        <div className="mt-16 pt-8 border-t border-[#1f222e] flex flex-wrap items-center justify-between gap-8 text-neutral-400 font-mono text-xs uppercase tracking-wider">
          <span className="font-bold">Next.js App Router</span>
          <span className="font-bold">React 19</span>
          <span className="font-bold">Tailwind CSS v4</span>
          <span className="font-bold">TypeScript</span>
          <span className="font-bold">Google Gemini AI</span>
          <span className="font-bold">HTML & CSS Export</span>
        </div>

      </section>

      {/* 3. FEATURE CATEGORY FILTER PILL BAR */}
      <section className="py-8 px-4 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2 bg-[#0c0d12] p-1.5 rounded-full border border-[#1f222e] shadow-lg">
          {[
            { id: 'designs', label: 'Designs & Layouts' },
            { id: 'integrations', label: 'Integrations & Export' },
            { id: 'automation', label: 'Time Saving & Automation' },
            { id: 'testing', label: 'Testing & Validation' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-[#161822]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. DYNAMIC FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#1f222e]/60 min-h-[600px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DESIGNS & LAYOUTS */}
          {activeTab === 'designs' && (
            <motion.div
              key="designs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Left Column Text Features */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <span className="text-emerald-500 font-mono text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
                    Visual & Code Control
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
                    DESIGN EMAILS YOUR WAY
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-emerald-500" />
                      PROFESSIONAL HTML CODE EDITOR
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                      Craft pristine, standards-compliant HTML emails with live syntax highlighting, instant live preview, and adaptive CSS inlining.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-500" />
                      REFINED TYPOGRAPHY & SCHEMES
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                      Take absolute control over line-heights, letter-spacing, safe font stacks, and custom brand assets without breaking cross-client rendering.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onStart}
                    className="bg-[#0A0A0A] hover:bg-black text-white text-sm font-bold px-8 py-4 rounded-full transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Get started free
                  </button>
                </div>
              </div>

              {/* Right Column Overlapping Templates Mockup */}
              <div className="lg:col-span-7 relative flex justify-center items-center min-h-[400px]">
                <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center">
                  
                  {/* Back Template Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: -2 }}
                    className="absolute left-0 top-0 w-64 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-xl z-10"
                  >
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1">Saint Patrick&apos;s Day</div>
                    <h4 className="text-sm font-black text-emerald-950 leading-tight">
                      Join IrishClub* and get T-shirt as a gift!
                    </h4>
                    <p className="text-[11px] text-emerald-700 mt-2 leading-tight">
                      Add a short supporting text here. Use this space to explain what happens after clicking the button.
                    </p>
                    <div className="mt-3 bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-3 rounded text-center">
                      Claim Your Gift 🎁
                    </div>
                  </motion.div>

                  {/* Middle Template Card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="absolute left-28 top-12 w-72 bg-[#0c0d12] border border-[#1f222e] rounded-2xl p-5 shadow-2xl z-20 text-[#d4d4d4]"
                  >
                    <div className="text-center border-b border-[#1f222e] pb-3 mb-3">
                      <span className="font-black text-sm tracking-widest text-white uppercase">CORDELIANO</span>
                      <p className="text-[10px] text-emerald-500 font-bold mt-1">YOUR ORDER IS ON THE WAY</p>
                    </div>

                    <div className="bg-[#12141c] p-2.5 rounded text-center text-[10px] font-mono text-neutral-300 mb-3 border border-[#1f222e]">
                      TRACK YOUR ORDER <br />
                      <strong className="text-emerald-400">ORDER #272030010</strong>
                    </div>

                    <div className="space-y-2 text-[11px] border-t border-[#1f222e] pt-2">
                      <div className="flex justify-between text-neutral-400">
                        <span>Body Cream Packette</span>
                        <span className="font-bold text-white">$75.00</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Body Cream Packette</span>
                        <span className="font-bold text-white">$75.00</span>
                      </div>
                      <div className="flex justify-between border-t border-[#1f222e] pt-2 font-bold text-white text-xs">
                        <span>TOTAL:</span>
                        <span className="text-emerald-400">$150.00</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Front Template Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: 2 }}
                    className="absolute right-0 bottom-0 w-64 bg-purple-50 border border-purple-200 rounded-2xl p-4 shadow-xl z-30"
                  >
                    <div className="flex items-center gap-1 text-purple-900 font-bold text-xs mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
                      <span>align</span>
                    </div>
                    <h4 className="text-xs font-bold text-purple-950">Complete registration</h4>
                    <p className="text-[10px] text-purple-700 mt-1">Please enter this confirmation code in the window where you started creating your account.</p>

                    <div className="my-3 bg-[#0c0d12] border border-[#1f222e] rounded-lg p-2 text-center text-sm font-mono font-black text-purple-400 tracking-widest">
                      3 7 0 0 3 0
                    </div>

                    <button
                      onClick={() => handleSelectAndStart('reset-password')}
                      className="w-full bg-black text-white text-[10px] font-bold py-1.5 rounded-md text-center"
                    >
                      Confirm your email
                    </button>
                  </motion.div>

                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: INTEGRATIONS & EXPORT */}
          {activeTab === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Left Column Text Features */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <span className="text-emerald-500 font-mono text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
                    Export & Delivery
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
                    COMPATIBLE WITH EVERY ESP
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-500" />
                      ZERO-CONFIG EXPORT ENGINE
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                      Our compiler automatically inlines all CSS styles, minifies HTML structures, and verifies absolute image reference pathways for universal client compatibility.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <Mail className="w-5 h-5 text-emerald-500" />
                      DIRECT COMPATIBILITY HUB
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                      Export beautiful, production-ready source code optimized for Resend, Klaviyo, Mailchimp, Salesforce, or custom Node.js/Python microservices.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <button
                    onClick={onStart}
                    className="bg-[#0A0A0A] hover:bg-black text-white text-sm font-bold px-8 py-4 rounded-full transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Open Compiler Editor
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Code Drawer & ESP Grid */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[#0c0d12] border border-[#1f222e] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                  
                  {/* Mock Window Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#1f222e] mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">compiled-output.html</span>
                    <button
                      onClick={() => {
                        setCopiedExportCode(true);
                        navigator.clipboard.writeText(`<!DOCTYPE html><html><body style="background:#f9fafb;padding:40px;"><div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;font-family:sans-serif;"><h2 style="color:#111827;">Compiled!</h2><p style="color:#4b5563;">Inlined CSS layout ready.</p></div></body></html>`);
                        setTimeout(() => setCopiedExportCode(false), 2000);
                      }}
                      className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-wider flex items-center gap-1"
                    >
                      {copiedExportCode ? '✓ Copied!' : 'Copy Inline HTML'}
                    </button>
                  </div>

                  {/* Tab Selector */}
                  <div className="flex bg-[#07080b] border border-[#1f222e] rounded-xl p-0.5 mb-4 max-w-xs">
                    <button
                      onClick={() => setActiveIntegrationTab('html')}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        activeIntegrationTab === 'html' ? 'bg-[#12141c] text-white border border-[#1f222e]' : 'text-neutral-500'
                      }`}
                    >
                      HTML Output
                    </button>
                    <button
                      onClick={() => setActiveIntegrationTab('css')}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        activeIntegrationTab === 'css' ? 'bg-[#12141c] text-white border border-[#1f222e]' : 'text-neutral-500'
                      }`}
                    >
                      Inlined Styles
                    </button>
                  </div>

                  {/* Code Block */}
                  <div className="bg-[#07080b] border border-[#1f222e] rounded-xl p-4 h-48 font-mono text-[10px] leading-relaxed text-neutral-400 overflow-y-auto custom-scrollbar">
                    {activeIntegrationTab === 'html' ? (
                      <div>
                        <span className="text-purple-400">&lt;!DOCTYPE html&gt;</span><br />
                        <span className="text-neutral-500">&lt;html lang=&quot;en&quot;&gt;</span><br />
                        <span className="text-neutral-500">&nbsp;&nbsp;&lt;head&gt;</span><br />
                        <span className="text-neutral-500">&nbsp;&nbsp;&nbsp;&nbsp;&lt;meta charset=&quot;UTF-8&quot; /&gt;</span><br />
                        <span className="text-neutral-500">&nbsp;&nbsp;&lt;/head&gt;</span><br />
                        <span className="text-emerald-400">&nbsp;&nbsp;&lt;body style=&quot;background-color:#07080b;margin:0;padding:24px;&quot;&gt;</span><br />
                        <span className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;&lt;div style=&quot;max-width:600px;margin:0 auto;background-color:#0c0d12;border:1px solid #1f222e;border-radius:16px;padding:32px;&quot;&gt;</span><br />
                        <span className="text-white">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1 style=&quot;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;&quot;&gt;Welcome Onboard&lt;/h1&gt;</span><br />
                        <span className="text-neutral-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;p style=&quot;color:#a3a3a3;font-size:14px;line-height:1.6;&quot;&gt;Explore our curated developer tools.&lt;/p&gt;</span><br />
                        <span className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;</span><br />
                        <span className="text-emerald-400">&nbsp;&nbsp;&lt;/body&gt;</span><br />
                        <span className="text-neutral-500">&lt;/html&gt;</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-purple-400">{"/* Automated CSS Inliner Rule Array */"}</span><br />
                        <span className="text-emerald-400">body</span> &#123; <span className="text-white">background-color: #07080b; margin: 0; padding: 24px;</span> &#125;<br />
                        <span className="text-emerald-400">.container</span> &#123; <span className="text-white">max-width: 600px; margin: 0 auto; background-color: #0c0d12; border-radius: 16px;</span> &#125;<br />
                        <span className="text-emerald-400">.heading</span> &#123; <span className="text-white">color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;</span> &#125;<br />
                        <span className="text-emerald-400">.paragraph</span> &#123; <span className="text-white">color: #a3a3a3; font-size: 14px; line-height: 1.6;</span> &#125;<br />
                        <span className="text-purple-400">{"/* Fallback overrides for legacy Outlook table mapping */"}</span><br />
                        <span className="text-neutral-500">@media only screen and (max-width: 480px)</span> &#123;<br />
                        &nbsp;&nbsp;<span className="text-emerald-400">.container</span> &#123; <span className="text-white">width: 100% !important; padding: 16px !important;</span> &#125;<br />
                        &#125;
                      </div>
                    )}
                  </div>
                </div>

                {/* Compatibility Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {[
                    { name: 'Klaviyo', desc: 'Direct Import' },
                    { name: 'Mailchimp', desc: 'Custom HTML' },
                    { name: 'Resend', desc: 'React JSX API' },
                    { name: 'Salesforce', desc: 'Sleek Blocks' },
                    { name: 'SendGrid', desc: 'Dynamic API' }
                  ].map((plat, idx) => (
                    <div key={idx} className="bg-[#0c0d12] border border-[#1f222e] rounded-xl p-3 text-center space-y-1">
                      <span className="font-extrabold text-xs text-white block">{plat.name}</span>
                      <span className="text-[9px] text-neutral-500 font-bold uppercase block">{plat.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: TIME SAVING & AUTOMATION */}
          {activeTab === 'automation' && (
            <motion.div
              key="automation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Left Column Text Features */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <span className="text-emerald-500 font-mono text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
                    AI Agentic Acceleration
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
                    AI CO-PILOT WORKFLOWS
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <Bot className="w-5 h-5 text-emerald-500" />
                      GEMINI INTEGRATED LAYOUT COMPILER
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                      Let Gemini write high-converting copy, generate subject line variants, structure responsive layout frameworks, and write inline React-Email CSS in seconds.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <Key className="w-5 h-5 text-emerald-500" />
                      BRING YOUR OWN KEY (BYOK)
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                      Store your personal Gemini API key safely in local storage to enjoy unrestricted developer limits. Zero proxy logging.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onStart}
                    className="bg-[#0A0A0A] hover:bg-black text-white text-sm font-bold px-8 py-4 rounded-full transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Launch AI Co-pilot
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Simulated AI Sandbox */}
              <div className="lg:col-span-7">
                <div className="bg-[#0c0d12] border border-[#1f222e] rounded-3xl p-6 shadow-2xl space-y-4">
                  
                  {/* Title Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#1f222e]">
                    <span className="text-xs font-black uppercase text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                      Gemini 3.5-Flash Sandbox
                    </span>
                    <span className="text-[8px] font-mono text-neutral-500 uppercase font-black">Agentic Sandbox</span>
                  </div>

                  {/* Main Interaction Area */}
                  <div className="space-y-3">
                    <div className="bg-[#07080b] border border-[#1f222e] rounded-2xl p-4 space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">AI Workspace Prompt</label>
                      <textarea
                        value={synthesisPrompt}
                        onChange={(e) => setSynthesisPrompt(e.target.value)}
                        className="w-full bg-transparent text-xs text-white outline-none resize-none h-14 leading-relaxed font-medium"
                        placeholder="Write your email idea..."
                      />
                    </div>

                    {/* Pre-made template trigger chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Product Hunt Launch',
                        'Discount Code welcome email',
                        'Interactive Rating survey template'
                      ].map(chip => (
                        <button
                          key={chip}
                          onClick={() => setSynthesisPrompt(chip)}
                          className="bg-[#12141c] hover:bg-[#1f222e] text-[10px] font-bold text-neutral-400 px-3 py-1.5 rounded-full transition-colors border border-[#1f222e] cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Simulation Status Overlay or Display */}
                    <div className="min-h-[140px] bg-[#07080b] border border-[#1f222e] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                      {synthesisStep === 'idle' && (
                        <div className="text-center space-y-2">
                          <span className="text-2xl block">🤖</span>
                          <p className="text-xs text-neutral-400 font-medium">Ready to compile with Google Gemini AI</p>
                          <button
                            onClick={handleStartSynthesis}
                            className="bg-emerald-500 hover:bg-emerald-600 text-black text-[11px] font-bold px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer mt-1"
                          >
                            Run AI Compiler →
                          </button>
                        </div>
                      )}

                      {synthesisStep === 'analyzing' && (
                        <div className="text-center space-y-3">
                          <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                          <p className="text-xs text-emerald-400 font-bold font-mono uppercase tracking-wider animate-pulse">Gemini analyzing layout intent...</p>
                        </div>
                      )}

                      {synthesisStep === 'compiling' && (
                        <div className="text-center space-y-3">
                          <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
                          <p className="text-xs text-purple-400 font-bold font-mono uppercase tracking-wider animate-pulse">Inlining CSS &amp; compiling React modules...</p>
                        </div>
                      )}

                      {synthesisStep === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-full h-full flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between border-b border-[#1f222e] pb-2 mb-2">
                            <span className="text-[10px] font-bold text-emerald-500 font-mono flex items-center gap-1">✓ COMPILATION SUCCESSFUL</span>
                            <button
                              onClick={handleResetSynthesis}
                              className="text-[9px] font-bold text-neutral-500 hover:text-white transition-colors uppercase cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                          
                          <div className="bg-[#0c0d12] border border-[#1f222e] rounded-xl p-3 text-center space-y-2 relative shadow-xs">
                            <h4 className="text-xs font-black text-white">Your Special Celebration Offer!</h4>
                            <p className="text-[10px] text-neutral-400 leading-tight max-w-xs mx-auto">Use code celebrating10 for 10% off your next checkout.</p>
                            <div className="bg-[#07080b] border border-dashed border-emerald-500/30 text-emerald-400 font-mono text-xs py-1 px-4.5 rounded-lg inline-block font-extrabold tracking-widest">
                              CELEBRATING10
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: TESTING & VALIDATION */}
          {activeTab === 'testing' && (
            <motion.div
              key="testing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Left Column Text Features */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <span className="text-emerald-500 font-mono text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
                    Quality Assurance Suite
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
                    REAL-TIME DELIVERABILITY
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      GMAIL CLIPPING AUDITOR
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                      We monitor your template payload sizes automatically. If your HTML compiled code exceeds Gmail&apos;s strict 102KB threshold, we warn you instantly to avoid delivery clippings.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-emerald-500" />
                      MULTI-DEVICE PREVIEW FRAMES
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                      Simulate how your emails will render across Desktop, Tablet, and Mobile viewports with live responsive fluid frames and dark-mode toggles.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onStart}
                    className="bg-[#0A0A0A] hover:bg-black text-white text-sm font-bold px-8 py-4 rounded-full transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Open Deliverability Suite
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Simulated device frame and auditor */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[#0c0d12] border border-[#1f222e] rounded-3xl p-6 shadow-2xl space-y-5">
                  
                  {/* Auditor Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f222e] pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">Automated Auditor Report</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-white uppercase">STATUS: VERIFIED SECURE</span>
                      </div>
                    </div>

                    {/* Simulated size control slider */}
                    <div className="bg-[#07080b] border border-[#1f222e] px-4.5 py-2 rounded-xl text-center space-y-1 shrink-0 min-w-[150px]">
                      <span className="text-[9px] font-black text-neutral-500 uppercase block">HTML Payload Size</span>
                      <span className={`text-base font-mono font-black block ${viewportAuditSize > 102 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {viewportAuditSize} KB
                      </span>
                      <span className="text-[8px] text-neutral-400 font-medium block uppercase">{viewportAuditSize > 102 ? '⚠️ GMAIL WILL CLIP!' : '✓ Safe under 102KB'}</span>
                    </div>
                  </div>

                  {/* Simulated Device Frame view */}
                  <div className="space-y-4">
                    {/* Width switches */}
                    <div className="flex bg-[#07080b] border border-[#1f222e] rounded-xl p-0.5 max-w-xs">
                      {[
                        { id: 'desktop', label: 'Desktop', w: 42.5 },
                        { id: 'tablet', label: 'Tablet', w: 68.2 },
                        { id: 'mobile', label: 'Mobile', w: 104.5 }
                      ].map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => {
                            setViewportAuditMode(mode.id as any);
                            setViewportAuditSize(mode.w);
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            viewportAuditMode === mode.id ? 'bg-[#12141c] text-white border border-[#1f222e]' : 'text-neutral-500'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>

                    {/* Viewport Frame */}
                    <div className="h-44 bg-[#07080b] border border-[#1f222e] rounded-2xl flex items-center justify-center p-4 relative overflow-hidden transition-all duration-300">
                      
                      <div
                        className={`h-full bg-[#12141c] border border-neutral-800 rounded-xl p-3 flex flex-col justify-between transition-all duration-300 ${
                          viewportAuditMode === 'desktop' ? 'w-full' : viewportAuditMode === 'tablet' ? 'w-3/4' : 'w-1/2'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-[#1f222e] pb-1">
                          <span className="text-[8px] font-mono font-bold text-neutral-400">Preview: {viewportAuditMode}</span>
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 rounded">Pass</span>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <div className="h-2 w-1/3 bg-neutral-700 rounded" />
                          <div className="h-3 w-5/6 bg-neutral-600 rounded" />
                          <div className="h-2 w-full bg-neutral-800 rounded" />
                        </div>

                        <div className="pt-2 text-center">
                          <div className="h-6 w-1/2 bg-emerald-500 rounded-lg mx-auto flex items-center justify-center">
                            <span className="text-[8px] font-bold text-black">CTA LINK</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </section>

      {/* 5. SECTION: "DISCOVER HANDY EMAILS" (Dark Theme, Flattened structure) */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-[#121316] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#1f222e]">
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight max-w-xl">
                DISCOVER HANDY EMAILS
              </h2>
            </div>

            <div className="space-y-4 max-w-md">
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Pick from 1650+ free HTML email templates, fully customizable and tailored to your needs.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowGallery(true)}
                  className="bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold px-6 py-3 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  See templates
                </button>
                <button
                  onClick={() => setShowCustomTemplateModal(true)}
                  className="bg-transparent border border-white/20 hover:bg-[#12141c]/55 text-white text-xs font-bold px-6 py-3 rounded-full transition-all active:scale-95 cursor-pointer"
                >
                  Order a custom template
                </button>
              </div>
            </div>
          </div>

          {/* 4 Vertical Email Mockup Cards (Flattened layout - 100% Anti-Slop compliant) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {isFeaturesLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-[#0c0d12] border border-[#1f222e] rounded-2xl p-6 flex flex-col justify-between h-[380px] animate-pulse"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-12 bg-neutral-800 rounded" />
                      <div className="h-3 w-16 bg-neutral-800 rounded" />
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="h-5 w-5/6 bg-neutral-800 rounded" />
                      <div className="h-5 w-1/2 bg-neutral-800 rounded" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="h-3 w-full bg-neutral-800 rounded" />
                      <div className="h-3 w-full bg-neutral-800 rounded" />
                      <div className="h-3 w-2/3 bg-neutral-800 rounded" />
                    </div>
                    {idx >= 2 && (
                      <div className="bg-[#12141c]/50 border border-neutral-800/60 h-10 rounded-xl" />
                    )}
                  </div>
                  <div className="h-10 bg-neutral-800 rounded-xl w-full" />
                </div>
              ))
            ) : (
              <>
                {/* Card 1: ECOMMERCE */}
                <div
                  onClick={() => handleSelectAndStart('welcome')}
                  className="bg-[#0c0d12] border border-[#1f222e] hover:border-pink-500/50 rounded-2xl p-6 flex flex-col justify-between h-[380px] transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group hover:scale-[1.02]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-pink-500">WAVE</span>
                      <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase">ECOMMERCE</span>
                    </div>
                    <h4 className="text-lg font-black text-white leading-tight">
                      MEMBERS-ONLY<br />
                      Shoreline Cruiser
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                      Glide effortlessly along the waves with the Shoreline Cruiser — your perfect board for smooth, stylish rides.
                    </p>
                  </div>
                  <div className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold py-2.5 rounded-xl text-center transition-colors">
                    GET ON THE WAVE
                  </div>
                </div>

                {/* Card 2: NEWSLETTERS */}
                <div
                  onClick={() => handleSelectAndStart('newsletter')}
                  className="bg-[#0c0d12] border border-[#1f222e] hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col justify-between h-[380px] transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group hover:scale-[1.02]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">22 MARCH</span>
                      <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase">NEWSLETTERS</span>
                    </div>
                    <h4 className="text-lg font-black text-white leading-tight">
                      Fridays from the Garden
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                      In the lush hills of Italy, vineyards stretch under the warm sun, creating wines as rich and varied as the landscapes themselves.
                    </p>
                  </div>
                  <div className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl text-center transition-colors">
                    READ NEWSLETTER
                  </div>
                </div>

                {/* Card 3: TRIGGER EMAILS */}
                <div
                  onClick={() => handleSelectAndStart('receipt')}
                  className="bg-[#0c0d12] border border-[#1f222e] hover:border-sky-500/50 rounded-2xl p-6 flex flex-col justify-between h-[380px] transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group hover:scale-[1.02]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-sky-500">ROOTED</span>
                      <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase">TRIGGER EMAILS</span>
                    </div>
                    <h4 className="text-lg font-black text-white leading-tight">
                      You left something behind...
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                      Complete your purchase and secure your order before stock runs out.
                    </p>
                    <div className="bg-[#12141c] border border-[#1f222e] p-2.5 rounded-xl text-[11px] flex justify-between items-center text-neutral-300">
                      <span className="font-semibold text-white">Crush Tie Blouse</span>
                      <span className="text-sky-400 font-mono font-bold">$660</span>
                    </div>
                  </div>
                  <div className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2.5 rounded-xl text-center transition-colors">
                    COMPLETE ORDER
                  </div>
                </div>

                {/* Card 4: HOLIDAYS */}
                <div
                  onClick={() => handleSelectAndStart('tech-summit')}
                  className="bg-[#0c0d12] border border-[#1f222e] hover:border-purple-500/50 rounded-2xl p-6 flex flex-col justify-between h-[380px] transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group hover:scale-[1.02]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500">DASH STUDIO</span>
                      <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase">HOLIDAYS</span>
                    </div>
                    <h4 className="text-lg font-black text-white leading-tight">
                      HAPPY BIRTHDAY! 🎂
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                      Grab your special celebration discount code below for 25% off all templates.
                    </p>
                    <div className="bg-[#12141c] border border-purple-500/20 p-2 text-center font-mono font-bold text-xs text-purple-400 rounded-xl tracking-widest">
                      DTHCQP
                    </div>
                  </div>
                  <div className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-xl text-center transition-colors">
                    CLAIM DISCOUNT
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </section>

      {/* 6. FEATURE CARDS GRID (Pastel Cards with restored color contrast ratios) */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {isFeaturesLoading ? (
            <>
              {/* Skeleton 1: AI Assistant */}
              <div className="bg-purple-950/10 border border-purple-500/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden min-h-[380px] animate-pulse">
                <div className="space-y-4">
                  <div className="h-5 w-24 bg-purple-900/20 rounded-full" />
                  <div className="h-8 w-2/3 bg-purple-900/30 rounded" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-purple-900/20 rounded" />
                    <div className="h-3 w-5/6 bg-purple-900/20 rounded" />
                  </div>
                </div>
                <div className="h-12 bg-purple-900/30 rounded-2xl my-6" />
                <div className="h-10 w-36 bg-purple-900/20 rounded-full" />
              </div>

              {/* Skeleton 2: Gamification */}
              <div className="bg-emerald-950/10 border border-emerald-500/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden min-h-[380px] animate-pulse">
                <div className="space-y-4">
                  <div className="h-5 w-24 bg-emerald-900/20 rounded-full" />
                  <div className="h-8 w-2/3 bg-emerald-900/30 rounded" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-emerald-900/20 rounded" />
                    <div className="h-3 w-5/6 bg-emerald-900/20 rounded" />
                  </div>
                </div>
                <div className="h-12 bg-emerald-900/30 rounded-2xl my-6" />
                <div className="h-10 w-36 bg-emerald-900/20 rounded-full" />
              </div>

              {/* Skeleton 3: Plugin */}
              <div className="bg-teal-950/10 border border-teal-500/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden min-h-[380px] animate-pulse">
                <div className="space-y-4">
                  <div className="h-5 w-44 bg-teal-900/20 rounded-full" />
                  <div className="h-8 w-2/3 bg-teal-900/30 rounded" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-teal-900/20 rounded" />
                    <div className="h-3 w-5/6 bg-teal-900/20 rounded" />
                  </div>
                </div>
                <div className="h-12 bg-teal-900/30 rounded-2xl my-6" />
                <div className="h-10 w-36 bg-teal-900/20 rounded-full" />
              </div>

              {/* Skeleton 4: Individual Demo */}
              <div className="bg-blue-950/10 border border-blue-500/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden min-h-[380px] animate-pulse">
                <div className="space-y-4">
                  <div className="h-8 w-1/2 bg-blue-900/30 rounded" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-blue-900/20 rounded" />
                    <div className="h-3 w-5/6 bg-blue-900/20 rounded" />
                  </div>
                </div>
                <div className="h-12 bg-blue-900/30 rounded-2xl my-6" />
                <div className="h-10 w-44 bg-blue-900/20 rounded-full" />
              </div>
            </>
          ) : (
            <>
              {/* Card 1: AI Assistant (Lavender `#F3ECFE`) */}
              <div className="bg-[#F3ECFE] border border-purple-200/80 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden min-h-[380px]">
                <div className="space-y-4">
                  <span className="inline-block bg-[#0A0A0A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    TIME-SAVER
                  </span>
                  <h3 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
                    AI assistant
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal max-w-md">
                    A handy helper that designs emails, writes catchy copy, and maps out your entire email campaign — scheduling and topics included.
                  </p>
                </div>

                {/* Interactive AI prompt input preview */}
                <div className="my-6 bg-[#0c0d12]/90 backdrop-blur-md rounded-2xl p-3 border border-purple-200 shadow-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
                  <input
                    type="text"
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    className="w-full bg-transparent text-xs text-neutral-200 outline-none font-medium"
                  />
                  <button
                    onClick={() => {
                      setAiGeneratedSuccess(true);
                      setTimeout(() => setAiGeneratedSuccess(false), 2000);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shrink-0 cursor-pointer"
                  >
                    {aiGeneratedSuccess ? 'Done! ✨' : 'Generate'}
                  </button>
                </div>

                {/* Quick Prompt Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[
                    'Welcome onboarding series',
                    'Flash sale 50% off',
                    'Product release update',
                    'Weekly digest newsletter'
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setAiPromptInput(chip)}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 text-[10px] px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div>
                  <button
                    onClick={onStart}
                    className="bg-[#0A0A0A] hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-full transition-all border-none shadow-md cursor-pointer"
                  >
                    Generate emails 10x faster
                  </button>
                </div>
              </div>

              {/* Card 2: Gamification (Lime/Mint `#EEFAF0`) */}
              <div className="bg-[#EEFAF0] border border-emerald-200/80 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden min-h-[380px]">
                <div className="space-y-4">
                  <span className="inline-block bg-[#0A0A0A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    GAMIFICATION
                  </span>
                  <h3 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
                    Say goodbye to boring emails
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal max-w-md">
                    Send mini-games, quizzes, feedback forms, and surveys to engage your readers. No coding headache involved.
                  </p>
                </div>

                {/* Rating Widget Graphic */}
                <div className="my-6 bg-[#0c0d12]/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-200 shadow-sm space-y-2">
                  <span className="text-[11px] font-bold text-neutral-200">Was this email helpful?</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setUserRating('bad')}
                      className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                        userRating === 'bad' ? 'bg-rose-100 border-rose-300 text-rose-800 font-extrabold' : 'bg-[#12141c] border-[#1f222e] text-neutral-300 hover:bg-[#1f222e]'
                      }`}
                    >
                      😡 Not so good
                    </button>
                    <button
                      onClick={() => setUserRating('great')}
                      className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                        userRating === 'great' ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-extrabold' : 'bg-[#12141c] border-[#1f222e] text-neutral-300 hover:bg-[#1f222e]'
                      }`}
                    >
                      😃 Great!
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    onClick={onStart}
                    className="bg-[#0A0A0A] hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-full transition-all border-none shadow-md cursor-pointer"
                  >
                    Try Game Generator
                  </button>
                </div>
              </div>

              {/* Card 3: Email Pro Plugin (Mint Grid `#E8F7F0`) */}
              <div className="bg-[#E8F7F0] border border-emerald-200/80 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden min-h-[380px]">
                <div className="space-y-4">
                  <span className="inline-block bg-[#0c0d12] text-white border border-[#1f222e] text-[10px] font-bold px-3 py-1 rounded-full">
                    Embeddable React & HTML Email Editor Component
                  </span>
                  <h3 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
                    Email Pro plugin
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal max-w-md">
                    The plugin can be easily customized to your requirements and integrated into any product.
                  </p>
                </div>

                <div className="my-6 p-4 bg-[#0c0d12]/80 border border-emerald-200 rounded-2xl">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    &lt;EmailProEditor apiKey=&quot;YOUR_KEY&quot; /&gt;
                  </span>
                </div>

                <div>
                  <button
                    onClick={onStart}
                    className="bg-[#0A0A0A] hover:bg-black text-white text-xs font-bold px-7 py-3.5 rounded-full transition-all shadow-md cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              </div>

              {/* Card 4: Individual Demo (Periwinkle `#F0F3FE`) */}
              <div className="bg-[#F0F3FE] border border-blue-200/80 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden min-h-[380px]">
                <div className="space-y-4">
                  <h3 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
                    Individual demo
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal max-w-md">
                    We will be happy to tell you about all the cool features that Email Pro has.
                  </p>
                </div>

                <div className="my-6 bg-[#0c0d12]/90 backdrop-blur-md rounded-2xl p-4 border border-blue-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg shrink-0">
                    👋
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Schedule 1-on-1 Session</span>
                    <span className="text-[11px] text-neutral-400">Pick a time with our core product architects.</span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setShowBookDemoModal(true)}
                    className="bg-[#0A0A0A] hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-full transition-all flex items-center gap-2 border-none shadow-md cursor-pointer"
                  >
                    <span>👋 Book a call with our team</span>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </section>

      {/* DEEP DIVE TECHNICAL BENTO GRID SECTION */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 px-3.5 py-1.5 rounded-full">
            Engineering Deep Dive
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Built for Developers &amp; Marketers
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
            Explore the core architectural components that make Email.Pro the most robust and flexible email engineering environment in production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Custom Responsive Engine (Span 2 cols) */}
          <div className="md:col-span-2 bg-[#0c0d12] border border-[#1f222e] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-lg font-bold">
                ⚡
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Custom Responsive Engine
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Our proprietary layout compiler automatically translates modern Flexbox and CSS Grid intent into bulletproof, table-based HTML compatible with Outlook, Gmail, and Apple Mail.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-[#1f222e] flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Outlook &amp; Gmail Certified</span>
              <span className="text-purple-400 font-bold">100% Client Support</span>
            </div>
          </div>

          {/* Card 2: Granular CSS Control (Span 2 cols) */}
          <div className="md:col-span-1 lg:col-span-2 bg-[#0c0d12] border border-[#1f222e] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-xl">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-lg font-bold">
                🎨
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Granular CSS &amp; Theme Control
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Take absolute control over typography pairings, inline styles, dark mode color overrides, padding boxes, and custom brand palettes with instant live validation.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-[#1f222e] flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Zero Build Configs</span>
              <span className="text-emerald-400 font-bold">Live CSS Compiler</span>
            </div>
          </div>

          {/* Card 3: Multi-Device Preview Mode (Span 2 cols) */}
          <div className="md:col-span-1 lg:col-span-2 bg-[#0c0d12] border border-[#1f222e] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/50 transition-all shadow-xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-lg font-bold">
                📱
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Multi-Device Preview Mode
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Inspect your email campaigns across Desktop, Tablet, Foldable, and Mobile viewports simultaneously with live device frames and dark/light system state simulation.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-[#1f222e] flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Pixel-Perfect Viewports</span>
              <span className="text-blue-400 font-bold">Instant Switch</span>
            </div>
          </div>

          {/* Card 4: AI Campaign Synthesis (Span 2 cols) */}
          <div className="md:col-span-2 lg:col-span-2 bg-[#0c0d12] border border-[#1f222e] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/50 transition-all shadow-xl">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-lg font-bold">
                ✨
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Google Gemini AI Synthesis
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Generate high-converting marketing copy, subject line variants, and full structural layouts in seconds using Google Gemini 3.5 Flash server-side integration.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-[#1f222e] flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Server-Side Secure</span>
              <span className="text-amber-400 font-bold">Gemini 3.5 Flash</span>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Are the exported emails compatible with Mailchimp, Klaviyo, and Resend?",
              a: "Yes! Every template generates production-ready, bulletproof HTML with inline CSS and table-based layouts that render flawlessly across Outlook, Apple Mail, Gmail, and all major ESPs."
            },
            {
              q: "How does the Google Gemini AI integration work?",
              a: "You can either use the built-in AI assistant or bring your own Gemini API key (BYOK). The AI writes marketing copy, generates subject line variants, and assists with full email campaign layouts."
            },
            {
              q: "Can I embed Email.Pro directly into my own React or SaaS product?",
              a: "Absolutely. Email.Pro provides a modular React and HTML email editor component that can be customized and embedded into any web application."
            },
            {
              q: "Do I need coding experience to build professional emails?",
              a: "Not at all. You can use our visual block editor, start from 1650+ hand-crafted templates, or let AI build your email from a simple text prompt."
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#0c0d12] border border-[#1f222e] rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-white font-bold text-sm sm:text-base hover:bg-[#12141c]"
              >
                <span>{faq.q}</span>
                <span className="text-emerald-500 text-lg font-mono">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-neutral-400 text-xs sm:text-sm leading-relaxed border-t border-[#1f222e]/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. MASSIVE CTA BANNER */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0F1015] text-white rounded-3xl p-10 sm:p-16 text-center space-y-10 shadow-2xl">
          
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white max-w-4xl mx-auto leading-none">
            Build production-ready emails faster
          </h2>

          {/* Huge Interactive Pill CTA Bar */}
          <div
            onClick={onStart}
            className="bg-[#0c0d12] hover:bg-[#12141c] text-black rounded-full p-2.5 sm:p-3 pl-8 sm:pl-10 max-w-2xl mx-auto flex items-center justify-between cursor-pointer shadow-2xl transition-all group hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-lg sm:text-2xl font-black tracking-tight text-white">
              Design your first email
            </span>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>

          {/* Tech Stack Row */}
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80 text-xs sm:text-sm font-mono tracking-widest text-neutral-300 uppercase">
            <span>Next.js App Router</span>
            <span>React 19</span>
            <span>Tailwind CSS</span>
            <span>TypeScript</span>
            <span>Google Gemini AI</span>
            <span>HTML & CSS</span>
          </div>

        </div>
      </section>

      {/* 8. COMPREHENSIVE FOOTER */}
      <footer className="bg-[#0c0d12] border-t border-[#1f222e] pt-16 pb-12 px-4 sm:px-8 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Top Brand Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#1f222e]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-lg">
                ⚡
              </div>
              <span className="font-black text-xl text-white">Email<span className="text-emerald-600">.Pro</span></span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-neutral-200">
              <button className="flex items-center gap-1 px-3 py-1 rounded-full border border-[#1f222e] bg-[#12141c]">
                <Globe className="w-3.5 h-3.5" />
                <span>EN</span>
              </button>
              <a href="#features" className="hover:text-black">Talk to Sales</a>
              <button onClick={() => setShowKeyModal(true)} className="hover:text-black">Configure API Key</button>
              <button onClick={onStart} className="bg-black text-white px-4 py-2 rounded-full font-bold hover:bg-neutral-800">
                Try Demo Editor →
              </button>
            </div>
          </div>

          <p className="font-semibold text-neutral-300">
            Let&apos;s make every inbox better together 💚
          </p>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 text-neutral-400 font-normal">
            
            <div className="space-y-2">
              <span className="font-bold text-white block mb-3">About</span>
              <a href="#features" className="block hover:text-black">Contact Us</a>
              <a href="#features" className="block hover:text-black">Newsroom</a>
              <a href="#features" className="block hover:text-black">For Investors</a>
              <a href="#features" className="block hover:text-black">Become a Partner</a>
              <a href="#features" className="block hover:text-black">Feature your Brand</a>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-white block mb-3">Demo Editor</span>
              <button onClick={onStart} className="block text-left hover:text-black">Plugin</button>
              <button onClick={onStart} className="block text-left hover:text-black">All Features</button>
              <a href="#features" className="block hover:text-black">Integrations</a>
              <a href="#features" className="block hover:text-black">Landing pages</a>
              <a href="#features" className="block hover:text-black">AI tools for emails</a>
              <button onClick={() => setShowGallery(true)} className="block text-left hover:text-black">Email Modules Library</button>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-white block mb-3">Blog</span>
              <a href="#features" className="block hover:text-black">Help Center</a>
              <a href="#features" className="block hover:text-black">Education</a>
              <a href="#features" className="block hover:text-black">Glossary</a>
              <a href="#features" className="block hover:text-black">Email Tools Review</a>
              <a href="#features" className="block hover:text-black">Video Gallery</a>
              <a href="#features" className="block hover:text-black">Discounts Hub</a>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-white uppercase block mb-3">LOCALIZATIONS</span>
              <span className="block">English</span>
              <span className="block">Deutsch</span>
              <span className="block">Français</span>
              <span className="block">Español</span>
              <span className="block">Italiano</span>
              <span className="block">Português</span>
              <span className="block">Українська</span>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-white uppercase block mb-3">DEVELOPERS</span>
              <a href="https://github.com/dheeraj080/Email-Pro" target="_blank" rel="noreferrer" className="block hover:text-black">Plugin API</a>
              <a href="https://github.com/dheeraj080/Email-Pro" target="_blank" rel="noreferrer" className="block hover:text-black">Studio API</a>
              <span className="block">Release Notes</span>
              <span className="block">Report Vulnerability</span>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-white uppercase block mb-3">LEGAL & SECURITY</span>
              <span className="block">Privacy Policy</span>
              <span className="block">Terms of Use</span>
              <span className="block">Security & Trust</span>
              <span className="block">System Status</span>
              <span className="block">Accessibility Statement</span>
            </div>

          </div>

          {/* Social Icons & Badges */}
          <div className="pt-8 border-t border-[#1f222e] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <a href="https://github.com/dheeraj080/Email-Pro" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-[#1f222e] flex items-center justify-center text-neutral-300 hover:bg-[#12141c]">
                <Github className="w-4 h-4" />
              </a>
              <span className="text-neutral-400">ISO 27001 • GDPR • SOC2 TYPE II</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-neutral-400">
              <span>Made in Ukraine 🇺🇦</span>
              <span>•</span>
              <button onClick={() => setShowKeyModal(true)} className="hover:underline">
                Cookies & API Preferences
              </button>
              <span>•</span>
              <span>© 2026 Email Pro</span>
            </div>
          </div>

        </div>
      </footer>

      {/* MODAL: BYOK API KEY */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              className="bg-[#0c0d12] border border-[#1f222e] rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowKeyModal(false)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Gemini API Key Configuration</h3>
                  <p className="text-[11px] text-neutral-400 font-mono">Bring Your Own Key (BYOK)</p>
                </div>
              </div>

              <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                Your key is saved safely in your browser&apos;s localStorage and proxy-sent directly for Gemini AI assistance inside the editor.
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="password"
                    value={userApiKey}
                    onChange={(e) => setUserApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#12141c] border border-[#1f222e] focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-white outline-none pr-9 font-mono"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Get a free Gemini API Key</span>
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
                      className="text-rose-600 hover:underline font-medium"
                    >
                      Clear Key
                    </button>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#12141c] hover:bg-[#1f222e] text-neutral-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveApiKey}
                    className="flex-1 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    {keySaved ? <Check className="w-4 h-4 text-emerald-400" /> : 'Save Key'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: BOOK A CALL DEMO */}
      <AnimatePresence>
        {showBookDemoModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c0d12] border border-[#1f222e] rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setShowBookDemoModal(false);
                  setDemoFormSubmitted(false);
                }}
                className="absolute right-4 top-4 text-neutral-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>

              {!demoFormSubmitted ? (
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                    👋
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Book an Individual Demo</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Our product team will give you a personalized walkthrough of Email Pro features.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setDemoFormSubmitted(true);
                    }}
                    className="space-y-3 pt-2"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="w-full bg-[#12141c] border border-[#1f222e] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-black"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Work Email Address"
                      className="w-full bg-[#12141c] border border-[#1f222e] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-black"
                    />
                    <button
                      type="submit"
                      className="w-full bg-black text-white text-xs font-bold py-3 rounded-xl hover:bg-neutral-800 transition-colors"
                    >
                      Confirm Call Request
                    </button>
                  </form>
                </div>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-white">Call Request Received!</h3>
                  <p className="text-xs text-neutral-400">
                    We&apos;ll email you a calendar invitation within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setShowBookDemoModal(false);
                      setDemoFormSubmitted(false);
                    }}
                    className="mt-4 bg-black text-white text-xs font-bold px-6 py-2.5 rounded-full"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CUSTOM EMAIL REQUEST */}
      <AnimatePresence>
        {showCustomTemplateModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c0d12] border border-[#1f222e] rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowCustomTemplateModal(false)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                  🎨
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Order a Custom Template</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Describe your brand requirements or use our AI studio assistant directly inside the editor.
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => {
                      setShowCustomTemplateModal(false);
                      onStart();
                    }}
                    className="w-full bg-black text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <span>Open Editor &amp; Use AI Builder</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowCustomTemplateModal(false)}
                    className="w-full bg-[#12141c] text-neutral-300 text-xs font-semibold py-2.5 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
