'use client';

import React, { Component, ReactNode } from 'react';
import { hubClient, isRunningInHub } from '../client';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
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

    // Report to hub
    if (isRunningInHub()) {
      hubClient.reportError(500);
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
