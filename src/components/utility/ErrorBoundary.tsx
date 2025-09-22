"use client";
import React, { Component, ReactNode } from 'react';
import { errorService, ErrorContext } from '../../services/ErrorService';
import { ErrorBox } from '../modules/ErrorBox';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  context?: Partial<ErrorContext>;
  className?: string;
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
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error with context
    const context: ErrorContext = {
      ...this.props.context,
      component: this.props.context?.component || 'ErrorBoundary',
      errorBoundary: true,
      stackTrace: errorInfo.componentStack,
      errorType: 'react_error_boundary',
    };

    errorService.logError(error, context);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className={`error-boundary ${this.props.className || ''}`}>
          <ErrorBox
            heading="Something went wrong"
            copy="An unexpected error occurred. Please refresh the page or try again later."
            headingLevel={2}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;