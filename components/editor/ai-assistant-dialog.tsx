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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#07080b]/75 backdrop-blur-2xl backdrop-saturate-180 transition-opacity">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
        className="bg-[#0c0d12]/90 apple-glass-panel w-full max-w-xl rounded-2xl shadow-2xl border border-[#1f222e] border-t-white/15 overflow-hidden flex flex-col text-neutral-300"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f222e] flex justify-between items-center bg-[#07080b]/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white tracking-tight apple-display-heading flex items-center gap-2">
                Gemini AI Template Copilot
              </h3>
              <p className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">
                Generate or refine React Email templates using natural language
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-[#1f222e] bg-[#12141c] flex items-center justify-center text-neutral-400 hover:text-white transition-all active:scale-[0.94]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* BYOK API Key Collapsible Section */}
          <div className="bg-[#07080b] border border-[#1f222e] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-bold text-white">Gemini API Key (BYOK)</span>
                {userApiKey.trim() ? (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    Custom Key Active
                  </span>
                ) : (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                    Bring Your Own Key
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-semibold"
              >
                <span>{showKeyInput ? 'Hide' : 'Configure'}</span>
                {showKeyInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showKeyInput && (
              <div className="space-y-2 pt-2 border-t border-[#1f222e] text-xs">
                <p className="text-[11px] text-neutral-400">
                  Enter your Google Gemini API key. It is stored safely in your browser&apos;s local storage and used directly for requests.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="password"
                      value={userApiKey}
                      onChange={(e) => setUserApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-[#12141c] border border-[#1f222e] focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none pr-8 font-mono"
                    />
                    <Lock className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-2.5" />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSaveKey}
                    className="bg-[#1f222e] hover:bg-[#2a2e3d] text-white text-xs font-semibold px-3 h-8 rounded-lg"
                  >
                    {keySaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Save'}
                  </Button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-1">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline flex items-center gap-1 font-bold"
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
                      className="text-rose-400 hover:underline font-semibold"
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
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2 block">
              Quick AI Enhancements
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleGenerate('add_discount')}
                disabled={isGenerating}
                className="flex items-center gap-2 p-2.5 bg-[#07080b] hover:bg-[#12141c] border border-[#1f222e] border-t-white/10 hover:border-indigo-500/40 rounded-xl text-left transition-all active:scale-[0.97] text-xs text-neutral-300 hover:text-white group"
              >
                <Tag className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium text-[11px]">Add Promo Code Box</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate('fix_dark_mode')}
                disabled={isGenerating}
                className="flex items-center gap-2 p-2.5 bg-[#07080b] hover:bg-[#12141c] border border-[#1f222e] border-t-white/10 hover:border-indigo-500/40 rounded-xl text-left transition-all active:scale-[0.97] text-xs text-neutral-300 hover:text-white group"
              >
                <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-medium text-[11px]">Optimize for Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate('add_social_footer')}
                disabled={isGenerating}
                className="flex items-center gap-2 p-2.5 bg-[#07080b] hover:bg-[#12141c] border border-[#1f222e] border-t-white/10 hover:border-indigo-500/40 rounded-xl text-left transition-all active:scale-[0.97] text-xs text-neutral-300 hover:text-white group"
              >
                <Share2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium text-[11px]">Add Social & Legal Footer</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate('security_callout')}
                disabled={isGenerating}
                className="flex items-center gap-2 p-2.5 bg-[#07080b] hover:bg-[#12141c] border border-[#1f222e] border-t-white/10 hover:border-indigo-500/40 rounded-xl text-left transition-all active:scale-[0.97] text-xs text-neutral-300 hover:text-white group"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium text-[11px]">Add Security Notice</span>
              </button>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Custom Prompt or Instruction
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a sleek webinar invitation with speaker bio, countdown timer, and gradient CTA button..."
              className="w-full bg-[#07080b] border border-[#1f222e] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-xs text-white placeholder-neutral-500 font-sans leading-relaxed resize-none transition-all outline-none"
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generated Code Preview Summary */}
          {generatedResult && (
            <div className="space-y-2 p-3 bg-[#07080b] rounded-xl border border-emerald-500/20">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Template Code Ready ({generatedResult.split('\n').length} lines)
                </span>
              </div>
              <pre className="text-[10px] font-mono text-neutral-400 max-h-32 overflow-y-auto custom-scrollbar p-2 bg-[#0c0d12] rounded-lg border border-[#1f222e]">
                {generatedResult.slice(0, 300)}...
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#1f222e]">
            {generatedResult ? (
              <Button
                onClick={handleApply}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 h-9 rounded-xl flex items-center gap-2 shadow-sm"
              >
                <span>Apply To Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                onClick={() => handleGenerate()}
                disabled={isGenerating || (!prompt.trim() && false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 h-9 rounded-xl flex items-center gap-2 shadow-sm disabled:opacity-50"
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
