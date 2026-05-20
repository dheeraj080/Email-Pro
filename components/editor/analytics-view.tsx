'use client';

import React from 'react';
import AnalyticsDashboard from '@/components/analytics-dashboard';
import { EmailMetrics } from '@/lib/analytics-utils';
import { Loader2 } from 'lucide-react';

interface AnalyticsViewProps {
  metrics: EmailMetrics | null;
  isAnalyzing: boolean;
}

export const AnalyticsView = React.memo(function AnalyticsView({ metrics, isAnalyzing }: AnalyticsViewProps) {
  if (isAnalyzing && !metrics) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-powder-blue-500 animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-ink-black-400">Analyzing Email Performance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-white">
      <div className="max-w-5xl mx-auto p-12">
        <AnalyticsDashboard metrics={metrics} isAnalyzing={isAnalyzing} />
      </div>
    </div>
  );
});
