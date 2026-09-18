'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  FileCode,
  Sparkles,
  Layers,
  HelpCircle,
  HardDrive,
  Eye,
  Smartphone,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  EmailQualityReport, 
  QualityDiagnostic, 
  DiagnosticSeverity, 
  DiagnosticCategory 
} from '@/lib/email-quality';

interface QualityInspectorProps {
  report: EmailQualityReport | null;
  isRendering?: boolean;
  className?: string;
}

export const QualityInspector = React.memo(function QualityInspector({
  report,
  isRendering = false,
  className
}: QualityInspectorProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDiagnostics = useMemo(() => {
    if (!report) return [];
    return report.diagnostics.filter(d => {
      const matchSeverity = selectedSeverity === 'all' || d.severity === selectedSeverity;
      const matchCategory = selectedCategory === 'all' || d.category === selectedCategory;
      return matchSeverity && matchCategory;
    });
  }, [report, selectedSeverity, selectedCategory]);

  if (!report) {
    return (
      <div className={cn("h-full flex items-center justify-center p-8 bg-app text-fg-muted", className)}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-accent border-border-base animate-spin" />
          <p className="text-xs font-medium text-fg-muted">Analyzing email quality...</p>
        </div>
      </div>
    );
  }

  const { size, counts, metadata } = report;
  const isSafe = size.status === 'safe' && counts.errors === 0;
  const isWarning = size.status === 'warning' || (counts.errors === 0 && counts.warnings > 0);
  const isCritical = size.status === 'critical' || counts.errors > 0;

  // Status banner styling
  const statusColor = isCritical
    ? 'text-danger bg-danger-bg border-danger-border'
    : isWarning
    ? 'text-warning bg-warning-bg border-warning-border'
    : 'text-success bg-success-bg border-success-border';

  const StatusIcon = isCritical ? AlertCircle : isWarning ? AlertTriangle : ShieldCheck;

  return (
    <div className={cn("h-full overflow-y-auto custom-scrollbar p-6 md:p-8 bg-app text-fg space-y-6", className)}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-base">
        <div>
          <div className="flex items-center gap-2 text-accent mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-medium text-accent">Quality & Compatibility</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-fg">Email Health & Payload Analysis</h2>
          <p className="text-xs text-fg-muted mt-0.5">
            Static analysis of compiled HTML markup, Gmail clipping limits, accessibility semantics, and client compatibility.
          </p>
        </div>

        {/* Global Health Pill */}
        <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-medium text-xs shrink-0 select-none", statusColor)}>
          <StatusIcon className="w-4 h-4 shrink-0" />
          <span>
            {isCritical ? 'Action Required' : isWarning ? 'Review Recommended' : 'Optimal Health'}
          </span>
        </div>
      </div>

      {/* Gmail Clipping & Payload Size Gauge Card */}
      <div className="bg-surface border border-border-base rounded-2xl p-5 md:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-fg">HTML Payload Size</h3>
            </div>
            <p className="text-xs text-fg-muted mt-1">
              Gmail clips HTML email payloads exceeding 102 KB (104,448 UTF-8 bytes).
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-semibold font-mono tracking-tight text-fg">{size.kb} KB</span>
            <span className="text-xs text-fg-muted font-mono block">
              {size.bytes.toLocaleString()} / 104,448 bytes ({size.percentageOfLimit}%)
            </span>
          </div>
        </div>

        {/* Progress Bar with 80KB warning mark and 102KB critical line */}
        <div className="space-y-1.5">
          <div className="relative h-2.5 w-full bg-surface-raised rounded-full overflow-hidden border border-border-base">
            <div
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                size.status === 'critical'
                  ? 'bg-danger'
                  : size.status === 'warning'
                  ? 'bg-warning'
                  : 'bg-success'
              )}
              style={{ width: `${Math.min(100, Math.max(2, size.percentageOfLimit))}%` }}
            />
            {/* 80KB warning threshold tick */}
            <div 
              className="absolute top-0 bottom-0 w-[1px] bg-fg-muted/40 z-10" 
              style={{ left: '78.4%' }} 
              title="80 KB Warning Zone"
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-fg-muted">
            <span>0 KB</span>
            <span className="text-warning">80 KB Warning</span>
            <span className="text-danger font-medium">102 KB Gmail Limit</span>
          </div>
        </div>

        {/* Size Breakdown Pills */}
        <div className="pt-2 border-t border-border-subtle">
          <span className="text-xs font-medium text-fg-muted block mb-3">
            Payload Weight Breakdown
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-raised p-3 rounded-xl border border-border-base">
              <span className="text-xs text-fg-muted font-medium block">Inline CSS</span>
              <span className="text-sm font-mono font-semibold text-accent">
                {(size.breakdown.inlineCssBytes / 1024).toFixed(2)} KB
              </span>
              <span className="text-[11px] text-fg-muted block">
                {Math.round((size.breakdown.inlineCssBytes / (size.bytes || 1)) * 100)}% of total
              </span>
            </div>

            <div className="bg-surface-raised p-3 rounded-xl border border-border-base">
              <span className="text-xs text-fg-muted font-medium block">Text Content</span>
              <span className="text-sm font-mono font-semibold text-success">
                {(size.breakdown.textContentBytes / 1024).toFixed(2)} KB
              </span>
              <span className="text-[11px] text-fg-muted block">
                {Math.round((size.breakdown.textContentBytes / (size.bytes || 1)) * 100)}% of total
              </span>
            </div>

            <div className="bg-surface-raised p-3 rounded-xl border border-border-base">
              <span className="text-xs text-fg-muted font-medium block">HTML Tags</span>
              <span className="text-sm font-mono font-semibold text-warning">
                {(size.breakdown.htmlMarkupBytes / 1024).toFixed(2)} KB
              </span>
              <span className="text-[11px] text-fg-muted block">
                {Math.round((size.breakdown.htmlMarkupBytes / (size.bytes || 1)) * 100)}% of total
              </span>
            </div>

            <div className="bg-surface-raised p-3 rounded-xl border border-border-base">
              <span className="text-xs text-fg-muted font-medium block">Attributes</span>
              <span className="text-sm font-mono font-semibold text-accent">
                {(size.breakdown.attributesBytes / 1024).toFixed(2)} KB
              </span>
              <span className="text-[11px] text-fg-muted block">
                {Math.round((size.breakdown.attributesBytes / (size.bytes || 1)) * 100)}% of total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-border-base rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-fg-muted">Total Errors</span>
            <div className={cn("text-lg font-semibold font-mono", counts.errors > 0 ? "text-danger" : "text-fg-muted")}>
              {counts.errors}
            </div>
          </div>
          <AlertCircle className={cn("w-5 h-5", counts.errors > 0 ? "text-danger" : "text-fg-muted")} />
        </div>

        <div className="bg-surface border border-border-base rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-fg-muted">Warnings</span>
            <div className={cn("text-lg font-semibold font-mono", counts.warnings > 0 ? "text-warning" : "text-fg-muted")}>
              {counts.warnings}
            </div>
          </div>
          <AlertTriangle className={cn("w-5 h-5", counts.warnings > 0 ? "text-warning" : "text-fg-muted")} />
        </div>

        <div className="bg-surface border border-border-base rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-fg-muted">Info Notices</span>
            <div className="text-lg font-semibold font-mono text-info">{counts.info}</div>
          </div>
          <Info className="w-5 h-5 text-info" />
        </div>

        <div className="bg-surface border border-border-base rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-fg-muted">Structure</span>
            <div className="text-xs font-mono font-semibold text-fg-secondary">
              {metadata.linkCount} links • {metadata.imageCount} imgs
            </div>
          </div>
          <FileCode className="w-5 h-5 text-fg-muted" />
        </div>
      </div>

      {/* Diagnostics Filters and List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-fg">
              Diagnostic Feed ({filteredDiagnostics.length})
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: `All (${counts.total})` },
              { id: 'error', label: `Errors (${counts.errors})` },
              { id: 'warning', label: `Warnings (${counts.warnings})` },
              { id: 'info', label: `Info (${counts.info})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedSeverity(f.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium transition-all border",
                  selectedSeverity === f.id
                    ? "bg-surface-elevated text-fg border-border-strong shadow-xs"
                    : "bg-surface text-fg-muted border-border-base hover:text-fg hover:bg-surface-hover"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Items */}
        <div className="space-y-3">
          {filteredDiagnostics.length === 0 ? (
            <div className="bg-surface border border-border-base rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-success" />
              <h4 className="text-sm font-semibold text-fg">No Issues Detected</h4>
              <p className="text-xs text-fg-muted max-w-sm">
                The current email template meets all tested quality, accessibility, and client compatibility benchmarks.
              </p>
            </div>
          ) : (
            filteredDiagnostics.map((diagnostic) => (
              <DiagnosticCard key={diagnostic.id} diagnostic={diagnostic} />
            ))
          )}
        </div>
      </div>

      {/* Static Analysis Limitations Notice */}
      <div className="p-4 bg-surface-raised border border-border-base rounded-xl text-xs text-fg-muted space-y-1.5">
        <div className="flex items-center gap-1.5 font-medium text-fg text-xs">
          <Info className="w-3.5 h-3.5 text-accent" />
          <span>Quality Inspector Guidance</span>
        </div>
        <p className="leading-relaxed">
          Static analysis inspects generated HTML payload size, syntax semantics, and recognized client constraints. Real email client behavior may vary based on end-user mailbox configurations, dark mode overrides, and recipient firewall filters.
        </p>
      </div>
    </div>
  );
});

