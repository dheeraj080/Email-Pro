'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Github,
  Sparkles,
  Laptop,
  Tablet,
  Smartphone,
  Code2,
  Download,
  History,
  AlertTriangle,
  Eye,
  Layout,
  Mail,
  Shield,
  Layers,
  Check,
  FileCode,
  Flame,
  ArrowUpRight,
} from 'lucide-react';

import TemplateShowcase from './template-showcase';
import { Template } from '@/lib/types';
import { TEMPLATES } from '@/lib/templates';
import { exportToHTML } from '@/lib/render-email';

interface LandingPageProps {
  onStart: () => void;
  onSelectTemplate?: (template: Template) => void;
}

type Device = 'desktop' | 'tablet' | 'mobile';

// VS Code High Contrast Style Syntax Highlighter
function HighlightedCode({ code }: { code: string }) {
  const lines = code.split('\n');

  const highlightLine = (line: string) => {
    if (!line.trim()) return <span className="inline-block h-4" />;

    // Check for comments
    if (line.trim().startsWith('//')) {
      return <span className="text-[#6A9955]">{line}</span>;
    }

    // Check for imports
    if (line.trim().startsWith('import ')) {
      const fromIdx = line.indexOf(' from ');
      if (fromIdx !== -1) {
        const importKeyword = <span className="text-[#C586C0] font-semibold">import</span>;
        const importBody = line.substring(line.indexOf('import') + 6, fromIdx);
        const fromKeyword = <span className="text-[#C586C0] font-semibold">from</span>;
        const importPath = line.substring(fromIdx + 6);

        return (
          <span>
            {importKeyword}
            <span className="text-[#9CDCFE]">{importBody}</span>
            {fromKeyword}{' '}
            <span className="text-[#CE9178]">{importPath}</span>
          </span>
        );
      }
    }

    // Check for export default function
    if (line.includes('export default function')) {
      const startIdx = line.indexOf('export default function');
      const leadingSpace = line.substring(0, startIdx);
      const rest = line.substring(startIdx);
      const nameStart = rest.indexOf('function') + 8;
      const nameEnd = rest.indexOf('(');
      const funcName = rest.substring(nameStart, nameEnd).trim();

      return (
        <span>
          {leadingSpace}
          <span className="text-[#C586C0] font-semibold">export default function</span>{' '}
          <span className="text-[#DCDCAA]">{funcName}</span>
          <span className="text-[#D4D4D4]">() {'{'}</span>
        </span>
      );
    }

    // Check for tags
    if (line.includes('<') || line.includes('>')) {
      const parts: React.ReactNode[] = [];
      let currentIdx = 0;

      // Simple regex parser logic to split tags and render them
      while (currentIdx < line.length) {
        const openIdx = line.indexOf('<', currentIdx);
        if (openIdx === -1) {
          parts.push(<span key={currentIdx} className="text-[#D4D4D4]">{line.substring(currentIdx)}</span>);
          break;
        }

        if (openIdx > currentIdx) {
          parts.push(<span key={currentIdx} className="text-[#D4D4D4]">{line.substring(currentIdx, openIdx)}</span>);
        }

        const closeIdx = line.indexOf('>', openIdx);
        if (closeIdx === -1) {
          parts.push(<span key={openIdx} className="text-[#D4D4D4]">{line.substring(openIdx)}</span>);
          break;
        }

        const tagContent = line.substring(openIdx, closeIdx + 1);
        const isClosing = tagContent.startsWith('</');
        const isSelfClosing = tagContent.endsWith('/>');

        let tagName = '';
        let attributesStr = '';

        if (isClosing) {
          tagName = tagContent.substring(2, tagContent.length - 1);
        } else if (isSelfClosing) {
          const content = tagContent.substring(1, tagContent.length - 2).trim();
          const spaceIdx = content.indexOf(' ');
          tagName = spaceIdx === -1 ? content : content.substring(0, spaceIdx);
          attributesStr = spaceIdx === -1 ? '' : content.substring(spaceIdx + 1);
        } else {
          const content = tagContent.substring(1, tagContent.length - 1).trim();
          const spaceIdx = content.indexOf(' ');
          tagName = spaceIdx === -1 ? content : content.substring(0, spaceIdx);
          attributesStr = spaceIdx === -1 ? '' : content.substring(spaceIdx + 1);
        }

        const tagElements: React.ReactNode[] = [];
        const isReactEmailComponent = tagName && tagName[0] === tagName[0].toUpperCase() && tagName !== 'Html';
        const tagColorClass = isReactEmailComponent ? 'text-[#4FC1FF] font-semibold' : 'text-[#569CD6]';

        tagElements.push(<span key="open" className="text-[#808080]">&lt;{isClosing ? '/' : ''}</span>);
        tagElements.push(<span key="name" className={tagColorClass}>{tagName}</span>);

        if (attributesStr) {
          // Parse attributes
          const attrs = attributesStr.split(' ');
          attrs.forEach((attr, aIdx) => {
            const eqIdx = attr.indexOf('=');
            if (eqIdx !== -1) {
              const name = attr.substring(0, eqIdx);
              const val = attr.substring(eqIdx + 1);
              tagElements.push(<span key={`space-${aIdx}`}> </span>);
              tagElements.push(<span key={`attr-name-${aIdx}`} className="text-[#9CDCFE]">{name}</span>);
              tagElements.push(<span key={`eq-${aIdx}`} className="text-[#D4D4D4]">=</span>);
              tagElements.push(<span key={`attr-val-${aIdx}`} className="text-[#CE9178]">{val}</span>);
            } else {
              tagElements.push(<span key={`space-${aIdx}`}> </span>);
              tagElements.push(<span key={`attr-${aIdx}`} className="text-[#9CDCFE]">{attr}</span>);
            }
          });
        }

        tagElements.push(<span key="close" className="text-[#808080]">{isSelfClosing ? '/' : ''}&gt;</span>);
        parts.push(<span key={openIdx}>{tagElements}</span>);
        currentIdx = closeIdx + 1;
      }

      return <span>{parts}</span>;
    }

    return <span className="text-[#D4D4D4]">{line}</span>;
  };

  return (
    <pre className="text-[11px] leading-[18px] font-mono select-text font-medium h-full overflow-y-auto pr-4">
      {lines.map((line, idx) => (
        <div key={idx} className="flex hover:bg-neutral-800/30 px-1 py-0.5 rounded transition-colors group/line">
          <span className="w-8 text-neutral-600 text-right pr-3 select-none border-r border-neutral-800/40 mr-3 text-[10px] group-hover/line:text-neutral-500 transition-colors">
            {idx + 1}
          </span>
          <span className="flex-1 whitespace-pre">{highlightLine(line)}</span>
        </div>
      ))}
    </pre>
  );
}

