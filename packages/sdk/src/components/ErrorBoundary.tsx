'use client';

import React, { Component, ReactNode } from 'react';
import { hubClient, isRunningInHub } from '../client';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** Called when an error is caught. Receives the error and error info. */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** If true, automatically report 500 error to hub on unhandled errors. Default: true */
  reportToHub?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[Apollo SDK] Error caught by boundary:', error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Report to hub if enabled (default: true)
    const shouldReport = this.props.reportToHub !== false;
    if (shouldReport && isRunningInHub()) {
      hubClient.reportError(500).catch((err) => {
        console.error('[Apollo SDK] Failed to report error to hub:', err);
      });
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="apollo-error">
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred. Please try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
