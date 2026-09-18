'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FilePlus2, Code, FileText, Copy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CreateTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderName?: string, starterType?: 'blank-tsx' | 'blank-html' | 'current') => void;
  name: string;
  setName: (name: string) => void;
  folder: string;
  setFolder: (folder: string) => void;
}

export function CreateTemplateDialog({
  isOpen,
  onClose,
  onConfirm,
  name,
  setName,
  folder,
  setFolder
}: CreateTemplateDialogProps) {
  const [starterType, setStarterType] = useState<'blank-tsx' | 'blank-html' | 'current'>('blank-tsx');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    onConfirm(folder, starterType);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 select-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-backdrop backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg shadow-2xl"
        >
          <div className="p-7 space-y-6 bg-surface border border-border-base rounded-2xl text-fg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center text-accent shadow-inner shrink-0">
                <FilePlus2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-fg">Create New Template</h3>
                <p className="text-xs font-medium text-fg-muted">Start from a minimal blank email or clone current work.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input 
                label="Template Name"
                placeholder="e.g. Transactional Alert or Weekly Digest"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-surface-raised border-border-base text-fg focus-visible:ring-accent"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />

              <Input 
                label="Folder / Category (Optional)"
                placeholder="e.g. Marketing, Transactional, Internal"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="bg-surface-raised border-border-base text-fg focus-visible:ring-accent"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />

              {/* Starter Template Selection */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-fg-muted">
                  Starting Point
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStarterType('blank-tsx')}
                    className={cn(
                      "p-3 rounded-xl border text-left flex flex-col justify-between transition-all",
                      starterType === 'blank-tsx'
                        ? "bg-accent/10 border-accent/50 text-fg"
                        : "bg-surface-raised border-border-base text-fg-muted hover:text-fg hover:border-border-strong"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-accent" />
                      <span className="text-xs font-bold">Blank TSX</span>
                    </div>
                    <span className="text-[10px] text-fg-muted leading-tight">
                      React Email clean starter
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStarterType('blank-html')}
                    className={cn(
                      "p-3 rounded-xl border text-left flex flex-col justify-between transition-all",
                      starterType === 'blank-html'
                        ? "bg-accent/10 border-accent/50 text-fg"
                        : "bg-surface-raised border-border-base text-fg-muted hover:text-fg hover:border-border-strong"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-warning" />
                      <span className="text-xs font-bold">Blank HTML</span>
                    </div>
                    <span className="text-[10px] text-fg-muted leading-tight">
                      Standard inline-styled HTML
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStarterType('current')}
                    className={cn(
                      "p-3 rounded-xl border text-left flex flex-col justify-between transition-all",
                      starterType === 'current'
                        ? "bg-accent/10 border-accent/50 text-fg"
                        : "bg-surface-raised border-border-base text-fg-muted hover:text-fg hover:border-border-strong"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Copy className="w-4 h-4 text-success" />
                      <span className="text-xs font-bold">Clone Current</span>
                    </div>
                    <span className="text-[10px] text-fg-muted leading-tight">
                      Copy current editor code
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 h-11 bg-surface-raised border-border-base hover:bg-surface-hover text-fg text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!name.trim()}
                className="flex-[2] h-11 bg-accent hover:bg-accent-hover text-accent-fg border-none text-xs font-semibold shadow-sm"
              >
                Create Template
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
