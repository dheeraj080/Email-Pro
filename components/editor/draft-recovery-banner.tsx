'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trash2, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailDraft } from '@/lib/draft-storage';

interface DraftRecoveryBannerProps {
  draft: EmailDraft | null;
  onRestore: () => void;
  onDiscard: () => void;
}

export function DraftRecoveryBanner({
  draft,
  onRestore,
  onDiscard
}: DraftRecoveryBannerProps) {
  if (!draft) return null;

  const timeString = new Date(draft.updatedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-accent/10 border-b border-accent/20 px-6 py-2.5 flex items-center justify-between text-fg text-xs shrink-0 select-none backdrop-blur-sm z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-medium text-fg">Unsaved draft recovered:</span>{' '}
            <span className="text-fg-secondary">
              A previous local editing session from {timeString} was found for this template.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onDiscard}
            className="h-7 px-2.5 rounded-lg bg-surface-raised hover:bg-danger-bg text-fg-muted hover:text-danger border border-border-base text-xs font-medium flex items-center gap-1 transition-colors"
            title="Discard this local draft and keep the baseline template"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard</span>
          </Button>

          <Button
            size="sm"
            onClick={onRestore}
            className="h-7 px-3 rounded-lg bg-accent hover:bg-accent-hover text-accent-fg border-none text-xs font-medium flex items-center gap-1.5 shadow-xs transition-all"
            title="Restore saved edits from previous session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Draft</span>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
