'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Ctrl + S / ⌘S', desc: 'Save revision to history & update local draft' },
  { key: 'Ctrl + Enter / ⌘Enter', desc: 'Force authoritative re-render' },
  { key: 'Ctrl + P / ⌘P', desc: 'Cycle editor views (Split / Code / Preview)' },
  { key: 'Ctrl + Shift + Q', desc: 'Open Email Quality Inspector' },
  { key: 'Ctrl + Z / ⌘Z', desc: 'Undo last code modification' },
  { key: 'Ctrl + Shift + Z / ⌘Shift+Z', desc: 'Redo previously undone change' },
  { key: 'Alt + Shift + F', desc: 'Format document in Monaco editor' },
  { key: 'Ctrl + F / ⌘F', desc: 'Find in current code' },
  { key: 'Ctrl + H / ⌘H', desc: 'Find and replace in current code' },
  { key: 'Esc', desc: 'Close open dialogs and return to editor' },
];

export function KeyboardShortcutsDialog({
  isOpen,
  onClose
}: KeyboardShortcutsDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-backdrop backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-lg bg-surface border border-border-base rounded-2xl p-6 shadow-2xl space-y-6 text-fg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-fg tracking-tight">Keyboard Shortcuts</h3>
                <p className="text-[11px] text-fg-muted font-medium">Quick key combinations for fast email authoring.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-surface-hover text-fg-muted hover:text-fg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
            {SHORTCUTS.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-raised border border-border-base text-xs"
              >
                <span className="text-fg-secondary font-medium">{s.desc}</span>
                <kbd className="px-2 py-1 rounded bg-surface border border-border-base text-[10px] font-mono font-bold text-accent shrink-0 shadow-xs">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-border-base">
            <Button
              onClick={onClose}
              className="h-9 px-4 bg-accent hover:bg-accent-hover text-accent-fg text-xs font-semibold border-none"
            >
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
