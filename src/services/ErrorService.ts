/**
 * Centralized Error Handling Service
 * 
 * This service provides standardized methods for handling, displaying, and logging errors
 * throughout the frontend application. It integrates with monitoring services and provides
 * consistent user feedback patterns.
 */

export interface ErrorContext {
  page?: string;
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
  userAgent?: string;
  url?: string;
  [key: string]: any;
}

export interface ErrorServiceOptions {
  enableConsoleLogging?: boolean;
  enableSentryLogging?: boolean;
  enableUserNotifications?: boolean;
}

class ErrorService {
  private static instance: ErrorService;
  private options: ErrorServiceOptions;

  private constructor(options: ErrorServiceOptions = {}) {
    this.options = {
      enableConsoleLogging: true,
      enableSentryLogging: true,
      enableUserNotifications: true,
      ...options,
    };
  }

  public static getInstance(options?: ErrorServiceOptions): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService(options);
    }
    return ErrorService.instance;
  }

  /**
   * Log an error with contextual information
   */
  public logError(error: Error, context?: ErrorContext): void {
    const enrichedContext = this.enrichContext(context);

    if (this.options.enableConsoleLogging) {
      console.error('Frontend Error:', {
        message: error.message,
        stack: error.stack,
        context: enrichedContext,
      });
    }

    if (this.options.enableSentryLogging && this.isSentryAvailable()) {
      try {
        (window as any).Sentry.captureException(error, {
          extra: enrichedContext,
          tags: {
            errorBoundary: context?.component ? 'true' : 'false',
            page: context?.page || 'unknown',
          },
        });
      } catch (sentryError) {
        console.warn('Failed to send error to Sentry:', sentryError);
      }
    }
  }

  /**
   * Display user-friendly error message
   */
  public showError(message: string, context?: ErrorContext): void {
    if (!this.options.enableUserNotifications) {
      return;
    }

    // For now, use alert - this can be replaced with a toast/snackbar system
    // In a real implementation, this would trigger a global notification system
    if (typeof window !== 'undefined') {
      // Check if there's a global notification system available
      const globalNotify = (window as any).showNotification;
      if (globalNotify && typeof globalNotify === 'function') {
        globalNotify({
          type: 'error',
          message,
          duration: 5000,
        });
      } else {
        // Fallback to alert for now
        alert(`Error: ${message}`);
      }
    }

    // Log that we showed an error to the user
    this.logError(new Error(`User notification: ${message}`), {
      ...context,
      notificationType: 'user_error_message',
    });
  }

  /**
   * Handle API errors with standardized processing
   */
  public handleApiError(
    error: any,
    endpoint?: string,
    context?: ErrorContext
  ): string {
    let userMessage = 'An unexpected error occurred. Please try again.';
    let logError: Error;

    if (error?.response) {
      // HTTP error response
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          userMessage = 'Invalid request. Please check your input and try again.';
          break;
        case 401:
          userMessage = 'You are not authorized to perform this action.';
          break;
        case 403:
          userMessage = 'Access denied. You do not have permission for this action.';
          break;
        case 404:
          userMessage = 'The requested resource was not found.';
          break;
        case 429:
          userMessage = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          userMessage = 'Server error. Please try again later.';
          break;
        case 503:
          userMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          userMessage = `An error occurred (${status}). Please try again.`;
      }

      logError = new Error(`API Error: ${status} - ${data?.message || 'Unknown error'}`);
    } else if (error?.message) {
      // Network or other error
      if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        userMessage = 'Network error. Please check your connection and try again.';
      }
      logError = error;
    } else {
      // Unknown error format
      logError = new Error(`Unknown API error: ${JSON.stringify(error)}`);
    }

    // Log the error with API context
    this.logError(logError, {
      ...context,
      endpoint,
      errorType: 'api_error',
      httpStatus: error?.response?.status,
    });

    return userMessage;
  }

  /**
   * Handle non-fatal errors (warnings, info)
   */
  public logWarning(message: string, context?: ErrorContext): void {
    const enrichedContext = this.enrichContext(context);

    if (this.options.enableConsoleLogging) {
      console.warn('Frontend Warning:', {
        message,
        context: enrichedContext,
      });
    }

    if (this.options.enableSentryLogging && this.isSentryAvailable()) {
      try {
        (window as any).Sentry.captureMessage(message, 'warning', {
          extra: enrichedContext,
        });
      } catch (sentryError) {
        console.warn('Failed to send warning to Sentry:', sentryError);
      }
    }
  }

  /**
   * Log info events for debugging
   */
  public logInfo(message: string, context?: ErrorContext): void {
    const enrichedContext = this.enrichContext(context);

    if (this.options.enableConsoleLogging) {
      console.info('Frontend Info:', {
        message,
        context: enrichedContext,
      });
    }

    if (this.options.enableSentryLogging && this.isSentryAvailable()) {
      try {
        (window as any).Sentry.captureMessage(message, 'info', {
          extra: enrichedContext,
        });
      } catch (sentryError) {
        console.warn('Failed to send info to Sentry:', sentryError);
      }
    }
  }

  /**
   * Enrich context with standard information
   */
  private enrichContext(context?: ErrorContext): ErrorContext {
    const baseContext: ErrorContext = {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      ...context,
    };

    return baseContext;
  }

  /**
   * Check if Sentry is available
   */
  private isSentryAvailable(): boolean {
    return typeof window !== 'undefined' && 
           typeof (window as any).Sentry !== 'undefined' &&
           typeof (window as any).Sentry.captureException === 'function';
  }
}

// Export singleton instance and class
export const errorService = ErrorService.getInstance();
export { ErrorService };
export default errorService;