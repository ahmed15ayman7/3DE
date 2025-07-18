'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@3de/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-primary-main to-primary-dark flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                حدث خطأ ما
              </h2>
              
              <p className="text-gray-600 mb-6">
                عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
              </p>

              {this.state.error && process.env.NODE_ENV === 'development' && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                    تفاصيل الخطأ (للمطورين)
                  </summary>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <div className="space-y-3">
                <Button
                  onClick={this.handleRetry}
                  fullWidth
                  variant="primary"
                >
                  المحاولة مرة أخرى
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/signin'}
                  fullWidth
                  variant="outline"
                >
                  العودة لصفحة تسجيل الدخول
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 