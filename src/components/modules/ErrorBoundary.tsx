"use client";
import React, { Component, ReactNode } from "react";
import { SystemError } from "./SystemError";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number | boolean | null | undefined>;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to our error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to external error tracking services if available
    if (typeof window !== "undefined") {
      // Report to Sentry if available
      if ((window as any).Sentry) {
        (window as any).Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
          },
        });
      }

      // Report to Google Analytics if available
      if ((window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: false,
        });
      }
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when resetKeys change
    if (hasError && resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => {
        const prevKey = prevProps.resetKeys?.[index];
        return key !== prevKey;
      });

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }

    // Reset error boundary when any prop changes (if enabled)
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    // Clear any pending reset timeout
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  handleRetry = () => {
    // Add a small delay before resetting to prevent rapid retry loops
    this.resetTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary();
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <SystemError
            heading="Something went wrong"
            color="orange"
            copy={`
              <p>We're sorry, but something unexpected happened. This error has been reported to our team.</p>
              <details style="margin-top: 1rem;">
                <summary style="cursor: pointer; margin-bottom: 0.5rem;">Technical Details</summary>
                <div style="background: #f5f5f5; padding: 1rem; border-radius: 4px; font-family: monospace; font-size: 0.875rem; white-space: pre-wrap; margin-top: 0.5rem;">
                  <strong>Error:</strong> ${this.state.error?.message || "Unknown error"}
                  ${this.state.error?.stack ? `\n\n<strong>Stack Trace:</strong>\n${this.state.error.stack}` : ""}
                  ${this.state.errorInfo?.componentStack ? `\n\n<strong>Component Stack:</strong>\n${this.state.errorInfo.componentStack}` : ""}
                </div>
              </details>
              <div style="margin-top: 1.5rem;">
                <button 
                  onclick="window.location.reload()" 
                  style="background: #0066cc; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; margin-right: 1rem;"
                >
                  Refresh Page
                </button>
                <button 
                  onclick="this.closest('.error-boundary').dispatchEvent(new CustomEvent('retry'))" 
                  style="background: #666; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;"
                >
                  Try Again
                </button>
              </div>
            `}
          />
        </div>
      );
    }

    return this.props.children;
  }

  componentDidMount() {
    // Listen for retry events from the fallback UI
    if (typeof window !== "undefined") {
      const handleRetryEvent = () => {
        this.handleRetry();
      };

      document.addEventListener("retry", handleRetryEvent);

      // Cleanup listener on unmount
      return () => {
        document.removeEventListener("retry", handleRetryEvent);
      };
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }
}