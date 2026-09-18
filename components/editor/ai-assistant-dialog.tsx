'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Wand2, 
  Tag, 
  Moon, 
  Share2, 
  ShieldCheck, 
  Loader2, 
  Check, 
  ArrowRight,
  AlertCircle,
  Key,
  ExternalLink,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIAssistantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentCode: string;
  onApplyCode: (newCode: string) => void;
}

export function AIAssistantDialog({
  isOpen,
  onClose,
  currentCode,
  onApplyCode,
}: AIAssistantDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [userApiKey, setUserApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('email_pro_gemini_api_key');
      if (savedKey) {
        setUserApiKey(savedKey);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    if (typeof window !== 'undefined') {
      if (userApiKey.trim()) {
        localStorage.setItem('email_pro_gemini_api_key', userApiKey.trim());
      } else {
        localStorage.removeItem('email_pro_gemini_api_key');
      }
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 2000);
    }
  };

  const handleGenerate = async (customAction?: string) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          currentCode,
          actionType: customAction,
          userApiKey: userApiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate email template code');
      }

      setGeneratedResult(data.code);
    } catch (err: any) {
      setError(err.message || 'An error occurred during AI generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyCode(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-backdrop backdrop-blur-md transition-opacity">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
        className="bg-surface w-full max-w-xl rounded-2xl shadow-2xl border border-border-base overflow-hidden flex flex-col text-fg"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-base flex justify-between items-center bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-fg tracking-tight flex items-center gap-2">
                Gemini AI Template Copilot
              </h3>
              <p className="text-[10px] text-fg-muted font-semibold tracking-wider uppercase">
                Generate or refine React Email templates using natural language
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-border-base bg-surface-raised flex items-center justify-center text-fg-muted hover:text-fg transition-all active:scale-[0.94]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* BYOK API Key Collapsible Section */}
          <div className="bg-surface-raised border border-border-base rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-bold text-fg">Gemini API Key (BYOK)</span>
                {userApiKey.trim() ? (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded-md">
                    Custom Key Active
                  </span>
                ) : (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-md">
                    Bring Your Own Key
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-xs text-fg-muted hover:text-fg flex items-center gap-1 font-semibold"
              >
                <span>{showKeyInput ? 'Hide' : 'Configure'}</span>
                {showKeyInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showKeyInput && (
              <div className="space-y-2 pt-2 border-t border-border-base text-xs">
                <p className="text-[11px] text-fg-muted">
                  Enter your Google Gemini API key. It is stored safely in your browser&apos;s local storage and used directly for requests.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="password"
                      value={userApiKey}
                      onChange={(e) => setUserApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-surface border border-border-base focus:border-accent rounded-lg px-3 py-1.5 text-xs text-fg placeholder:text-fg-muted/60 outline-none pr-8 font-mono"
                    />
                    <Lock className="w-3.5 h-3.5 text-fg-muted absolute right-2.5 top-2.5" />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSaveKey}
                    className="bg-surface-hover hover:bg-border-strong text-fg text-xs font-semibold px-3 h-8 rounded-lg border border-border-base"
                  >
                    {keySaved ? <Check className="w-3.5 h-3.5 text-success" /> : 'Save'}
                  </Button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-fg-muted pt-1">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Get a free Gemini API Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {userApiKey && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserApiKey('');
                        if (typeof window !== 'undefined') {
                          localStorage.removeItem('email_pro_gemini_api_key');
                        }
                      }}
                      className="text-danger hover:underline font-semibold"
                    >
                      Clear Key
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Preset AI Quick Actions */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-fg-muted mb-2 block">
              Quick AI Enhancements
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleGenerate('add_discount')}
                disabled={isGenerating}
                className="flex items-center gap-2 p-2.5 bg-surface-raised hover:bg-surface-hover border border-border-base hover:border-accent/40 rounded-xl text-left transition-all active:scale-[0.97] text-xs text-fg-secondary hover:text-fg group"
              >
                <Tag className="w-4 h-4 text-warning shrink-0" />
                <span className="font-medium text-[11px]">Add Promo Code Box</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate('fix_dark_mode')}
                disabled={isGenerating}
                className="flex items-center gap-2 p-2.5 bg-surface-raised hover:bg-surface-hover border border-border-base hover:border-accent/40 rounded-xl text-left transition-all active:scale-[0.97] text-xs text-fg-secondary hover:text-fg group"
              >
                <Moon className="w-4 h-4 text-accent shrink-0" />
                <span className="font-medium text-[11px]">Optimize for Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate('add_social_footer')}
                disabled={isGenerating}
                className="flex items-center gap-2 p-2.5 bg-surface-raised hover:bg-surface-hover border border-border-base hover:border-accent/40 rounded-xl text-left transition-all active:scale-[0.97] text-xs text-fg-secondary hover:text-fg group"
              >
                <Share2 className="w-4 h-4 text-success shrink-0" />
                <span className="font-medium text-[11px]">Add Social & Legal Footer</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate('security_callout')}
                disabled={isGenerating}
                className="flex items-center gap-2 p-2.5 bg-surface-raised hover:bg-surface-hover border border-border-base hover:border-accent/40 rounded-xl text-left transition-all active:scale-[0.97] text-xs text-fg-secondary hover:text-fg group"
              >
                <ShieldCheck className="w-4 h-4 text-danger shrink-0" />
                <span className="font-medium text-[11px]">Add Security Notice</span>
              </button>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
              Custom Prompt or Instruction
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a sleek webinar invitation with speaker bio, countdown timer, and gradient CTA button..."
              className="w-full bg-surface-raised border border-border-base focus:border-accent focus:ring-1 focus:ring-accent rounded-xl p-3 text-xs text-fg placeholder:text-fg-muted/60 font-sans leading-relaxed resize-none transition-all outline-none"
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-danger shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generated Code Preview Summary */}
          {generatedResult && (
            <div className="space-y-2 p-3 bg-surface-raised rounded-xl border border-success/20">
              <div className="flex items-center justify-between text-xs font-bold text-success">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Template Code Ready ({generatedResult.split('\n').length} lines)
                </span>
              </div>
              <pre className="text-[10px] font-mono text-fg-muted max-h-32 overflow-y-auto custom-scrollbar p-2 bg-surface rounded-lg border border-border-base">
                {generatedResult.slice(0, 300)}...
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border-base">
            {generatedResult ? (
              <Button
                onClick={handleApply}
                className="bg-success hover:bg-success/90 text-white text-xs font-bold px-4 h-9 rounded-xl flex items-center gap-2 shadow-sm border-none"
              >
                <span>Apply To Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="bg-accent hover:bg-accent-hover text-accent-fg text-xs font-bold px-4 h-9 rounded-xl flex items-center gap-2 shadow-sm disabled:opacity-50 border-none"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Code...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate Code</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
