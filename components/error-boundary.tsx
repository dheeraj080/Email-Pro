'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: React.ReactNode;
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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <Card className="max-w-md w-full p-10 flex flex-col items-center text-center space-y-6 border-red-100 shadow-xl shadow-red-500/5">
            <div className="w-16 h-16 bg-red-50 rounded-[32px] flex items-center justify-center text-red-500 shadow-inner">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-ink-black-900">Runtime Exception</h2>
              <p className="text-xs font-medium text-ink-black-400 leading-relaxed">
                An unexpected error occurred while rendering the editor component.
              </p>
            </div>
            <div className="w-full p-4 bg-alabaster-grey-50 rounded-2xl border border-ink-black-50 overflow-hidden">
               <p className="text-[10px] font-mono text-left text-red-600 break-words whitespace-pre-wrap leading-relaxed">
                 {this.state.error?.message}
               </p>
            </div>
            <Button 
              variant="outline" 
              onClick={this.handleReset}
              className="w-full h-12"
            >
              <RotateCcw className="w-4 h-4" />
              Attempt Reconstruction
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
