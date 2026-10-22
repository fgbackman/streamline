import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Assembly Player:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('assembly_page_sections');
      localStorage.removeItem('assembly_cached_videos');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121316] text-neutral-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#18191e] border border-white/10 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto text-xl font-bold font-mono">
              !
            </div>
            <h1 className="text-base font-semibold text-white">Assembly Player Recovery</h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              An unexpected display glitch occurred. Click below to restore default configuration and resume playback instantly.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg transition-colors"
            >
              Reset Configuration & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
