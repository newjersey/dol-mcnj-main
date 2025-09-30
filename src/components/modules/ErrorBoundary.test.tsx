import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorBoundary } from "./ErrorBoundary";

// Mock the SystemError component
jest.mock("./SystemError", () => ({
  SystemError: jest.fn(({ heading, color, copy }) => (
    <div data-testid="system-error">
      <h1>{heading}</h1>
      <span data-testid="error-color">{color}</span>
      <div dangerouslySetInnerHTML={{ __html: copy }} />
    </div>
  )),
}));

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

// Mock console.error to avoid test output noise
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child component</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child component")).toBeInTheDocument();
  });

  it("renders error UI when child component throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("system-error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByTestId("error-color")).toHaveTextContent("orange");
  });

  it("calls onError callback when error occurs", () => {
    const onError = jest.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it("renders custom fallback when provided", () => {
    const CustomFallback = <div data-testid="custom-fallback">Custom error UI</div>;
    
    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.getByText("Custom error UI")).toBeInTheDocument();
    expect(screen.queryByTestId("system-error")).not.toBeInTheDocument();
  });

  it("resets error boundary when resetKeys change", () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={["key1"]}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error should be displayed
    expect(screen.getByTestId("system-error")).toBeInTheDocument();

    // Change resetKeys - should reset the error boundary
    rerender(
      <ErrorBoundary resetKeys={["key2"]}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should show normal content again
    expect(screen.queryByTestId("system-error")).not.toBeInTheDocument();
    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("resets error boundary when resetOnPropsChange is true and props change", () => {
    const { rerender } = render(
      <ErrorBoundary resetOnPropsChange={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error should be displayed
    expect(screen.getByTestId("system-error")).toBeInTheDocument();

    // Change props - should reset the error boundary
    rerender(
      <ErrorBoundary resetOnPropsChange={true} onError={jest.fn()}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should show normal content again
    expect(screen.queryByTestId("system-error")).not.toBeInTheDocument();
    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("displays error details in the fallback UI", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorContent = screen.getByTestId("system-error");
    expect(errorContent.innerHTML).toContain("We're sorry, but something unexpected happened");
    expect(errorContent.innerHTML).toContain("Technical Details");
    expect(errorContent.innerHTML).toContain("Test error");
    expect(errorContent.innerHTML).toContain("Refresh Page");
    expect(errorContent.innerHTML).toContain("Try Again");
  });

  it("includes Sentry integration when available", () => {
    // Mock Sentry on window
    const mockSentry = {
      captureException: jest.fn(),
    };
    (window as any).Sentry = mockSentry;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(mockSentry.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        contexts: {
          react: {
            componentStack: expect.any(String),
          },
        },
      })
    );

    // Cleanup
    delete (window as any).Sentry;
  });

  it("handles multiple error scenarios", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    // No error initially
    expect(screen.getByText("Normal content")).toBeInTheDocument();

    // Trigger error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("system-error")).toBeInTheDocument();
  });

  it("does not reset when resetKeys remain the same", () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={["key1"]}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error should be displayed
    expect(screen.getByTestId("system-error")).toBeInTheDocument();

    // Keep same resetKeys - should NOT reset the error boundary
    rerender(
      <ErrorBoundary resetKeys={["key1"]}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should still show error UI
    expect(screen.getByTestId("system-error")).toBeInTheDocument();
  });
});