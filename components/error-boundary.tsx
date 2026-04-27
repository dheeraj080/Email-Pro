'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  className?: string;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary [${this.props.name || 'Component'}]:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={cn(
          "flex flex-col items-center justify-center p-8 min-h-[200px] w-full bg-slate-50 border border-slate-200 rounded-xl text-center",
          this.props.className
        )}>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">
            {this.props.name ? `${this.props.name} failed` : 'Something went wrong'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mb-6 font-mono opacity-80 break-all px-2">
            {this.state.error?.message || 'A catastrophic error occurred'}
          </p>
          <button 
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET COMPONENT
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
