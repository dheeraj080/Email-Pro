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
      const savedApiKey = localStorage.getItem('email_studio_resend_api_key');
      const savedToEmail = localStorage.getItem('email_studio_test_to_email');
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
      localStorage.setItem('email_studio_resend_api_key', apiKey);
      localStorage.setItem('email_studio_test_to_email', toEmail);

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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 10 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h3 className="font-bold text-sm text-slate-800 tracking-tight flex items-center gap-2">
              <SendHorizontal className="w-4 h-4 text-slate-800" /> Live Test Dispatcher
            </h3>
            <p className="text-[9px] text-slate-400 font-semibold tracking-wider block mt-0.5 uppercase">Audit delivery in real clients</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-650 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSend} className="p-6 space-y-4">
          
          {status === 'success' && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200/60 text-emerald-800 rounded-xl text-xs font-semibold flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Email sent successfully!</p>
                <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Check your inbox. Note: Sandbox free keys can only deliver to your Resend account owner email.</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="p-3.5 bg-red-50 border border-red-200/60 text-red-800 rounded-xl text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Failed to send</p>
                <p className="text-[10px] text-red-600 font-mono mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Receiver Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">To Address</label>
            <Input
              type="email"
              placeholder="e.g. you@example.com"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="h-9 rounded-lg border-slate-200 focus-visible:ring-slate-400 text-xs text-slate-800"
              required
            />
          </div>

          {/* Subject Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Subject</label>
            <Input
              type="text"
              placeholder="e.g. Onboarding Welcomer"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-9 rounded-lg border-slate-200 focus-visible:ring-slate-400 text-xs text-slate-800"
              required
            />
          </div>

          {/* Resend API Key Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-slate-400" /> Resend API Key
              </label>
              <a
                href="https://resend.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[9px] font-bold text-slate-400 hover:text-slate-800 flex items-center gap-0.5"
              >
                Get Key for Free <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
            </div>
            <Input
              type="password"
              placeholder="re_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-9 rounded-lg border-slate-200 focus-visible:ring-slate-400 text-xs text-slate-800 font-mono"
              required
            />
            <p className="text-[8px] text-slate-400 font-semibold leading-relaxed flex items-start gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
              Stored strictly inside your browser's local storage. Stays completely offline and never sent to our servers.
            </p>
          </div>

          {/* Buttons row */}
          <div className="flex gap-2 pt-2 border-t border-slate-100 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-grow h-9 rounded-lg text-[9px] font-bold uppercase tracking-wider border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSending}
              isLoading={isSending}
              className="flex-grow h-9 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white"
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