function DiagnosticCard({ diagnostic }: { diagnostic: QualityDiagnostic }) {
  const isError = diagnostic.severity === 'error';
  const isWarning = diagnostic.severity === 'warning';

  const badgeBorder = isError
    ? 'border-danger-border bg-danger-bg'
    : isWarning
    ? 'border-warning-border bg-warning-bg'
    : 'border-info-border bg-info-bg';

  const badgeText = isError
    ? 'text-danger bg-danger-bg border-danger-border'
    : isWarning
    ? 'text-warning bg-warning-bg border-warning-border'
    : 'text-info bg-info-bg border-info-border';

  const Icon = isError ? AlertCircle : isWarning ? AlertTriangle : Info;

  return (
    <div className={cn("p-4 rounded-xl border transition-all text-left space-y-2.5", badgeBorder)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4 shrink-0", isError ? "text-danger" : isWarning ? "text-warning" : "text-info")} />
          <h4 className="text-xs font-semibold text-fg">{diagnostic.title}</h4>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-raised text-fg-muted border border-border-base">
            {diagnostic.category}
          </span>
          <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-md border", badgeText)}>
            {diagnostic.severity}
          </span>
        </div>
      </div>

      <p className="text-xs text-fg-secondary leading-relaxed font-sans">
        {diagnostic.message}
      </p>

      {diagnostic.recommendation && (
        <div className="pt-2 border-t border-border-subtle flex items-start gap-2 text-xs text-fg-muted">
          <span className="font-medium text-fg shrink-0 mt-0.5">
            Recommendation:
          </span>
          <span className="leading-relaxed">{diagnostic.recommendation}</span>
        </div>
      )}
    </div>
  );
}
