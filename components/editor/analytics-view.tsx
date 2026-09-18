'use client';

import React from 'react';
import AnalyticsDashboard from '@/components/analytics-dashboard';
import { EmailMetrics } from '@/lib/analytics-utils';
import { EmailQualityReport } from '@/lib/email-quality';
import { Loader2, ArrowLeft } from 'lucide-react';

interface AnalyticsViewProps {
  metrics: EmailMetrics | null;
  qualityReport?: EmailQualityReport | null;
  isAnalyzing: boolean;
  onBackToEditor?: () => void;
}

export const AnalyticsView = React.memo(function AnalyticsView({
  metrics,
  qualityReport,
  isAnalyzing,
  onBackToEditor
}: AnalyticsViewProps) {
  if (isAnalyzing && !metrics) {
    return (
      <div className="h-full flex items-center justify-center bg-app">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-fg-muted">Analyzing Email Performance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-app">
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        {onBackToEditor && (
          <div className="mb-6">
            <button
              type="button"
              onClick={onBackToEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-hover border border-border-base text-xs font-semibold text-fg-secondary hover:text-fg transition-colors active:scale-[0.98]"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              <span>Back to Editor (Split View)</span>
            </button>
          </div>
        )}
        <AnalyticsDashboard metrics={metrics} qualityReport={qualityReport} isAnalyzing={isAnalyzing} />
      </div>
    </div>
  );
});

