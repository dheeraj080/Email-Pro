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
  MonitorSmartphone,
  Code2,
  Download,
  History,
  AlertTriangle,
  Eye,
  Layout,
  MoonStar,
  Sun,
  Mail,
} from 'lucide-react';

import TemplateShowcase from './template-showcase';
import { Template } from '@/lib/types';

interface LandingPageProps {
  onStart: () => void;
  onSelectTemplate?: (template: Template) => void;
}

type Device = 'desktop' | 'tablet' | 'mobile';

function FeatureCard({ feature, darkMode }: { feature: any; darkMode: boolean }) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  
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
      className={`relative overflow-hidden group rounded-3xl border p-8 backdrop-blur-xl ${darkMode
        ? 'bg-white/5 border-white/10'
        : 'bg-white border-black/10 shadow-sm hover:shadow-xl transition-all duration-300'
        }`}
    >
      <div 
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.08)'}, transparent 40%)`
        }}
      />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
          {feature.icon}
        </div>

        <h3 className="text-xl font-semibold tracking-tight mb-3 group-hover:text-blue-500 transition-colors">
          {feature.title}
        </h3>

        <p
          className={`leading-relaxed ${darkMode
            ? 'text-neutral-400'
            : 'text-neutral-500'
            }`}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function LandingPage({
  onStart,
  onSelectTemplate,
}: LandingPageProps) {
  const [showGallery, setShowGallery] = React.useState(false);

  const [activeDevice, setActiveDevice] =
    React.useState<Device>('desktop');

  const darkMode = false;

  const [payloadSize, setPayloadSize] = React.useState(73.1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPayloadSize((prev) => {
        const next = prev + (Math.random() * 4 - 2);

        return Math.min(Math.max(next, 68), 96);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: 'Monaco Editor',
      description:
        'Build responsive emails using React and TypeScript.',
    },
    {
      icon: <MonitorSmartphone className="w-5 h-5" />,
      title: 'Live Responsive Preview',
      description:
        'Preview instantly across desktop, tablet, and mobile.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: 'Gmail Clipping Protection',
      description:
        'Track payload size before emails hit production.',
    },
    {
      icon: <History className="w-5 h-5" />,
      title: 'Local History',
      description:
        'Automatic browser-based version history.',
    },
    {
      icon: <Layout className="w-5 h-5" />,
      title: 'Production Templates',
      description:
        'Modern onboarding and transactional templates.',
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: 'Inline HTML Export',
      description:
        'Export optimized HTML for every email provider.',
    },
  ];

  const previewWidth: Record<Device, string> = {
    desktop: 'max-w-md',
    tablet: 'max-w-[340px]',
    mobile: 'max-w-[280px]',
  };

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${darkMode
        ? 'bg-[#09090B] text-white'
        : 'bg-white text-black'
        }`}
    >
      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full" />

        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-violet-500/20 blur-3xl rounded-full" />
      </div>

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 z-50 w-full backdrop-blur-xl border-b ${darkMode
          ? 'bg-black/30 border-white/10'
          : 'bg-white/80 border-black/5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg">
              EP
            </div>

            <div>
              <div className="font-semibold tracking-tight">
                Email.Pro
              </div>

              <div
                className={`text-xs ${darkMode
                  ? 'text-neutral-400'
                  : 'text-neutral-500'
                  }`}
              >
                Local-first email workbench
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a
              href="#features"
              className="hover:text-blue-400 transition-colors"
            >
              Features
            </a>

            <button
              onClick={() => setShowGallery(true)}
              className="hover:text-blue-400 transition-colors"
            >
              Templates
            </button>

            <a
              href="#compatibility"
              className="hover:text-blue-400 transition-colors"
            >
              Compatibility
            </a>
          </div>

          <div className="flex items-center gap-3">

            <a
              href="https://github.com/dheeraj080/Email-Pro"
              target="_blank"
              rel="noreferrer"
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${darkMode
                ? 'border-white/10 bg-white/5 hover:bg-white/10'
                : 'border-black/10 hover:bg-neutral-100'
                }`}
            >
              <Github className="w-4 h-4" />
            </a>

            <button
              onClick={onStart}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-medium hover:scale-[1.02] transition-all shadow-xl"
            >
              Open Workspace
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO */}
        <section className="pt-36 pb-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium mb-8"
              >
                <Sparkles className="w-4 h-4" />
                Local-first React email tooling
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-5xl md:text-7xl font-semibold tracking-tight leading-none"
              >
                Build
                production-safe
                <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  React emails.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`mt-8 text-lg leading-relaxed max-w-xl ${darkMode
                  ? 'text-neutral-400'
                  : 'text-neutral-600'
                  }`}
              >
                Design, preview, and export production-ready
                emails with live responsive previews and Gmail
                clipping protection.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-10 flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={onStart}
                  className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-2xl"
                >
                  Start Building

                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setShowGallery(true)}
                  className={`px-8 py-4 rounded-2xl border font-medium transition-all ${darkMode
                    ? 'border-white/10 bg-white/5 hover:bg-white/10'
                    : 'border-black/10 hover:bg-neutral-100'
                    }`}
                >
                  Explore Templates
                </button>
              </motion.div>

              <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center gap-6 text-sm">
                <span className="text-neutral-400 font-medium">Powered by</span>
                <div className="flex items-center gap-5 grayscale opacity-60 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1.5 font-semibold"><Code2 className="w-4 h-4" /> React</div>
                  <div className="flex items-center gap-1.5 font-semibold"><Code2 className="w-4 h-4" /> TypeScript</div>
                  <div className="flex items-center gap-1.5 font-semibold"><Code2 className="w-4 h-4" /> Tailwind</div>
                  <div className="flex items-center gap-1.5 font-semibold"><Layout className="w-4 h-4" /> Monaco</div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className={`relative rounded-[32px] border overflow-hidden backdrop-blur-xl ${darkMode
                ? 'border-white/10 bg-white/5'
                : 'border-black/10 bg-white'
                }`}
            >
              {/* TOPBAR */}
              <div
                className={`h-16 border-b px-5 flex items-center justify-between ${darkMode
                  ? 'border-white/10'
                  : 'border-black/10'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>

                  <div
                    className={`px-3 py-1 rounded-lg text-xs ${darkMode
                      ? 'bg-white/5 text-neutral-400'
                      : 'bg-neutral-100 text-neutral-600'
                      }`}
                  >
                    welcome-email.tsx
                  </div>
                </div>

                <div className="text-xs text-green-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Compiled
                </div>
              </div>

              {/* BODY */}
              <div className="grid lg:grid-cols-2 min-h-[620px]">
                {/* CODE */}
                <div
                  className={`hidden lg:block border-r p-6 overflow-hidden ${darkMode
                    ? 'border-white/10 bg-black/20'
                    : 'border-black/10 bg-neutral-50'
                    }`}
                >
                  <pre
                    className={`text-[13px] leading-7 overflow-auto h-full ${darkMode
                      ? 'text-neutral-300'
                      : 'text-neutral-700'
                      }`}
                  >
                    {`import { Button, Container } from '@react-email/components';

export default function Email() {
  return (
    <Container>
      <Button>
        Confirm Email
      </Button>
    </Container>
  );
}`}
                  </pre>
                </div>

                {/* PREVIEW */}
                <div
                  className={`relative flex items-center justify-center p-8 ${darkMode
                    ? 'bg-[#0F0F12]'
                    : 'bg-neutral-100'
                    }`}
                >
                  {/* DEVICES */}
                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    {[
                      {
                        key: 'desktop',
                        icon: Laptop,
                      },
                      {
                        key: 'tablet',
                        icon: Tablet,
                      },
                      {
                        key: 'mobile',
                        icon: Smartphone,
                      },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.key}
                          onClick={() =>
                            setActiveDevice(
                              item.key as Device
                            )
                          }
                          className={`p-2 rounded-xl border transition-all ${activeDevice === item.key
                            ? 'bg-blue-500 text-white border-blue-500'
                            : darkMode
                              ? 'bg-white/5 border-white/10 text-neutral-400'
                              : 'bg-white border-black/10 text-neutral-500'
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>

                  {/* EMAIL PREVIEW */}
                  <motion.div
                    animate={{
                      rotateX: [0, 1.5, 0],
                      rotateY: [0, -1.5, 0],
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                    }}
                    className={`w-full ${previewWidth[activeDevice]} rounded-[30px] overflow-hidden shadow-2xl transition-all duration-300`}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* EMAIL CLIENT */}
                    <div
                      className={`h-14 px-4 flex items-center justify-between ${darkMode
                        ? 'bg-[#18181B]'
                        : 'bg-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white">
                          <Mail className="w-5 h-5" />
                        </div>

                        <div>
                          <div className="text-sm font-semibold">
                            Acme Corp
                          </div>

                          <div
                            className={`text-xs ${darkMode
                              ? 'text-neutral-500'
                              : 'text-neutral-400'
                              }`}
                          >
                            Welcome to Acme
                          </div>
                        </div>
                      </div>

                      <div
                        className={`text-xs ${darkMode
                          ? 'text-neutral-500'
                          : 'text-neutral-400'
                          }`}
                      >
                        2m ago
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div
                      className={`p-8 ${darkMode
                        ? 'bg-[#111113]'
                        : 'bg-white'
                        }`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white flex items-center justify-center mb-6 shadow-xl">
                        <ShieldCheck className="w-7 h-7" />
                      </div>

                      <h2 className="text-3xl font-semibold tracking-tight mb-4 leading-tight">
                        Welcome to
                        <span className="block mt-2 bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                          Acme Corp
                        </span>
                      </h2>

                      <p
                        className={`leading-relaxed mb-8 ${darkMode
                          ? 'text-neutral-400'
                          : 'text-neutral-500'
                          }`}
                      >
                        Confirm your email to access your
                        dashboard and begin using the platform.
                      </p>

                      <button className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium hover:scale-[1.01] transition-all shadow-xl">
                        Confirm Email
                      </button>
                    </div>
                  </motion.div>

                  {/* PAYLOAD */}
                  <div
                    className={`absolute bottom-5 right-5 rounded-2xl p-5 shadow-2xl min-w-[260px] border backdrop-blur-xl ${darkMode
                      ? 'bg-black/50 border-white/10'
                      : 'bg-white border-black/10'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`text-xs uppercase tracking-widest font-semibold ${darkMode
                          ? 'text-neutral-500'
                          : 'text-neutral-400'
                          }`}
                      >
                        Payload Health
                      </div>

                      {payloadSize > 90 ? (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      )}
                    </div>

                    <div className="text-xl font-semibold mb-3">
                      {payloadSize.toFixed(1)}KB / 102KB
                    </div>

                    <div
                      className={`h-2 rounded-full overflow-hidden ${darkMode
                        ? 'bg-white/10'
                        : 'bg-neutral-100'
                        }`}
                    >
                      <motion.div
                        animate={{
                          width: `${(payloadSize / 102) * 100
                            }%`,
                        }}
                        className={`h-full ${payloadSize > 90
                          ? 'bg-red-400'
                          : 'bg-green-400'
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* COMPATIBILITY */}
        <section
          id="compatibility"
          className="py-20 px-6 border-t border-white/10"
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-sm font-medium text-blue-400 mb-4">
              Compatibility
            </div>

            <h2 className="text-4xl font-semibold tracking-tight mb-6">
              Tested across major email clients.
            </h2>

            <p className="text-neutral-400 max-w-2xl mx-auto mb-14">
              Build confidently knowing your emails render
              correctly across modern email platforms.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                'Gmail',
                'Outlook',
                'Apple Mail',
                'Yahoo Mail',
              ].map((client) => (
                <div
                  key={client}
                  className={`rounded-3xl p-8 border text-lg font-semibold backdrop-blur-xl ${darkMode
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white border-black/10'
                    }`}
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="py-24 px-6 border-t border-white/10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-16">
              <div className="text-sm font-medium text-blue-400 mb-4">
                Features
              </div>

              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
                Everything needed for modern email
                development.
              </h2>

              <p className="text-lg text-neutral-400 leading-relaxed">
                Responsive previews, local-first workflows,
                production-safe exports, and developer-focused
                tooling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} darkMode={darkMode} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-semibold tracking-tight">
              Email.Pro
            </div>

            <div className="text-sm text-neutral-500 mt-1">
              Local-first tooling for email developers.
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <a
              href="#"
              className="hover:text-blue-400 transition-colors"
            >
              Privacy
            </a>

            <a
              href="#"
              className="hover:text-blue-400 transition-colors"
            >
              Terms
            </a>

            <a
              href="#"
              className="hover:text-blue-400 transition-colors"
            >
              Docs
            </a>
          </div>
        </div>
      </footer>

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