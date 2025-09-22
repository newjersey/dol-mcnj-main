# Centralized Error Handling Documentation

## Overview

This application uses a centralized error handling service to provide consistent error management, logging, and user feedback across the frontend.

## ErrorService

The `ErrorService` is a singleton service that provides standardized methods for handling, displaying, and logging errors.

### Basic Usage

```typescript
import { errorService } from '@services/ErrorService';

// Log an error with context
try {
  // Some operation that might fail
} catch (error) {
  errorService.logError(error, {
    page: 'dashboard',
    component: 'DataTable',
    action: 'load_data',
  });
}

// Show user-friendly error message
errorService.showError('Unable to load data. Please try again.');

// Handle API errors
try {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
} catch (error) {
  const userMessage = errorService.handleApiError(error, '/api/data', {
    page: 'dashboard',
    component: 'DataTable',
  });
  // userMessage contains a user-friendly error message
}
```

### Methods

#### `logError(error: Error, context?: ErrorContext)`
Logs an error with contextual information to console and Sentry.

#### `showError(message: string, context?: ErrorContext)`
Displays a user-friendly error message (currently uses alert, can be replaced with toast).

#### `handleApiError(error: any, endpoint?: string, context?: ErrorContext): string`
Processes API errors and returns user-friendly messages based on HTTP status codes.

#### `logWarning(message: string, context?: ErrorContext)`
Logs warning messages to console and Sentry.

#### `logInfo(message: string, context?: ErrorContext)`
Logs informational messages for debugging.

### Error Context

The `ErrorContext` interface allows you to provide additional metadata with errors:

```typescript
interface ErrorContext {
  page?: string;           // Current page/route
  component?: string;      // Component where error occurred
  action?: string;         // Action that triggered the error
  userId?: string;         // User identifier
  sessionId?: string;      // Session identifier
  timestamp?: string;      // Automatically added
  userAgent?: string;      // Automatically added
  url?: string;           // Automatically added
  [key: string]: any;     // Additional custom properties
}
```

## ErrorBoundary

The `ErrorBoundary` component catches React errors and integrates with the ErrorService.

### Usage

```tsx
import { ErrorBoundary } from '@components/utility/ErrorBoundary';

// Basic usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom context
<ErrorBoundary 
  context={{ 
    page: 'dashboard',
    component: 'MainDashboard'
  }}
>
  <YourComponent />
</ErrorBoundary>

// With custom fallback UI
<ErrorBoundary 
  fallback={<div>Custom error message</div>}
  context={{ page: 'dashboard' }}
>
  <YourComponent />
</ErrorBoundary>

// With custom error handler
<ErrorBoundary 
  onError={(error, errorInfo) => {
    // Custom error handling logic
    console.log('Component crashed:', error);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### Props

- `children`: React components to wrap
- `fallback`: Custom fallback UI (optional)
- `onError`: Custom error handler (optional)
- `context`: Additional error context (optional)
- `className`: CSS class for styling (optional)

## Integration Examples

### API Client Enhancement

The existing GraphQL client (`src/utils/client.ts`) has been enhanced to use the ErrorService:

```typescript
import { errorService } from '../services/ErrorService';

export const client = async ({ query, variables }) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return responseData.data;
  } catch (error) {
    // ErrorService handles the error and returns user-friendly message
    const userMessage = errorService.handleApiError(error, endpoint, {
      component: 'GraphQL Client',
      query: query.substring(0, 100),
      variables: JSON.stringify(variables),
    });

    throw new Error(userMessage);
  }
};
```

### Form Submission

Example from the contact form:

```typescript
const handleFormSubmit = async () => {
  try {
    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Log successful submission
      errorService.logInfo('Contact form submitted successfully', {
        page: 'contact',
        component: 'ContactForm',
        action: 'form_submission',
      });
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    // Handle error with context
    errorService.handleApiError(error, '/api/sendEmail', {
      page: 'contact',
      component: 'ContactForm',
      action: 'form_submission',
    });

    // Show user-friendly error
    errorService.showError('Failed to send your message. Please try again.');
  }
};
```

## Configuration

The ErrorService can be configured with options:

```typescript
import { ErrorService } from '@services/ErrorService';

// Create with custom options
const errorService = ErrorService.getInstance({
  enableConsoleLogging: true,   // Log to console (default: true)
  enableSentryLogging: true,    // Send to Sentry (default: true)
  enableUserNotifications: true // Show user notifications (default: true)
});
```

## Sentry Integration

The ErrorService automatically integrates with Sentry when available. Ensure Sentry is properly initialized in your application:

```javascript
// In your main layout or app initialization
if (window.Sentry) {
  // Sentry is available and will be used by ErrorService
}
```

## Best Practices

1. **Always provide context**: Include page, component, and action information
2. **Use appropriate methods**: 
   - `logError` for exceptions
   - `logWarning` for non-critical issues
   - `logInfo` for debugging information
3. **Wrap components with ErrorBoundary**: Especially for major sections of your app
4. **Handle API errors consistently**: Use `handleApiError` for all API calls
5. **Provide meaningful error messages**: Use `showError` for user-facing messages

## Testing

Both ErrorService and ErrorBoundary include comprehensive test suites. Run tests with:

```bash
npm test src/services/ErrorService.test.ts
npm test src/components/utility/ErrorBoundary.test.tsx
```

## Migration Guide

To migrate existing error handling to use the centralized service:

1. Replace `console.error` calls with `errorService.logError`
2. Replace `alert()` calls with `errorService.showError`
3. Wrap major components with `ErrorBoundary`
4. Update API error handling to use `errorService.handleApiError`
5. Add contextual information to error logging calls