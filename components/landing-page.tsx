'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Code2, 
  Globe, 
  Zap, 
  Layout, 
  Smartphone,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import TemplateShowcase from './template-showcase';
import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LandingPageProps {
  onStart: () => void;
  onSelectTemplate?: (template: Template) => void;
}

export default function LandingPage({ onStart, onSelectTemplate }: LandingPageProps) {
  const [showGallery, setShowGallery] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-slate-900 selection:bg-slate-900 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">Email.Pro</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <button onClick={() => setShowGallery(true)} className="hover:text-slate-900 transition-colors">Templates</button>
            <a href="#features" className="hover:text-slate-900 transition-colors">Architecture</a>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={onStart} className="bg-slate-950 hover:bg-slate-800 text-white rounded-xl px-6 h-11">
              Open Editor
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Section: Hero */}
        <section className="relative pt-48 pb-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <Badge variant="info" className="bg-slate-50 text-slate-600 border-slate-200 py-1.5 px-4 rounded-full font-medium tracking-wide flex items-center gap-2 w-fit normal-case">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Live React-to-HTML Engine
              </Badge>
              
              <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] text-slate-950">
                Email Engineering <br />
                <span className="text-slate-400">for Modern Web.</span>
              </h1>
              
              <p className="max-w-xl text-lg text-slate-500 leading-relaxed font-medium">
                The high-fidelity design environment for building reliable email systems. Craft responsive templates with real-time rendering, technical validation, and integrated campaign tracking.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button onClick={onStart} size="lg" className="h-14 px-8 bg-slate-950 hover:bg-slate-800 rounded-2xl text-lg transition-all">
                  Launch App
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowGallery(true)} className="h-14 px-8 rounded-2xl text-lg border-slate-200">
                  Explore Templates
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-6">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  </div>
                </div>
                <div className="p-8 grid grid-cols-12 gap-6">
                  <div className="col-span-4 space-y-4">
                     <div className="h-4 bg-slate-100 rounded w-full" />
                     <div className="h-4 bg-slate-50 rounded w-5/6" />
                     <div className="h-4 bg-slate-50 rounded w-2/3" />
                  </div>
                  <div className="col-span-8 bg-slate-50 border border-slate-100 rounded-2xl h-64 p-6 flex flex-col gap-4">
                     <div className="h-8 bg-white/80 rounded-lg w-1/3" />
                     <div className="h-32 bg-white/40 rounded-xl w-full" />
                     <div className="h-8 bg-slate-950 rounded-lg w-1/2" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section: Features */}
        <section id="features" className="py-32 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-32">
            
            {/* Feature 1: The Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white">
                  <Layout className="w-6 h-6" />
                </div>
                <h2 className="text-4xl font-display font-bold tracking-tight text-slate-950">
                  Technical Editor <br />
                  <span className="text-slate-400">with Real-time Feedback.</span>
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  Write modern React components and see them instantly rendered into bulletproof, table-based HTML. Our engine handles the complexity of cross-client compatibility automatically.
                </p>
                <ul className="space-y-4 pt-4">
                  {[
                    "Live side-by-side preview",
                    "MJML-optimized output",
                    "Mobile & Desktop toggles",
                    "Syntax highlighting & Validation"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="bg-slate-50 rounded-[32px] p-4 border border-slate-100 shadow-inner">
                  <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl aspect-video flex">
                    <div className="w-1/2 border-r border-slate-800 p-4 font-mono text-[10px] text-slate-400 space-y-2">
                       <div className="text-emerald-400">export default function Email() {'{'}</div>
                       <div className="pl-4">return (</div>
                       <div className="pl-8 text-blue-400">&lt;Container&gt;</div>
                       <div className="pl-12">&lt;Heading&gt;Hello World&lt;/Heading&gt;</div>
                       <div className="pl-8 text-blue-400">&lt;/Container&gt;</div>
                       <div className="pl-4">);</div>
                       <div>{'}'}</div>
                    </div>
                    <div className="w-1/2 bg-white p-6 flex flex-col items-center">
                       <div className="w-full h-8 bg-slate-100 rounded-lg mb-4" />
                       <div className="w-2/3 h-4 bg-slate-50 rounded-lg mb-2" />
                       <div className="w-1/2 h-4 bg-slate-50 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Audience */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="relative order-2 lg:order-1">
                 <div className="grid grid-cols-2 gap-4">
                    <Card className="p-6 border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Selected</span>
                          <Badge variant="success" className="h-5 text-[9px]">Active</Badge>
                       </div>
                       <div className="space-y-2">
                          <div className="h-3 bg-slate-100 rounded w-full" />
                          <div className="h-3 bg-slate-50 rounded w-2/3" />
                       </div>
                    </Card>
                    <Card className="p-6 border-slate-100 mt-8 space-y-4">
                       <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <Zap className="w-4 h-4" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-900 italic">Bulk Select</p>
                          <p className="text-[10px] text-slate-500">2,480 contacts identified</p>
                       </div>
                    </Card>
                 </div>
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                  <Globe className="w-6 h-6" />
                </div>
                <h2 className="text-4xl font-display font-bold tracking-tight text-slate-950">
                  Audience Intelligence. <br />
                  <span className="text-slate-400">Segmented & Sorted.</span>
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  Manage your contacts with powerful grouping and selection tools. Sync your audience data and broadcast templates to specific segments with zero friction.
                </p>
                <div className="flex flex-wrap gap-2 pt-4">
                   {["Dynamic Groups", "Bulk Select", "CSV Import", "Contact Logs"].map((tag) => (
                      <Badge key={tag} variant="neutral" className="bg-slate-100 text-slate-600 border-none font-medium px-3 italic">#{tag}</Badge>
                   ))}
                </div>
              </div>
            </div>

            {/* Feature 3: Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h2 className="text-4xl font-display font-bold tracking-tight text-slate-950">
                  Data Feedback Loop. <br />
                  <span className="text-slate-400">Track every interaction.</span>
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  Our integrated analytics engine tracks opens, clicks, and unsubscribes in real-time. Gain deep insights into how your templates perform across different platforms and regions.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                   <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">Open Rate</p>
                      <p className="text-2xl font-display font-bold text-slate-950">42.8%</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Delivered</p>
                      <p className="text-2xl font-display font-bold text-slate-950">99.9%</p>
                   </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-100 relative">
                 <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6">
                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                    <div className="flex items-end gap-2 h-32">
                       {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 1].map((h, i) => (
                          <motion.div 
                            key={i} 
                            className="flex-1 bg-slate-950 rounded-t-lg"
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h * 100}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                          />
                       ))}
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
           <div className="max-w-4xl mx-auto bg-slate-950 rounded-[40px] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 to-transparent pointer-events-none" />
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">Ready to build?</h2>
              <p className="text-slate-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                Start with a template or build from scratch using our technical design environment.
              </p>
              <Button onClick={onStart} size="lg" className="bg-white text-slate-950 hover:bg-slate-100 rounded-2xl h-14 px-10 text-lg font-bold">
                 Open Application
              </Button>
           </div>
        </section>
      </main>

      <footer className="bg-white px-6 py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 text-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-950">Email.Pro</span>
          </div>
          
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <button onClick={() => setShowGallery(true)} className="hover:text-slate-900 transition-colors">Templates</button>
            <a href="#features" className="hover:text-slate-900 transition-colors">Architecture</a>
          </div>

          <p className="text-slate-400 text-xs font-medium">
            © 2026 Email.Pro Laboratories. Production-ready email engineering.
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

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="p-8 border-slate-100 hover:border-slate-200 transition-all hover:shadow-xl hover:shadow-slate-100/50 group bg-transparent rounded-3xl">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-950 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">
        {description}
      </p>
    </Card>
  );
}
