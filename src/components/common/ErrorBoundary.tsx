import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Copy, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, copied: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CyberOptix Uncaught Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleCopyError = () => {
    const errorDetails = `${this.state.error?.toString()}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorDetails);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 3000);
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-6 text-text font-sans">
          <div className="bg-card w-full max-w-xl p-8 rounded-lg shadow-2xl border border-line space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-crimson/10 text-crimson border border-crimson/20">
                <AlertOctagon size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif text-ink m-0">Application Recovery State</h1>
                <p className="text-xs text-sub m-0 mt-0.5">An unexpected exception was safely intercepted by the CyberOptix Error Boundary.</p>
              </div>
            </div>

            <div className="p-4 rounded bg-paper border border-line text-xs font-mono text-crimson overflow-x-auto">
              {this.state.error?.toString() || 'Unknown runtime error'}
            </div>

            <div className="text-xs text-sub leading-relaxed">
              No financial data or model state was corrupted. You can reload the application workspace or copy the cryptographic incident trace for enterprise support.
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-line">
              <button
                onClick={this.handleCopyError}
                className="px-3.5 py-2 rounded text-xs font-medium border border-line bg-card hover:bg-paper text-sub hover:text-ink flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {this.state.copied ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
                <span>{this.state.copied ? 'Copied Trace' : 'Copy Error Details'}</span>
              </button>

              <button
                onClick={this.handleReload}
                className="px-5 py-2 rounded text-xs font-semibold bg-ink hover:bg-slate-900 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Reload Application Workspace</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
