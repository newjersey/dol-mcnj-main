"use client";
import React, { ComponentType } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface WithErrorBoundaryOptions {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number | boolean | null | undefined>;
}

/**
 * Higher-order component that wraps a component with an ErrorBoundary
 * 
 * @param Component - The component to wrap
 * @param options - ErrorBoundary configuration options
 * @returns The wrapped component with error boundary protection
 * 
 * @example
 * ```tsx
 * const SafeMyComponent = withErrorBoundary(MyComponent, {
 *   onError: (error, errorInfo) => {
 *     console.error('Component crashed:', error);
 *     // Report to error tracking service
 *   }
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
): ComponentType<P> {
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary {...options}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // Preserve display name for debugging
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}

/**
 * Hook for components that want to trigger error boundary reset
 * 
 * @returns Object with resetError function
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { resetError } = useErrorBoundary();
 *   
 *   const handleRetry = () => {
 *     // Clear any local error state
 *     setLocalError(null);
 *     // Reset the error boundary
 *     resetError();
 *   };
 *   
 *   return <button onClick={handleRetry}>Try Again</button>;
 * }
 * ```
 */
export function useErrorBoundary() {
  const resetError = () => {
    // Dispatch a custom event that ErrorBoundary can listen for
    const event = new CustomEvent('resetErrorBoundary');
    window.dispatchEvent(event);
  };

  return { resetError };
}