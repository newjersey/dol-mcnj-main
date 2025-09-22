import { ErrorService, ErrorContext, ErrorServiceOptions } from './ErrorService';

// Mock Sentry
const mockSentry = {
  captureException: jest.fn(),
  captureMessage: jest.fn(),
};

// Mock window object
const mockLocation = {
  href: 'https://test.example.com/page',
};

const mockNavigator = {
  userAgent: 'Test User Agent',
};

// Store original values
const originalLocation = window.location;
const originalNavigator = window.navigator;

describe('ErrorService', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset Sentry mocks
    mockSentry.captureException.mockClear();
    mockSentry.captureMessage.mockClear();
    
    // Mock console methods
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    
    // Mock alert
    alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    
    // Set up window mocks
    delete (window as any).location;
    delete (window as any).navigator;
    (window as any).location = mockLocation;
    (window as any).navigator = mockNavigator;
    
    // Set up Sentry mock
    (window as any).Sentry = mockSentry;
    
    // Reset singleton instance for each test
    (ErrorService as any).instance = undefined;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    alertSpy.mockRestore();
    
    // Restore original window properties
    delete (window as any).location;
    delete (window as any).navigator;
    (window as any).location = originalLocation;
    (window as any).navigator = originalNavigator;
    
    delete (window as any).Sentry;
    
    // Reset singleton instance for next test
    (ErrorService as any).instance = undefined;
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = ErrorService.getInstance();
      const instance2 = ErrorService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('logError', () => {
    it('should log errors to console by default', () => {
      const errorService = ErrorService.getInstance();
      const testError = new Error('Test error');
      const context: ErrorContext = { page: 'test-page', component: 'TestComponent' };

      errorService.logError(testError, context);

      // Just check that console.error was called with the correct message
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Frontend Error:',
        expect.objectContaining({
          message: 'Test error',
          context: expect.objectContaining({
            page: 'test-page',
            component: 'TestComponent',
          }),
        })
      );
    });

    it('should send errors to Sentry when available', () => {
      const errorService = ErrorService.getInstance();
      const testError = new Error('Test error');
      const context: ErrorContext = { page: 'test-page' };

      errorService.logError(testError, context);

      expect(mockSentry.captureException).toHaveBeenCalledWith(testError, {
        extra: expect.objectContaining({
          page: 'test-page',
          timestamp: expect.any(String),
        }),
        tags: {
          errorBoundary: 'false',
          page: 'test-page',
        },
      });
    });

    it('should handle Sentry errors gracefully', () => {
      mockSentry.captureException.mockImplementation(() => {
        throw new Error('Sentry error');
      });

      const errorService = ErrorService.getInstance();
      const testError = new Error('Test error');

      expect(() => {
        errorService.logError(testError);
      }).not.toThrow();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to send error to Sentry:',
        expect.any(Error)
      );
    });
  });

  describe('showError', () => {
    it('should show alert by default', () => {
      const errorService = ErrorService.getInstance();
      errorService.showError('Test user message');

      expect(alertSpy).toHaveBeenCalledWith('Error: Test user message');
    });

    it('should use global notification system if available', () => {
      const mockShowNotification = jest.fn();
      (window as any).showNotification = mockShowNotification;

      const errorService = ErrorService.getInstance();
      errorService.showError('Test user message');

      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        message: 'Test user message',
        duration: 5000,
      });

      expect(alertSpy).not.toHaveBeenCalled();

      delete (window as any).showNotification;
    });

    it('should not show notifications when disabled', () => {
      const errorService = ErrorService.getInstance({ enableUserNotifications: false });
      errorService.showError('Test user message');

      expect(alertSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleApiError', () => {
    it('should handle HTTP status codes correctly', () => {
      const errorService = ErrorService.getInstance();

      const testCases = [
        { status: 400, expectedMessage: 'Invalid request. Please check your input and try again.' },
        { status: 401, expectedMessage: 'You are not authorized to perform this action.' },
        { status: 403, expectedMessage: 'Access denied. You do not have permission for this action.' },
        { status: 404, expectedMessage: 'The requested resource was not found.' },
        { status: 429, expectedMessage: 'Too many requests. Please wait a moment and try again.' },
        { status: 500, expectedMessage: 'Server error. Please try again later.' },
        { status: 503, expectedMessage: 'Service temporarily unavailable. Please try again later.' },
      ];

      testCases.forEach(({ status, expectedMessage }) => {
        const apiError = {
          response: {
            status,
            data: { message: 'API error message' },
          },
        };

        const result = errorService.handleApiError(apiError, '/test/endpoint');
        expect(result).toBe(expectedMessage);
      });
    });

    it('should handle network errors', () => {
      const errorService = ErrorService.getInstance();
      const networkError = new Error('Network Error');

      const result = errorService.handleApiError(networkError, '/test/endpoint');
      expect(result).toBe('Network error. Please check your connection and try again.');
    });

    it('should handle unknown errors', () => {
      const errorService = ErrorService.getInstance();
      const unknownError = { someProperty: 'unknown error' };

      const result = errorService.handleApiError(unknownError, '/test/endpoint');
      expect(result).toBe('An unexpected error occurred. Please try again.');
    });

    it('should log API errors with context', () => {
      const errorService = ErrorService.getInstance();
      const apiError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };

      errorService.handleApiError(apiError, '/test/endpoint', { page: 'test-page' });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Frontend Error:', {
        message: 'API Error: 500 - Internal server error',
        stack: expect.any(String),
        context: expect.objectContaining({
          endpoint: '/test/endpoint',
          page: 'test-page',
          errorType: 'api_error',
          httpStatus: 500,
        }),
      });
    });
  });

  describe('logWarning', () => {
    it('should log warnings to console', () => {
      const errorService = ErrorService.getInstance();
      errorService.logWarning('Test warning', { component: 'TestComponent' });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Frontend Warning:', {
        message: 'Test warning',
        context: expect.objectContaining({
          component: 'TestComponent',
          timestamp: expect.any(String),
        }),
      });
    });

    it('should send warnings to Sentry', () => {
      const errorService = ErrorService.getInstance();
      errorService.logWarning('Test warning');

      expect(mockSentry.captureMessage).toHaveBeenCalledWith(
        'Test warning',
        'warning',
        {
          extra: expect.objectContaining({
            timestamp: expect.any(String),
          }),
        }
      );
    });
  });

  describe('logInfo', () => {
    it('should log info messages to console', () => {
      const errorService = ErrorService.getInstance();
      errorService.logInfo('Test info', { action: 'test-action' });

      expect(consoleInfoSpy).toHaveBeenCalledWith('Frontend Info:', {
        message: 'Test info',
        context: expect.objectContaining({
          action: 'test-action',
          timestamp: expect.any(String),
        }),
      });
    });

    it('should send info messages to Sentry', () => {
      const errorService = ErrorService.getInstance();
      errorService.logInfo('Test info');

      expect(mockSentry.captureMessage).toHaveBeenCalledWith(
        'Test info',
        'info',
        {
          extra: expect.objectContaining({
            timestamp: expect.any(String),
          }),
        }
      );
    });
  });

  describe('Sentry integration', () => {
    it('should handle missing Sentry gracefully', () => {
      delete (window as any).Sentry;
      
      const errorService = ErrorService.getInstance();
      const testError = new Error('Test error');

      expect(() => {
        errorService.logError(testError);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Configuration options', () => {
    it('should respect console logging disable option', () => {
      const errorService = ErrorService.getInstance({ enableConsoleLogging: false });
      const testError = new Error('Test error');

      errorService.logError(testError);

      // Should not have called console.error with our Frontend Error message
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        'Frontend Error:',
        expect.any(Object)
      );
    });

    it('should respect Sentry logging disable option', () => {
      const errorService = ErrorService.getInstance({ enableSentryLogging: false });
      const testError = new Error('Test error');

      errorService.logError(testError);

      expect(mockSentry.captureException).not.toHaveBeenCalled();
    });
  });
});