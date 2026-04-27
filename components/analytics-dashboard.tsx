'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Zap, 
  ShieldAlert, 
  FileText, 
  Link as LinkIcon, 
  Image as ImageIcon,
  MousePointer2,
  Inbox,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { EmailMetrics } from '@/lib/analytics-utils';
import { cn } from '@/lib/utils';

interface AnalyticsDashboardProps {
  metrics: EmailMetrics | null;
  isAnalyzing: boolean;
}

export default function AnalyticsDashboard({ metrics, isAnalyzing }: AnalyticsDashboardProps) {
  if (isAnalyzing && !metrics) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-slate-900 border-slate-100 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Calculating insights...</p>
      </div>
    );
  }

  if (!metrics) return null;

  const getSpamRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500 bg-green-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'high': return 'text-red-500 bg-red-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="p-8 space-y-10 max-w-5xl mx-auto overflow-y-auto h-full custom-scrollbar pb-24">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-slate-400">
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Template Analysis</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Campaign Insights</h2>
        <p className="text-sm text-slate-500">Technical audit and performance predications based on current template design.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Inbox className="w-4 h-4" />}
          label="Estimated Open Rate"
          value={`${metrics.estimatedOpenRate}%`}
          desc="Based on delivery heuristics"
          trend="primary"
        />
        <StatCard 
          icon={<MousePointer2 className="w-4 h-4" />}
          label="Estimated Click Rate"
          value={`${metrics.estimatedClickRate}%`}
          desc="Optimized for conversion"
          trend="accent"
        />
        <StatCard 
          icon={<ShieldAlert className="w-4 h-4" />}
          label="Spam Risk Level"
          value={metrics.spamRisk.toUpperCase()}
          desc="Deliverability assessment"
          trend={metrics.spamRisk === 'low' ? 'success' : metrics.spamRisk === 'medium' ? 'warning' : 'danger'}
        />
      </div>

      {/* Technical Audit */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Col: Core Metrics */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Technical Audit</h3>
          
          <div className="space-y-4">
            <MetricItem 
              label="Template Weight" 
              value={`${metrics.sizeKb} KB`} 
              progress={Math.min(100, (metrics.sizeKb / 102) * 100)}
              info="Gmail clips emails over 102KB"
              status={metrics.sizeKb > 102 ? 'danger' : metrics.sizeKb > 80 ? 'warning' : 'success'}
            />
            <MetricItem 
              label="Complexity Score" 
              value={metrics.complexityScore} 
              progress={metrics.complexityScore}
              info="Measures DOM node density"
              status={metrics.complexityScore > 70 ? 'danger' : 'success'}
            />
            <MetricItem 
              label="Readability" 
              value={`${metrics.readabilityScore}%`} 
              progress={metrics.readabilityScore}
              info="Estimated visual clarity"
              status="primary"
            />
          </div>
        </div>

        {/* Right Col: Inventory */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Content Inventory</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <InventoryCard icon={<LinkIcon className="w-4 h-4" />} label="Links" value={metrics.linkCount} />
            <InventoryCard icon={<ImageIcon className="w-4 h-4" />} label="Images" value={metrics.imageCount} />
            <InventoryCard icon={<FileText className="w-4 h-4" />} label="Lines of Code" value={metrics.linesOfCode} />
            <InventoryCard icon={<Zap className="w-4 h-4" />} label="Components" value={Math.round(metrics.linesOfCode / 10)} />
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
             <div className="mt-0.5">
                {metrics.spamRisk === 'low' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )}
             </div>
             <div>
                <h4 className="text-xs font-bold text-slate-700">Optimization Tip</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {metrics.sizeKb > 102 
                    ? "Your email is large and may be clipped by Gmail. Consider simplifying the structure or reducing nested components."
                    : metrics.spamRisk !== 'low'
                    ? "We detected some potential spam triggers in your content. Avoid excessive exclamation marks and aggressive promotional keywords."
                    : "Everything looks great! Your template is lightweight and follows best practices for high deliverability."}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, desc, trend }: any) {
  const colors: any = {
    primary: 'text-blue-600 bg-blue-50 border-blue-100',
    accent: 'text-slate-900 bg-white border-slate-200',
    success: 'text-green-600 bg-green-50 border-green-100',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-100',
    danger: 'text-red-600 bg-red-50 border-red-100',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={cn("p-6 rounded-2xl border transition-all hover:shadow-lg", colors[trend] || colors.accent)}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-white/50 backdrop-blur-sm">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <div className="text-3xl font-bold tracking-tighter mb-1">{value}</div>
      <p className="text-[10px] opacity-60 font-medium">{desc}</p>
    </motion.div>
  );
}

function MetricItem({ label, value, progress, info, status }: any) {
  const colors: any = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    primary: 'bg-slate-900',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">{label}</span>
          <span className="text-[10px] text-slate-400">{info}</span>
        </div>
        <span className="text-xs font-bold font-mono text-slate-900">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          className={cn("h-full rounded-full transition-all duration-1000", colors[status] || colors.primary)}
        />
      </div>
    </div>
  );
}

function InventoryCard({ icon, label, value }: any) {
  return (
    <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col gap-3">
      <div className="p-1.5 w-fit rounded bg-slate-50 text-slate-400">
        {icon}
      </div>
      <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
          <span className="text-lg font-bold text-slate-900">{value}</span>
      </div>
    </div>
  );
}
