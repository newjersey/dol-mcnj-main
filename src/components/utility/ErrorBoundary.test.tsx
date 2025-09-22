import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';
import { ErrorService } from '../../services/ErrorService';

// Mock the ErrorService
jest.mock('../../services/ErrorService', () => ({
  ErrorService: {
    getInstance: jest.fn(() => ({
      logError: jest.fn(),
    })),
  },
  errorService: {
    logError: jest.fn(),
  },
}));

// Mock the ErrorBox component
jest.mock('../modules/ErrorBox', () => ({
  ErrorBox: jest.fn(({ heading, copy }) => (
    <div data-testid="error-box">
      <h2>{heading}</h2>
      <p>{copy}</p>
    </div>
  )),
}));

// Test component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  const mockErrorService = {
    logError: jest.fn(),
  };

  beforeEach(() => {
    mockErrorService.logError.mockClear();
    (require('../../services/ErrorService').errorService.logError as jest.Mock).mockClear();
    
    // Suppress console.error for these tests since we expect errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('error-box')).not.toBeInTheDocument();
  });

  it('renders default error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-box')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Please refresh the page or try again later.')).toBeInTheDocument();
  });

  it('renders custom fallback UI when error occurs', () => {
    const customFallback = <div data-testid="custom-fallback">Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByTestId('error-box')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <ErrorBoundary className="custom-error-class">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorBoundaryDiv = container.querySelector('.error-boundary');
    expect(errorBoundaryDiv).toHaveClass('custom-error-class');
  });

  it('calls ErrorService.logError when error occurs', () => {
    const testError = new Error('Test error');
    
    render(
      <ErrorBoundary context={{ page: 'test-page', component: 'TestComponent' }}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(require('../../services/ErrorService').errorService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        page: 'test-page',
        component: 'TestComponent',
        errorBoundary: true,
        stackTrace: expect.any(String),
        errorType: 'react_error_boundary',
      })
    );
  });

  it('calls custom onError handler when provided', () => {
    const mockOnError = jest.fn();

    render(
      <ErrorBoundary onError={mockOnError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(mockOnError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('uses default component name when not provided in context', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(require('../../services/ErrorService').errorService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        component: 'ErrorBoundary',
        errorBoundary: true,
        errorType: 'react_error_boundary',
      })
    );
  });

  it('merges provided context with error boundary context', () => {
    const customContext = {
      page: 'test-page',
      userId: 'user123',
      customProperty: 'customValue',
    };

    render(
      <ErrorBoundary context={customContext}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(require('../../services/ErrorService').errorService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        ...customContext,
        component: 'ErrorBoundary',
        errorBoundary: true,
        stackTrace: expect.any(String),
        errorType: 'react_error_boundary',
      })
    );
  });
});