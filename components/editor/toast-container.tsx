'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastNotification } from '@/hooks/use-email-editor';

interface ToastContainerProps {
  toast: ToastNotification | null;
  onDismiss: () => void;
}

export function ToastContainer({ toast, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[120] pointer-events-none flex flex-col gap-2">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            className="pointer-events-auto flex items-center gap-3 bg-surface-elevated/95 border border-border-base rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md max-w-sm text-fg"
          >
            <div className="shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-success" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-danger" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-warning" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-accent" />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-fg leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-fg-muted mt-0.5 leading-snug truncate">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={onDismiss}
              className="p-1 rounded-md hover:bg-surface-hover text-fg-muted hover:text-fg transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
