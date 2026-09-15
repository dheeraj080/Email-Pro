'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, SendHorizontal, Key, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { exportToHTML } from '@/lib/render-email';

interface SendTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  templateName: string;
}

export function SendTestDialog({ isOpen, onClose, code, templateName }: SendTestDialogProps) {
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load API Key and email from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApiKey = localStorage.getItem('email_pro_resend_api_key');
      const savedToEmail = localStorage.getItem('email_pro_test_to_email');
      if (savedApiKey) setApiKey(savedApiKey);
      if (savedToEmail) setToEmail(savedToEmail);
    }
    setSubject(`[Test Draft] ${templateName}`);
  }, [templateName, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim() || !apiKey.trim() || !subject.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsSending(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // 1. Compile the React Email JSX code to inline HTML
      const html = await exportToHTML(code);

      // Save credentials locally for developer convenience
      localStorage.setItem('email_pro_resend_api_key', apiKey);
      localStorage.setItem('email_pro_test_to_email', toEmail);

      // 2. Post directly to Resend's API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Email.Pro Sandbox <onboarding@resend.dev>',
          to: [toEmail.trim()],
          subject: subject.trim(),
          html: html,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.message || `API Error (Status ${response.status})`);
      }
    } catch (err: any) {
      console.error('Send error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to dispatch email request. Check connection.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#07080b]/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 10 }}
        className="bg-[#0c0d12] w-full max-w-md rounded-2xl shadow-2xl border border-[#1f222e] overflow-hidden flex flex-col text-neutral-300"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f222e] flex justify-between items-center bg-[#0c0d12] shrink-0">
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
              <SendHorizontal className="w-4 h-4 text-indigo-400" /> Live Test Dispatcher
            </h3>
            <p className="text-[9px] text-neutral-400 font-semibold tracking-wider block mt-0.5 uppercase">Audit delivery in real clients</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-[#1f222e] bg-[#12141c] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSend} className="p-6 space-y-4">
          
          {status === 'success' && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs font-semibold flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-200">Email sent successfully!</p>
                <p className="text-[10px] text-emerald-400/90 font-medium mt-0.5">Check your inbox. Note: Sandbox free keys can only deliver to your Resend account owner email.</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-200">Failed to send</p>
                <p className="text-[10px] text-rose-400 font-mono mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Receiver Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">To Address</label>
            <Input
              type="email"
              placeholder="e.g. you@example.com"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="h-9 rounded-lg border-[#1f222e] bg-[#07080b] focus-visible:ring-indigo-500 text-xs text-white placeholder-neutral-500"
              required
            />
          </div>

          {/* Subject Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Subject</label>
            <Input
              type="text"
              placeholder="e.g. Onboarding Welcomer"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-9 rounded-lg border-[#1f222e] bg-[#07080b] focus-visible:ring-indigo-500 text-xs text-white placeholder-neutral-500"
              required
            />
          </div>

          {/* Resend API Key Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-indigo-400" /> Resend API Key
              </label>
              <a
                href="https://resend.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
              >
                Get Key for Free <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
            </div>
            <Input
              type="password"
              placeholder="re_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-9 rounded-lg border-[#1f222e] bg-[#07080b] focus-visible:ring-indigo-500 text-xs text-white placeholder-neutral-500 font-mono"
              required
            />
            <p className="text-[8px] text-neutral-400 font-semibold leading-relaxed flex items-start gap-1">
              <HelpCircle className="w-3 h-3 text-neutral-500 shrink-0 mt-0.5" />
              Stored strictly inside your browser&apos;s local storage. Stays completely offline and never sent to our servers.
            </p>
          </div>

          {/* Buttons row */}
          <div className="flex gap-2 pt-2 border-t border-[#1f222e] mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-grow h-9 rounded-lg text-[9px] font-bold uppercase tracking-wider border-[#1f222e] bg-[#12141c] hover:bg-[#1f222e] text-neutral-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSending}
              isLoading={isSending}
              className="flex-grow h-9 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white border-none"
            >
              Send Test Email
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function ArrowUpRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
      style={{ width: '1em', height: '1em' }}
    >
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  );
}