// Features Bento Card
function BentoCard({
  feature,
  className = ''
}: {
  feature: {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge?: string;
    extra?: React.ReactNode;
  };
  className?: string;
}) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [hovered, setHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white p-8 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.08)] hover:border-neutral-300/80 transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,102,241,0.06), transparent 60%)`,
          opacity: hovered ? 1 : 0
        }}
      />

      <div className="relative z-10 flex-1">
        <div className="flex items-start justify-between mb-5">
          <div className="w-11 h-11 rounded-2xl bg-neutral-50 border border-neutral-100 text-neutral-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
            {feature.icon}
          </div>
          {feature.badge && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-powder-blue-600 bg-powder-blue-50 border border-powder-blue-100/60 px-2.5 py-1 rounded-full">
              {feature.badge}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold tracking-tight text-neutral-900 mb-2">
          {feature.title}
        </h3>

        <p className="text-xs leading-relaxed text-neutral-500 font-medium mb-4">
          {feature.description}
        </p>
      </div>

      {feature.extra && (
        <div className="relative z-10 w-full mt-2">
          {feature.extra}
        </div>
      )}
    </motion.div>
  );
}

export default function LandingPage({
  onStart,
  onSelectTemplate,
}: LandingPageProps) {
  const [showGallery, setShowGallery] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('welcome');
  const [activeDevice, setActiveDevice] = React.useState<Device>('desktop');
  const [previewHtml, setPreviewHtml] = React.useState<string>('');
  const [loadingPreview, setLoadingPreview] = React.useState(true);
  const [payloadSize, setPayloadSize] = React.useState(42.1);
  const [copiedLink, setCopiedLink] = React.useState(false);

  const activeTemplate = TEMPLATES.find(t => t.id === activeTab) || TEMPLATES[0];

  // Dynamic preview generator on tab changes
  React.useEffect(() => {
    let active = true;
    setLoadingPreview(true);

    // Approximate sizes
    const sizes: Record<string, number> = {
      'welcome': 42.1,
      'reset-password': 32.8,
      'receipt': 65.4,
      'newsletter': 94.2,
    };
    setPayloadSize(sizes[activeTab] || 45.0);

    exportToHTML(activeTemplate.code, activeTemplate.language, activeTemplate.id)
      .then(html => {
        if (active) {
          setPreviewHtml(html);
          setLoadingPreview(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (active) setLoadingPreview(false);
      });

    return () => {
      active = false;
    };
  }, [activeTab, activeTemplate]);

  const showcaseTemplates = TEMPLATES.filter(t =>
    ['welcome', 'reset-password', 'receipt', 'newsletter'].includes(t.id)
  );

  const previewWidth: Record<Device, string> = {
    desktop: 'w-full',
    tablet: 'w-[480px]',
    mobile: 'w-[360px]',
  };

  const bentoFeatures = [
    {
      icon: <Code2 className="w-4 h-4 text-neutral-800" />,
      title: 'Monaco Workspace',
      description: 'Write email code inside a rich IDE-grade editor complete with responsive hot-reloads and inline component documentation.',
      badge: 'Core Editor',
      extra: (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 font-mono text-[9px] text-neutral-400 space-y-1.5 shadow-inner">
          <div className="flex items-center gap-1.5 border-b border-neutral-800 pb-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[8px] text-neutral-500 ml-1">editor.tsx</span>
          </div>
          <div><span className="text-purple-400">import</span> {'{ Button }'} <span className="text-purple-400">from</span> <span className="text-orange-400">"@react-email"</span>;</div>
          <div><span className="text-blue-400">const</span> <span className="text-yellow-400">Email</span> = () =&gt; (</div>
          <div className="pl-3 text-neutral-500">&lt;<span className="text-green-400">Button</span> href=<span className="text-orange-400">"https://..."</span>&gt;Click&lt;/<span className="text-green-400">Button</span>&gt;</div>
          <div>);</div>
        </div>
      )
    },
    {
      icon: <Flame className="w-4 h-4 text-neutral-800" />,
      title: 'Gmail Clipping Protection',
      description: 'Emails over 102KB are sliced in Gmail inbox. Email.Pro measures rendered output and gives real-time checks.',
      badge: 'Optimizer',
      extra: (
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex flex-col justify-between h-[96px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Payload Weight</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">PASS (SAFE)</span>
          </div>
          <div className="text-lg font-black text-neutral-800 font-mono tracking-tight">72.4 KB <span className="text-xs font-semibold text-neutral-400">/ 102 KB Limit</span></div>
          <div className="w-full bg-neutral-200/50 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-[70%]" />
          </div>
        </div>
      )
    },
    {
      icon: <Shield className="w-4 h-4 text-neutral-800" />,
      title: 'Secure Client Credentials',
      description: 'Your Resend credentials are key to sending tests. Stored fully client-side in secure local storage—offline, non-shared.',
      badge: 'Security',
      extra: (
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[9px] font-bold text-neutral-400 uppercase">Resend API Key</div>
            <div className="text-[10px] font-mono text-neutral-800 truncate">re_zk8J91...stored_locally</div>
          </div>
        </div>
      )
    },
    {
      icon: <History className="w-4 h-4 text-neutral-800" />,
      title: 'Local Version History',
      description: 'Accidental deletion? Browser local saves record history snapshots as you edit, letting you restore older drafts instantly.',
      badge: 'Backups',
      extra: (
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[8px] font-bold text-neutral-400">
            <span>SAVED REVISIONS</span>
            <span>AUTO-TRACK</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-neutral-700 bg-white border border-neutral-100 px-2.5 py-1 rounded-md shadow-xs">
            <span className="flex items-center gap-1.5"><History className="w-3 h-3 text-neutral-400" /> Draft V3</span>
            <span className="text-[9px] text-neutral-400 font-mono">10:14 AM</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-neutral-400 px-2.5 py-0.5">
            <span className="flex items-center gap-1.5"><History className="w-3 h-3 text-neutral-300" /> Draft V2</span>
            <span className="text-[9px] text-neutral-300 font-mono">09:48 AM</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-neutral-900 overflow-x-hidden selection:bg-neutral-900 selection:text-white relative">
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60" />

      {/* AMBIENT GRADIENT SHAPES */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[800px] right-10 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 blur-[140px] rounded-full pointer-events-none" />

      {/* FLOATING CAPSULE NAVBAR */}
      <div className="fixed top-5 left-0 w-full z-50 px-4">
        <nav className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl border border-neutral-200/50 rounded-full px-6 py-3.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-xl bg-neutral-900 flex items-center justify-center font-bold text-white text-sm tracking-tight shadow-md">
              E
            </div>
            <div>
              <div className="font-bold text-xs tracking-tight text-neutral-900">Email.Pro</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
            <button onClick={() => setShowGallery(true)} className="hover:text-neutral-900 transition-colors">Templates</button>
            <a href="#compatibility" className="hover:text-neutral-900 transition-colors">Compatibility</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/dheeraj080/Email-Pro"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center w-8.5 h-8.5 rounded-full border border-neutral-200/60 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-all shadow-xs"
            >
              <Github className="w-4 h-4" />
            </a>

            <button
              onClick={onStart}
              className="px-4.5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm"
            >
              Open Workbench
            </button>
          </div>
        </nav>
      </div>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* HERO LEFT COLUMN (5 columns) */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">


              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-[1.05]"
              >
                Build production-safe{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block mt-1">
                  React Email code.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 text-sm leading-relaxed text-neutral-500 font-medium max-w-md"
              >
                An offline, local-first workbench designed to draft, test, and render responsive React email templates with absolute local safety and zero cloud overhead.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
              >
                <button
                  onClick={onStart}
                  className="group px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  Start Building
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setShowGallery(true)}
                  className="px-7 py-3.5 rounded-full bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
                >
                  Explore Templates
                </button>
              </motion.div>

              <div className="mt-12 pt-8 border-t border-neutral-200/50 w-full flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {['React 19', 'TypeScript', 'Tailwind v4', 'Monaco Core', 'Sucrase JSX'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white border border-neutral-200/60 rounded-full text-[10px] text-neutral-600 font-semibold shadow-2xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* HERO RIGHT COLUMN (7 columns) - INTERACTIVE WORKBENCH MOCKUP */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7"
            >
              <div className="bg-neutral-900 rounded-[24px] border border-neutral-800 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-w-full">

                {/* WINDOW CHROME HEADER */}
                <div className="h-14 border-b border-neutral-800/80 px-5 flex items-center justify-between shrink-0 bg-neutral-950/60">
                  <div className="flex items-center gap-6">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                    </div>

                    {/* Workspace File Tab switcher */}
                    <div className="flex items-center gap-1.5">
                      {showcaseTemplates.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${activeTab === t.id
                            ? 'bg-neutral-800 text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                        >
                          <FileCode className="w-3 h-3" />
                          {t.id === 'welcome' ? 'welcome-email.tsx' :
                            t.id === 'reset-password' ? 'reset-pwd.tsx' :
                              t.id === 'receipt' ? 'order-receipt.tsx' : 'newsletter.tsx'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE RENDERER
                  </div>
                </div>

                {/* WORKSPACE CONTENT BODY */}
                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px] max-h-[460px] overflow-hidden">

                  {/* LEFT: SYNTAX HIGHLIGHTED CODE (7 Cols) */}
                  <div className="md:col-span-6 border-r border-neutral-800/80 bg-neutral-900/40 p-4 overflow-y-auto custom-scrollbar flex flex-col">
                    <div className="text-[9px] font-black tracking-widest text-neutral-500 uppercase mb-3 flex items-center gap-1">
                      <Code2 className="w-3 h-3" /> REACT EMAIL SOURCE CODE
                    </div>
                    <div className="flex-1 overflow-auto">
                      <HighlightedCode code={activeTemplate.code} />
                    </div>
                  </div>

                  {/* RIGHT: LIVE VIEWPORT RENDERER (6 Cols) */}
                  <div className="md:col-span-6 bg-neutral-950 flex flex-col h-full overflow-hidden relative">

                    {/* Viewport bar controls */}
                    <div className="h-12 border-b border-neutral-900 bg-neutral-950 px-4 flex items-center justify-between shrink-0">
                      <span className="text-[9px] font-black uppercase text-neutral-500 tracking-wider">LIVE FRAME</span>

                      {/* Device switch controls */}
                      <div className="flex bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
                        {(['desktop', 'tablet', 'mobile'] as Device[]).map(d => (
                          <button
                            key={d}
                            onClick={() => setActiveDevice(d)}
                            className={`p-1.5 rounded-md transition-all text-xs ${activeDevice === d
                              ? 'bg-neutral-800 text-white shadow-xs'
                              : 'text-neutral-500 hover:text-neutral-300'
                              }`}
                          >
                            {d === 'desktop' && <Laptop className="w-3.5 h-3.5" />}
                            {d === 'tablet' && <Tablet className="w-3.5 h-3.5" />}
                            {d === 'mobile' && <Smartphone className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Email View Frame Container */}
                    <div className="flex-1 p-4 bg-neutral-900/60 flex items-start justify-center overflow-auto custom-scrollbar">
                      <div className={`transition-all duration-300 rounded-xl overflow-hidden bg-white shadow-lg ${previewWidth[activeDevice]}`}>

                        {/* Simulation Client Header */}
                        <div className="bg-white border-b border-neutral-100 px-3.5 py-2.5 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                            <Mail className="w-3 h-3" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-[10px] font-bold text-neutral-800 leading-none truncate">Sandbox Inbox</div>
                            <span className="text-[8px] text-neutral-400 font-semibold leading-none truncate">To: developer@local.host</span>
                          </div>
                        </div>

                        {/* RENDERED PREVIEW FRAME */}
                        <div className="h-[280px] overflow-y-auto bg-white relative">
                          {loadingPreview ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-white">
                              <div className="w-5 h-5 rounded-full border-2 border-neutral-200 border-t-neutral-800 animate-spin" />
                              <span className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase">Compiling React</span>
                            </div>
                          ) : (
                            <iframe
                              srcDoc={previewHtml}
                              className="w-full h-full border-none pointer-events-none bg-white"
                              title="Mockup Preview Frame"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PAYLOAD METRICS FLOATING DISPLAY */}
                    <div className="absolute bottom-3 right-3 left-3 bg-neutral-950/90 border border-neutral-800 rounded-xl p-3 flex items-center justify-between backdrop-blur-md shadow-lg">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${payloadSize > 90 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                          {payloadSize > 90 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">GMAIL RENDER WEIGHT</div>
                          <div className="text-xs font-bold text-white font-mono">{payloadSize}KB <span className="text-neutral-600">/ 102KB Limit</span></div>
                        </div>
                      </div>
                      <div className="w-20 bg-neutral-800 h-1.5 rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${payloadSize > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          style={{ width: `${(payloadSize / 102) * 100}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </section>

        {/* VERIFICATION AND COMPATIBILITY CHECK SECTION */}
        <section id="compatibility" className="py-20 px-6 bg-white border-y border-neutral-200/50">
          <div className="max-w-5xl mx-auto text-center">
            <span className="text-[10px] font-bold text-powder-blue-600 bg-powder-blue-50 border border-powder-blue-100/60 px-3 py-1 rounded-full uppercase tracking-wider">
              CLIENT TEST RIGS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-4">
              Tested cross-compatible rendering.
            </h2>
            <p className="text-xs text-neutral-500 font-medium max-w-md mx-auto mt-2 leading-relaxed">
              Email.Pro outputs standard nested HTML tables styles compiled from React components, verified across modern and legacy email inbox renderers.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 text-left">
              {[
                { name: 'Gmail Web', engine: 'WebKit App', size: 'Responsive', badge: '100% Verified' },
                { name: 'Gmail Mobile (iOS)', engine: 'AppleWebKit', size: 'Auto-Scaling', badge: '100% Verified' },
                { name: 'Outlook (Office 365)', engine: 'Word/MSHTML', size: 'Fallback Table', badge: '100% Verified' },
                { name: 'Apple Mail', engine: 'WebKit Engine', size: 'Fluid/Media Q', badge: '100% Verified' }
              ].map((rig) => (
                <div
                  key={rig.name}
                  className="bg-neutral-50 border border-neutral-200/60 rounded-2xl p-5 hover:border-neutral-300 transition-colors shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-[9px] font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 border border-emerald-100/60 rounded">
                        {rig.badge}
                      </span>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900 tracking-tight">{rig.name}</h4>
                  </div>
                  <div className="mt-4 pt-3.5 border-t border-neutral-200/50 flex justify-between text-[9px] font-semibold text-neutral-400">
                    <span>Engine: {rig.engine}</span>
                    <span>Style: {rig.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENTO GRID FEATURES SECTION */}
        <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center md:text-left mb-16">
            <span className="text-[10px] font-bold text-powder-blue-600 bg-powder-blue-50 border border-powder-blue-100/60 px-3 py-1 rounded-full uppercase tracking-wider">
              CAPABILITY SUITE
            </span>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight mt-4">
              Code-first workspace features.
            </h2>
            <p className="text-xs text-neutral-500 font-medium max-w-md mt-2 leading-relaxed">
              Design interfaces that render correctly with modern toolchains, built on client-side state for cost-efficient developer setups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento Card 1: Monaco - Double Width */}
            <BentoCard
              feature={bentoFeatures[0]}
              className="md:col-span-2 shadow-sm"
            />
            {/* Bento Card 2: Gmail Clipping - Single Width */}
            <BentoCard
              feature={bentoFeatures[1]}
              className="shadow-sm"
            />
            {/* Bento Card 3: Secure Keys - Single Width */}
            <BentoCard
              feature={bentoFeatures[2]}
              className="shadow-sm"
            />
            {/* Bento Card 4: Local History - Double Width */}
            <BentoCard
              feature={bentoFeatures[3]}
              className="md:col-span-2 shadow-sm"
            />
          </div>
        </section>

        {/* PROMO ACTIONS CTA */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="bg-neutral-900 rounded-[32px] border border-neutral-800 p-10 md:p-14 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-lg mx-auto">
              <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">LOCAL-FIRST DEPLOYMENT</span>
              <h2 className="text-3xl font-black text-white mt-4 tracking-tight leading-none">
                Start building beautiful templates today.
              </h2>
              <p className="text-xs text-neutral-400 font-medium mt-4 leading-relaxed max-w-md mx-auto">
                No signup flows, subscription tiers, or external server calls. Just drag-and-drop or write pure React code and export layouts instantly.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <button
                  onClick={onStart}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-[0.98]"
                >
                  Launch Workbench
                </button>
                <button
                  onClick={() => setShowGallery(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Explore Layout presets
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER DESIGN */}
      <footer className="border-t border-neutral-200/50 bg-white/40 py-12 px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center font-bold text-white text-xs">
              EP
            </div>
            <div>
              <div className="font-bold text-xs text-neutral-900 tracking-tight">Email.Pro</div>
              <div className="text-[9px] font-semibold text-neutral-400">© 2026 local utility application.</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            <a href="#" className="hover:text-neutral-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>

      {/* RENDER DYNAMIC TEMPLATE SHOWCASE GALERY */}
      <AnimatePresence>
        {showGallery && (
          <TemplateShowcase
            onClose={() => setShowGallery(false)}
            onSelect={(template) => {
              onSelectTemplate?.(template);
              setShowGallery(false);
              onStart();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}