'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FilePlus2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface CreateTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
  setName: (name: string) => void;
}

export function CreateTemplateDialog({
  isOpen,
  onClose,
  onConfirm,
  name,
  setName
}: CreateTemplateDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-ink-black-950/20 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md shadow-xl"
        >
          <Card className="p-8 space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-powder-blue-50 rounded-[24px] flex items-center justify-center text-powder-blue-600 shadow-inner">
                <FilePlus2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-ink-black-900">New Template</h3>
                <p className="text-xs font-medium text-ink-black-400">Establish a new template profile.</p>
              </div>
            </div>

            <div className="space-y-6">
              <Input 
                label="Template Name"
                placeholder="e.g. Summer Campaign 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
              />
              
              <div className="bg-alabaster-grey-50 rounded-2xl p-4 border border-ink-black-50 flex items-start gap-3 shadow-inner">
                <AlertCircle className="w-4 h-4 text-ink-black-300 mt-0.5 shrink-0" />
                <p className="text-[11px] font-medium text-ink-black-500 leading-relaxed">
                  The current editor contents will be preserved and migrated into this new template profile automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button 
                onClick={onConfirm}
                disabled={!name.trim()}
                className="flex-[2] h-12"
              >
                Create Template
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
