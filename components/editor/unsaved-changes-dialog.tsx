'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Template } from '@/lib/types';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  currentTemplate: Template;
  targetTemplate: Template | null;
  onSaveAndSwitch: () => void;
  onDiscardAndSwitch: () => void;
  onCancel: () => void;
}

export function UnsavedChangesDialog({
  isOpen,
  currentTemplate,
  targetTemplate,
  onSaveAndSwitch,
  onDiscardAndSwitch,
  onCancel
}: UnsavedChangesDialogProps) {
  if (!isOpen || !targetTemplate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-backdrop backdrop-blur-md"
          onClick={onCancel}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-md bg-surface border border-border-base rounded-2xl p-6 shadow-2xl space-y-6 text-fg"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-warning-bg border border-warning-border flex items-center justify-center text-warning shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-fg tracking-tight">Unsaved Edits Detected</h3>
                <p className="text-[11px] text-fg-muted font-medium mt-0.5">
                  You have modified <span className="text-warning font-medium">{currentTemplate.name}</span>.
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-1 rounded-lg hover:bg-surface-hover text-fg-muted hover:text-fg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-fg-secondary leading-relaxed bg-surface-raised p-3.5 rounded-xl border border-border-base">
            Switching to <span className="text-accent font-medium">{targetTemplate.name}</span> will replace the current editor view. You can save a version in your revision history or discard your edits.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto h-9 px-3.5 bg-surface-raised border-border-base hover:bg-surface-hover text-fg text-xs font-medium"
            >
              Stay on {currentTemplate.name}
            </Button>
            <div className="flex-1 w-full flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onDiscardAndSwitch}
                className="flex-1 h-9 px-3 bg-danger-bg border-danger-border hover:bg-danger/20 text-danger text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Discard</span>
              </Button>
              <Button
                onClick={onSaveAndSwitch}
                className="flex-1 h-9 px-3 bg-accent hover:bg-accent-hover text-accent-fg text-xs font-medium border-none flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Switch</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
