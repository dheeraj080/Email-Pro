'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Search, 
  Code2, 
  ArrowRight, 
  ExternalLink, 
  Layout, 
  Mail,
  Zap,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function TemplatesListPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-slate-900 font-sans selection:bg-slate-950 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">Email.Pro</span>
          </Link>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <Link href="/" className="px-5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Editor</Link>
             <button className="px-5 py-1.5 text-xs font-bold bg-white text-slate-950 rounded-lg shadow-sm">Templates</button>
          </div>

          <Button asChild className="bg-slate-950 hover:bg-slate-800 text-white rounded-xl px-6 h-11">
            <Link href="/">Open App</Link>
          </Button>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <Badge variant="neutral" className="bg-slate-50 text-slate-400 border-slate-200 py-1 px-3 rounded-full font-medium tracking-wide uppercase text-[10px]">
                Global Library 1.0
              </Badge>
              <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-slate-950">
                Precision <br />
                <span className="text-slate-400">Library.</span>
              </h1>
              <p className="max-w-md text-slate-500 font-medium leading-relaxed">
                A collection of technical-grade React templates optimized for deliverability and high-conversion.
              </p>
            </div>

            <div className="w-full md:w-80">
              <Input 
                placeholder="Search templates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="h-14 font-medium rounded-2xl shadow-inner bg-slate-50/50 border-slate-200"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredTemplates.map((template, idx) => (
              <TemplateGridCard key={template.id} template={template} index={idx} />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="py-24 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 shadow-inner">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold">No templates found</h3>
              <p className="text-slate-400 max-w-xs mx-auto text-sm">We couldn't find any templates matching your search criteria. Try a different term.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white px-6 py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 text-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
               <Code2 className="w-5 h-5 text-white" />
             </div>
             <span className="font-display text-xl font-bold tracking-tight text-slate-950">Email.Pro</span>
          </div>
          <p className="text-slate-400 text-xs font-medium">
            © 2026 Email.Pro Laboratories. Built for production-grade deliverability.
          </p>
        </div>
      </footer>
    </div>
  );
}

function TemplateGridCard({ template, index }: { template: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/templates/${template.id}`} className="group block">
        <Card className="p-0 overflow-hidden border-slate-100 hover:border-slate-300 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 relative bg-white rounded-[32px]">
          <div className="aspect-[1.4] bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center relative">
            <Mail className="w-12 h-12 text-slate-200 group-hover:scale-110 transition-transform duration-700" />
            
            {/* Tag Overlay */}
            <div className="absolute top-6 left-6">
              <Badge variant="info" className="bg-white/90 backdrop-blur shadow-sm text-[9px] font-black uppercase tracking-widest text-slate-600 border-none px-3">
                {template.id === 'welcome' ? 'Hot' : 'Stable'}
              </Badge>
            </div>

            {/* Hover Action */}
            <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white text-slate-950 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                Open Preview <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-xl font-bold text-slate-950 group-hover:text-slate-800 transition-colors uppercase tracking-tight">{template.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">MJML Optimized</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-950 group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
               </div>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
               <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Active</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">V2.4</span>
               </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
