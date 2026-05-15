'use client';

import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // In a real app, send to Sentry or similar
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Reloading helps clear potentially corrupted state
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] h-full w-full p-6">
          <Card className="max-w-md w-full p-8 flex flex-col items-center text-center space-y-6 border-amber-100 shadow-2xl bg-white/80 backdrop-blur-sm">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-ink-black-900 italic">Critical System Halt</h2>
              <p className="text-sm font-medium text-ink-black-500 leading-relaxed max-w-[280px] mx-auto">
                The application encountered a fatal rendering error. State might be inconsistent.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="w-full p-4 bg-ink-black-50/50 rounded-xl border border-ink-black-100 overflow-hidden">
                <p className="text-[11px] font-mono text-left text-red-600 break-words whitespace-pre-wrap line-clamp-4 leading-normal">
                  {this.state.error.stack || this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col w-full gap-3">
              <Button 
                variant="primary" 
                onClick={this.handleReset}
                className="w-full h-11 bg-ink-black-900 hover:bg-ink-black-800 text-white rounded-xl transition-all"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Hard Reset Environment
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => typeof window !== 'undefined' && window.history.back()}
                className="w-full h-11 text-ink-black-400 hover:text-ink-black-600 text-xs"
              >
                Go Back to Safety
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
