# React Error Boundary Implementation

This document outlines the comprehensive React Error Boundary system implemented for the My Career NJ application.

## Overview

A robust error boundary system that catches JavaScript errors in React component trees, logs error information, and displays fallback UI instead of crashing the entire application.

## Components

### 1. ErrorBoundary (Core Component)

**Location:** `src/components/modules/ErrorBoundary.tsx`

**Features:**
- Catches and handles React component errors
- Provides customizable fallback UI
- Integrates with error reporting services (Sentry, Google Analytics)
- Supports error boundary reset mechanisms
- Detailed error logging with component stack traces
- Production-ready error handling

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;                    // Custom error UI
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;            // Reset when any prop changes
  resetKeys?: Array<string | number | boolean | null | undefined>; // Reset when these values change
}
```

**Usage:**
```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Component crashed:', error);
    // Report to error tracking service
  }}
>
  <MyComponent />
</ErrorBoundary>
```

### 2. withErrorBoundary (Higher-Order Component)

**Location:** `src/components/modules/withErrorBoundary.tsx`

**Features:**
- HOC that wraps any component with error boundary protection
- Preserves component props and TypeScript types
- Configurable error handling options
- Maintains proper display names for debugging

**Usage:**
```tsx
const SafeMyComponent = withErrorBoundary(MyComponent, {
  onError: (error, errorInfo) => {
    // Custom error handling
  },
  resetOnPropsChange: true
});
```

### 3. PageErrorBoundary (Page-Level Wrapper)

**Location:** `src/components/modules/PageErrorBoundary.tsx`

**Features:**
- Specialized error boundary for page-level errors
- User-friendly error messages and recovery options
- Automatic error context logging (URL, user agent, timestamp)
- Customizable fallback UI with refresh/back buttons

**Usage:**
```tsx
<PageErrorBoundary
  fallbackTitle="Page Unavailable"
  fallbackMessage="This page is temporarily unavailable."
  onError={(error) => trackError(error)}
>
  <PageContent />
</PageErrorBoundary>
```

### 4. useErrorBoundary Hook

**Location:** `src/components/modules/withErrorBoundary.tsx`

**Features:**
- Programmatic error boundary reset
- Custom event-based communication
- Component-level error recovery

**Usage:**
```tsx
function MyComponent() {
  const { resetError } = useErrorBoundary();
  
  const handleRetry = () => {
    // Clear component state
    setError(null);
    // Reset error boundary
    resetError();
  };
  
  return <button onClick={handleRetry}>Try Again</button>;
}
```

## Integration Points

### 1. Application-Level Protection

**Location:** `src/app/layout.tsx`

The root layout includes an ErrorBoundary around the main content area:

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Report to Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }}
>
  <div id="main-content">{children}</div>
</ErrorBoundary>
```

### 2. External Service Integration

**Sentry Integration:**
```typescript
// Automatically detects and reports to Sentry if available
if (typeof window !== "undefined" && (window as any).Sentry) {
  (window as any).Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack,
      },
    },
  });
}
```

**Google Analytics Integration:**
```typescript
// Reports errors as exceptions to GA
if (typeof window !== "undefined" && (window as any).gtag) {
  (window as any).gtag('event', 'exception', {
    description: error.message,
    fatal: false,
  });
}
```

## Error Handling Strategies

### 1. Graceful Degradation
- Components fail individually without affecting the entire app
- Fallback UI maintains application functionality
- User can continue using other parts of the application

### 2. Error Recovery
- Automatic reset mechanisms based on prop changes
- Manual reset through user interaction
- Component-level retry functionality

### 3. Error Reporting
- Detailed error logging with context
- Integration with external monitoring services
- User-friendly error messages

## Best Practices

### 1. Component-Level Protection
```tsx
// Wrap potentially unstable components
const SafeDataVisualization = withErrorBoundary(DataVisualization, {
  onError: (error) => analytics.track('DataViz Error', { error: error.message })
});
```

### 2. Page-Level Protection
```tsx
// Use PageErrorBoundary for route components
export default function TrainingPage() {
  return (
    <PageErrorBoundary fallbackTitle="Training Unavailable">
      <TrainingContent />
    </PageErrorBoundary>
  );
}
```

### 3. Conditional Error Boundaries
```tsx
// Only wrap in development or for specific features
const WrappedComponent = process.env.NODE_ENV === 'development' 
  ? withErrorBoundary(MyComponent)
  : MyComponent;
```

## Testing

### 1. Unit Tests
**Location:** `src/components/modules/ErrorBoundary.test.tsx`

- Tests error catching and fallback UI rendering
- Verifies error callback invocation
- Tests reset mechanisms and prop changes
- Validates external service integration

### 2. HOC Tests
**Location:** `src/components/modules/withErrorBoundary.test.tsx`

- Tests component wrapping and prop passing
- Verifies TypeScript type preservation
- Tests display name handling

### 3. Test Utilities
```tsx
// Component that throws errors for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};
```

## Error Boundary Placement Strategy

### 1. Application Level
- **Location:** Root layout
- **Purpose:** Catch any unhandled errors app-wide
- **Fallback:** Full-page error message with refresh option

### 2. Page Level
- **Location:** Individual route components
- **Purpose:** Handle page-specific errors
- **Fallback:** Page-specific error message with navigation options

### 3. Component Level
- **Location:** Complex or unstable components
- **Purpose:** Isolate component failures
- **Fallback:** Component-specific error message or alternative UI

### 4. Feature Level
- **Location:** Major feature components (forms, data displays)
- **Purpose:** Prevent feature failures from affecting other features
- **Fallback:** Feature-specific error handling

## File Structure

```
src/components/modules/
├── ErrorBoundary.tsx              # Core error boundary component
├── ErrorBoundary.test.tsx         # Core component tests
├── withErrorBoundary.tsx          # HOC and hook utilities
├── withErrorBoundary.test.tsx     # HOC and hook tests
├── PageErrorBoundary.tsx          # Page-level error boundary
└── ...

src/app/
├── layout.tsx                     # App-level error boundary integration
└── ...
```

## Benefits

1. **Improved User Experience:** Graceful error handling prevents app crashes
2. **Better Debugging:** Detailed error information and stack traces
3. **Monitoring Integration:** Automatic error reporting to external services
4. **Recovery Mechanisms:** Users can recover from errors without page reload
5. **Component Isolation:** Individual component failures don't affect entire app
6. **Production Ready:** Comprehensive error handling for production environments

## Maintenance

### Regular Tasks:
1. Monitor error reports from external services
2. Update fallback UI based on user feedback
3. Adjust error boundary placement based on error patterns
4. Review and update error reporting integration
5. Test error boundary behavior with new components

### When Errors Occur:
1. Review error reports and stack traces
2. Identify root causes of component failures
3. Implement fixes or improve error handling
4. Update fallback UI if needed
5. Consider additional error boundary placement

This error boundary system provides comprehensive error handling while maintaining a smooth user experience and enabling effective error monitoring and debugging.