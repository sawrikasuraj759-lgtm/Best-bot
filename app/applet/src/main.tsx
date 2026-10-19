import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020612] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <span className="text-2xl font-bold">YH</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">YASHI HALLS Cloud Interface</h2>
          <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            {this.state.error?.message || 'An unexpected rendering issue occurred. Reloading resolves this.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] transition hover:opacity-90"
          >
            Reload Interface
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Global safety listener for cross-origin unhandled exceptions and unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled Promise rejection intercepted safely:', event.reason);
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    if (event.message === 'Script error.') {
      console.warn('Cross-origin script notice intercepted safely.');
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
