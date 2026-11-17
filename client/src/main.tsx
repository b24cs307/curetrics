import React, { Component, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './style.css';

class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('CureTrics render failed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="runtime-error" role="alert">
          <span className="eyebrow">CURETRICS / DISPLAY ERROR</span>
          <h1>This page ran into a problem.</h1>
          <p>The error has been logged. Reload the page to try again.</p>
          <button className="button gold" onClick={() => window.location.reload()}>Reload page</button>
        </main>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  const error = new Error('The #root element is missing from index.html.');
  console.error('CureTrics could not mount:', error);
  document.body.innerHTML = '<main class="runtime-error"><h1>CureTrics could not start.</h1><p>The application root element is missing.</p></main>';
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <AppErrorBoundary>
        <Suspense fallback={<main className="app-loading" role="status"><span className="loader-ring"/><p>Preparing your CureTrics experience…</p></main>}>
          <BrowserRouter><App /></BrowserRouter>
        </Suspense>
      </AppErrorBoundary>
    </React.StrictMode>,
  );
}
