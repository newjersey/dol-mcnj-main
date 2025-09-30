import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { withErrorBoundary, useErrorBoundary } from "./withErrorBoundary";

// Mock the ErrorBoundary component
jest.mock("./ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children, onError, fallback }) => {
    const [hasError, setHasError] = React.useState(false);
    
    if (hasError) {
      return fallback || <div data-testid="error-fallback">Error occurred</div>;
    }
    
    return (
      <div data-testid="error-boundary-wrapper">
        {children}
      </div>
    );
  }),
}));

// Test component
const TestComponent = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div data-testid="test-component">Test component rendered</div>;
};

// Component that uses the useErrorBoundary hook
const ComponentWithHook = () => {
  const { resetError } = useErrorBoundary();
  
  return (
    <button onClick={resetError} data-testid="reset-button">
      Reset Error
    </button>
  );
};

describe("withErrorBoundary", () => {
  it("wraps component with ErrorBoundary", () => {
    const WrappedComponent = withErrorBoundary(TestComponent);
    
    render(<WrappedComponent />);
    
    expect(screen.getByTestId("error-boundary-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("test-component")).toBeInTheDocument();
  });

  it("passes props through to wrapped component", () => {
    interface TestProps {
      message: string;
    }
    
    const PropsTestComponent = ({ message }: TestProps) => (
      <div data-testid="props-test">{message}</div>
    );
    
    const WrappedComponent = withErrorBoundary(PropsTestComponent);
    
    render(<WrappedComponent message="Hello World" />);
    
    expect(screen.getByTestId("props-test")).toHaveTextContent("Hello World");
  });

  it("sets correct display name", () => {
    const NamedComponent = () => <div>Named</div>;
    NamedComponent.displayName = "MyNamedComponent";
    
    const WrappedComponent = withErrorBoundary(NamedComponent);
    
    expect(WrappedComponent.displayName).toBe("withErrorBoundary(MyNamedComponent)");
  });

  it("handles components without display name", () => {
    const AnonymousComponent = () => <div>Anonymous</div>;
    
    const WrappedComponent = withErrorBoundary(AnonymousComponent);
    
    expect(WrappedComponent.displayName).toBe("withErrorBoundary(AnonymousComponent)");
  });

  it("passes options to ErrorBoundary", () => {
    const mockOnError = jest.fn();
    const customFallback = <div data-testid="custom-fallback">Custom error</div>;
    
    const WrappedComponent = withErrorBoundary(TestComponent, {
      onError: mockOnError,
      fallback: customFallback,
      resetOnPropsChange: true,
    });
    
    render(<WrappedComponent />);
    
    // Component should render normally
    expect(screen.getByTestId("error-boundary-wrapper")).toBeInTheDocument();
  });

  it("works with TypeScript generics", () => {
    interface GenericProps {
      value: string;
      onChange: (value: string) => void;
    }
    
    const GenericComponent: React.FC<GenericProps> = ({ value, onChange }) => (
      <input 
        data-testid="generic-input" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    );
    
    const WrappedGeneric = withErrorBoundary(GenericComponent);
    const mockOnChange = jest.fn();
    
    render(<WrappedGeneric value="test" onChange={mockOnChange} />);
    
    expect(screen.getByTestId("generic-input")).toHaveValue("test");
  });
});

describe("useErrorBoundary", () => {
  beforeEach(() => {
    // Clear any existing event listeners
    jest.clearAllMocks();
  });

  it("provides resetError function", () => {
    render(<ComponentWithHook />);
    
    expect(screen.getByTestId("reset-button")).toBeInTheDocument();
  });

  it("dispatches custom event when resetError is called", () => {
    const mockDispatchEvent = jest.spyOn(window, 'dispatchEvent');
    
    render(<ComponentWithHook />);
    
    const resetButton = screen.getByTestId("reset-button");
    resetButton.click();
    
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'resetErrorBoundary'
      })
    );
    
    mockDispatchEvent.mockRestore();
  });

  it("can be used multiple times in same component", () => {
    const MultiHookComponent = () => {
      const errorBoundary1 = useErrorBoundary();
      const errorBoundary2 = useErrorBoundary();
      
      return (
        <div>
          <button onClick={errorBoundary1.resetError} data-testid="reset-1">
            Reset 1
          </button>
          <button onClick={errorBoundary2.resetError} data-testid="reset-2">
            Reset 2
          </button>
        </div>
      );
    };
    
    render(<MultiHookComponent />);
    
    expect(screen.getByTestId("reset-1")).toBeInTheDocument();
    expect(screen.getByTestId("reset-2")).toBeInTheDocument();
  });
});