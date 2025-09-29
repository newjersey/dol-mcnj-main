import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { SideNav } from "./SideNav";

// Mock LinkObject component
jest.mock("../../../components/modules/LinkObject", () => ({
  LinkObject: ({ children, onClick, className, url }: any) => (
    <a href={url} onClick={onClick} className={className} data-testid="link-object">
      {children}
    </a>
  ),
}));

// Mock Button component
jest.mock("../../../components/modules/Button", () => ({
  Button: ({ label, onClick, iconSuffix }: any) => (
    <button onClick={onClick} data-testid="button" data-icon={iconSuffix}>
      {label}
    </button>
  ),
}));

// Mock Spinner component
jest.mock("../../../components/modules/Spinner", () => ({
  Spinner: ({ color, size }: any) => (
    <div data-testid="spinner" data-color={color} data-size={size}>
      Loading...
    </div>
  ),
}));

describe("SideNav", () => {
  const mockHeadings = [
    { id: "heading-1", textContent: "First Heading", tagName: "H2", offsetTop: 100 },
    { id: "heading-2", textContent: "Second Heading", tagName: "H3", offsetTop: 600 },
    { id: "heading-3", textContent: "Third Heading", tagName: "H2", offsetTop: 1000 },
  ];

  beforeEach(() => {
    // Mock document.querySelectorAll to return mock headings
    document.querySelectorAll = jest.fn().mockReturnValue(
      mockHeadings.map((heading) => ({
        id: heading.id,
        textContent: heading.textContent,
        tagName: heading.tagName,
      }))
    );

    // Mock document.getElementById
    document.getElementById = jest.fn().mockImplementation((id) => {
      const heading = mockHeadings.find((h) => h.id === id);
      return heading ? { offsetTop: heading.offsetTop } : null;
    });

    // Mock window properties
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, writable: true });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 1500,
      writable: true,
    });

    // Mock addEventListener/removeEventListener
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();

    // Mock setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders correctly with label", () => {
    render(<SideNav label="On this page" />);
    expect(screen.getAllByText("On this page")).toHaveLength(2); // Button and p tag
  });

  it("renders spinner when no headings are found", () => {
    document.querySelectorAll = jest.fn().mockReturnValue([]);
    render(<SideNav label="On this page" />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders navigation items for found headings", async () => {
    render(<SideNav label="On this page" />);
    
    await waitFor(() => {
      expect(screen.getByText("First Heading")).toBeInTheDocument();
      expect(screen.getByText("Second Heading")).toBeInTheDocument();
      expect(screen.getByText("Third Heading")).toBeInTheDocument();
    });
  });

  it("sets first heading as current by default", async () => {
    render(<SideNav label="On this page" />);
    
    await waitFor(() => {
      const firstLink = screen.getByText("First Heading").closest("a");
      expect(firstLink).toHaveClass("usa-current");
    });
  });

  it("handles navigation item click correctly", async () => {
    render(<SideNav label="On this page" />);
    
    await waitFor(() => {
      const secondLink = screen.getByText("Second Heading");
      
      act(() => {
        fireEvent.click(secondLink);
      });
      
      const linkElement = secondLink.closest("a");
      expect(linkElement).toHaveClass("usa-current");
    });
  });

  it("shows/hides mobile navigation menu", async () => {
    render(<SideNav label="On this page" />);
    
    const toggleButton = screen.getByTestId("button");
    expect(toggleButton).toBeInTheDocument();
    
    // Initially navigation should be hidden on mobile
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("hidden");
    
    // Click to open
    act(() => {
      fireEvent.click(toggleButton);
    });
    expect(nav).toHaveClass("absolute");
    expect(nav).not.toHaveClass("hidden");
  });

  it("closes mobile menu when navigation item is clicked", async () => {
    render(<SideNav label="On this page" />);
    
    // Open mobile menu
    const toggleButton = screen.getByTestId("button");
    act(() => {
      fireEvent.click(toggleButton);
    });
    
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("absolute");
    
    // Click navigation item
    await waitFor(() => {
      const link = screen.getByText("First Heading");
      act(() => {
        fireEvent.click(link);
      });
      
      // Menu should close
      expect(nav).toHaveClass("hidden");
    });
  });

  it("adds scroll event listener on mount", () => {
    render(<SideNav label="On this page" />);
    expect(window.addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true }
    );
  });

  it("removes scroll event listener on unmount", () => {
    const { unmount } = render(<SideNav label="On this page" />);
    
    unmount();
    
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("handles empty headings gracefully", () => {
    document.querySelectorAll = jest.fn().mockReturnValue([]);
    
    render(<SideNav label="On this page" />);
    
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByText("First Heading")).not.toBeInTheDocument();
  });

  it("handles timeout after clicking navigation item", async () => {
    render(<SideNav label="On this page" />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText("Second Heading")).toBeInTheDocument();
    });

    const link = screen.getByText("Second Heading");
    
    act(() => {
      fireEvent.click(link);
    });

    // Verify the click worked
    expect(link.closest("a")).toHaveClass("usa-current");

    // Fast-forward the timer
    act(() => {
      jest.advanceTimersByTime(1100);
    });
    
    // Test completes without error
    expect(link.closest("a")).toHaveClass("usa-current");
  });
});