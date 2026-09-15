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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AnalyticsDashboardProps {
  metrics: EmailMetrics | null;
  isAnalyzing: boolean;
}

export default function AnalyticsDashboard({ metrics, isAnalyzing }: AnalyticsDashboardProps) {
  if (isAnalyzing && !metrics) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-indigo-400 border-[#1f222e] animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Calculating insights...</p>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-10 pb-24 text-neutral-300">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-indigo-400">
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Template Analysis</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Campaign Insights</h2>
        <p className="text-sm text-neutral-400 font-medium">Technical audit and performance predictions based on current template design.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Inbox className="w-4 h-4" />}
          label="Estimated Open Rate"
          value={`${metrics.estimatedOpenRate}%`}
          desc="Based on delivery heuristics"
          variant="primary"
        />
        <StatCard
          icon={<MousePointer2 className="w-4 h-4" />}
          label="Estimated Click Rate"
          value={`${metrics.estimatedClickRate}%`}
          desc="Optimized for conversion"
        />
        <StatCard
          icon={<ShieldAlert className="w-4 h-4" />}
          label="Spam Risk Level"
          value={metrics.spamRisk.toUpperCase()}
          desc="Deliverability assessment"
          variant={metrics.spamRisk === 'low' ? 'success' : metrics.spamRisk === 'medium' ? 'warning' : 'danger'}
        />
      </div>

      {/* Technical Audit & Accessibility */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="p-6 bg-[#0c0d12] border border-[#1f222e] rounded-2xl space-y-8 shadow-2xl">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Technical Audit</h3>

          <div className="space-y-6">
            <MetricItem
              label="Template Weight"
              value={`${metrics.sizeKb} KB`}
              progress={Math.min(100, (metrics.sizeKb / 102) * 100)}
              info="Gmail clips emails over 102KB"
              status={metrics.sizeKb > 102 ? 'error' : metrics.sizeKb > 80 ? 'warning' : 'success'}
            />
            <MetricItem
              label="Complexity Score"
              value={metrics.complexityScore}
              progress={metrics.complexityScore}
              info="Measures DOM node density"
              status={metrics.complexityScore > 70 ? 'error' : 'success'}
            />
            <MetricItem
              label="Accessibility Score"
              value={`${metrics.accessibilityScore}%`}
              progress={metrics.accessibilityScore}
              info="WCAG 2.1 Compliance Check"
              status={metrics.accessibilityScore < 70 ? 'error' : metrics.accessibilityScore < 90 ? 'warning' : 'success'}
            />
          </div>
        </div>

        <div className="p-6 bg-[#0c0d12] border border-[#1f222e] rounded-2xl space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Accessibility Issues</h3>
            <Badge variant={metrics.accessibilityIssues.length > 0 ? 'error' : 'success'}>
              {metrics.accessibilityIssues.length} found
            </Badge>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {metrics.accessibilityIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">No issues detected</p>
              </div>
            ) : (
              metrics.accessibilityIssues.map((issue, idx) => (
                <div key={idx} className="p-3 bg-[#07080b] rounded-xl border border-[#1f222e] group hover:border-indigo-500/40 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          issue.impact === 'critical' || issue.impact === 'serious' ? 'bg-rose-400' : 'bg-amber-400'
                        )} />
                        <h4 className="text-[11px] font-bold text-white">{issue.help}</h4>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed font-medium mb-2">{issue.description}</p>
                      <a
                        href={issue.helpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 underline"
                      >
                        Solutions
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 font-bold mb-[-16px]">Optimization Recommendations</h3>
          <div className={cn(
            "p-5 rounded-2xl flex items-start gap-4 border",
            metrics.spamRisk === 'low' && metrics.accessibilityScore >= 90 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-amber-500/10 border-amber-500/20 text-amber-300"
          )}>
            <div className={cn(
              "mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              metrics.spamRisk === 'low' && metrics.accessibilityScore >= 90 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
            )}>
              {metrics.spamRisk === 'low' && metrics.accessibilityScore >= 90 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Optimization Tip</h4>
              <p className="text-[11px] text-neutral-300 mt-1.5 leading-relaxed font-medium">
                {metrics.sizeKb > 102
                  ? "Your email is large and may be clipped by Gmail (102KB limit). Consider simplifying structure."
                  : metrics.accessibilityScore < 70
                    ? "Significant accessibility barriers detected. Check missing alt text and contrast ratios in the audit above."
                    : metrics.spamRisk !== 'low'
                      ? "Potential spam triggers detected. Review subject lines and keyword density to ensure high deliverability."
                      : "Excellent work! Your template is highly accessible, lightweight, and delivery-optimized."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Content Inventory</h3>
          <div className="grid grid-cols-2 gap-4">
            <InventoryCard icon={<LinkIcon className="w-4 h-4" />} label="Links" value={metrics.linkCount} />
            <InventoryCard icon={<ImageIcon className="w-4 h-4" />} label="Images" value={metrics.imageCount} />
            <InventoryCard icon={<FileText className="w-4 h-4" />} label="Lines" value={metrics.linesOfCode} />
            <InventoryCard icon={<Zap className="w-4 h-4" />} label="Blocks" value={Math.round(metrics.linesOfCode / 12)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, desc, variant = 'default' }: any) {
  const variants: any = {
    default: 'bg-[#0c0d12] text-white border-[#1f222e]',
    primary: 'bg-indigo-600 text-white border-indigo-500',
    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  };

  return (
    <div className={cn("p-6 rounded-2xl border hover:translate-y-[-2px] transition-all shadow-xl", variants[variant])}>
      <div className="flex items-center gap-3 mb-5">
        <div className={cn(
          "p-2 rounded-xl backdrop-blur-sm shadow-sm",
          variant === 'primary' ? "bg-white/20 text-white" : "bg-[#12141c] text-indigo-400"
        )}>
          {icon}
        </div>
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest",
          variant === 'primary' ? "opacity-90" : "text-neutral-400"
        )}>{label}</span>
      </div>
      <div className="text-3xl font-black tracking-tighter mb-1 font-mono">{value}</div>
      <p className={cn(
        "text-[10px] font-bold uppercase tracking-wider",
        variant === 'primary' ? "opacity-80" : "text-neutral-400"
      )}>{desc}</p>
    </div>
  );
}

function MetricItem({ label, value, progress, info, status }: any) {
  const colors: any = {
    success: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]',
    warning: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]',
    error: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.4)]',
    primary: 'bg-indigo-500',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-white mb-0.5">{label}</span>
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{info}</span>
        </div>
        <Badge variant={status === 'primary' ? 'neutral' : status}>
          {value}
        </Badge>
      </div>
      <div className="h-2 w-full bg-[#07080b] rounded-full overflow-hidden p-0.5 border border-[#1f222e] shadow-inner">
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
    <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1f222e] flex flex-col gap-3 group hover:border-indigo-500/40 transition-all">
      <div className="p-2 w-fit rounded-lg bg-[#12141c] text-indigo-400 group-hover:text-indigo-300 transition-colors">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-neutral-400">{label}</span>
        <span className="text-xl font-bold text-white font-mono">{value}</span>
      </div>
    </div>
  );
}
