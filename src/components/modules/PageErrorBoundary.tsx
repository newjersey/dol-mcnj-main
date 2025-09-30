"use client";
import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { SystemError } from "./SystemError";

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  showRefreshButton?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Specialized ErrorBoundary for page-level error handling
 * Provides a more user-friendly error UI for page crashes
 */
export function PageErrorBoundary({
  children,
  fallbackTitle = "Page Error",
  fallbackMessage = "Sorry, this page encountered an error. Please try refreshing the page or go back to the previous page.",
  showRefreshButton = true,
  onError,
}: PageErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log page-specific error context
    console.error("Page Error:", {
      error: error.message,
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      timestamp: new Date().toISOString(),
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  };

  const customFallback = (
    <div className="container" style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SystemError
        heading={fallbackTitle}
        color="orange"
        copy={`
          <p>${fallbackMessage}</p>
          ${showRefreshButton ? `
            <div style="margin-top: 1.5rem;">
              <button 
                onclick="window.location.reload()" 
                style="background: #005ea2; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; margin-right: 1rem; font-size: 1rem;"
              >
                Refresh Page
              </button>
              <button 
                onclick="window.history.back()" 
                style="background: #757575; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; font-size: 1rem;"
              >
                Go Back
              </button>
            </div>
          ` : ""}
        `}
      />
    </div>
  );

  return (
    <ErrorBoundary
      fallback={customFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}