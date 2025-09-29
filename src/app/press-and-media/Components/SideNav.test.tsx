import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  let mockScrollEventListener: ((event: Event) => void) | null = null;

  const mockHeadings = [
    {
      id: "heading-1",
      textContent: "First Heading",
      tagName: "H2",
      offsetTop: 100,
    },
    {
      id: "heading-2",
      textContent: "Second Heading",
      tagName: "H3",
      offsetTop: 300,
    },
    {
      id: "heading-3",
      textContent: "Third Heading",
      tagName: "H2",
      offsetTop: 500,
    },
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
    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 1000,
      writable: true,
    });

    // Mock addEventListener to capture the scroll handler
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = jest
      .fn()
      .mockImplementation((event, handler, options) => {
        if (event === "scroll") {
          mockScrollEventListener = handler as (event: Event) => void;
        }
        return originalAddEventListener.call(window, event, handler, options);
      });

    // Mock removeEventListener
    window.removeEventListener = jest.fn();

    // Mock setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    mockScrollEventListener = null;
  });

  it("renders correctly with label", () => {
    render(<SideNav label="On this page" />);
    expect(screen.getByText("On this page")).toBeInTheDocument();
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
      fireEvent.click(secondLink);

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
    fireEvent.click(toggleButton);
    expect(nav).toHaveClass("absolute");
    expect(nav).not.toHaveClass("hidden");
  });

  it("closes mobile menu when navigation item is clicked", async () => {
    render(<SideNav label="On this page" />);

    // Open mobile menu
    const toggleButton = screen.getByTestId("button");
    fireEvent.click(toggleButton);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("absolute");

    // Click navigation item
    await waitFor(() => {
      const link = screen.getByText("First Heading");
      fireEvent.click(link);

      // Menu should close
      expect(nav).toHaveClass("hidden");
    });
  });

  it("updates current section on scroll", async () => {
    render(<SideNav label="On this page" />);

    await waitFor(() => {
      expect(mockScrollEventListener).toBeTruthy();
    });

    // Simulate scroll to second heading position
    (window as any).scrollY = 350;

    if (mockScrollEventListener) {
      mockScrollEventListener(new Event("scroll"));
    }

    await waitFor(() => {
      const secondLink = screen.getByText("Second Heading").closest("a");
      expect(secondLink).toHaveClass("usa-current");
    });
  });

  it("sets last heading as current when at bottom of page", async () => {
    render(<SideNav label="On this page" />);

    await waitFor(() => {
      expect(mockScrollEventListener).toBeTruthy();
    });

    // Simulate being at bottom of page
    (window as any).scrollY = 210; // innerHeight (800) + scrollY (210) >= scrollHeight (1000) - 10
    (window as any).innerHeight = 800;
    (document.documentElement as any).scrollHeight = 1000;

    if (mockScrollEventListener) {
      mockScrollEventListener(new Event("scroll"));
    }

    await waitFor(() => {
      const lastLink = screen.getByText("Third Heading").closest("a");
      expect(lastLink).toHaveClass("usa-current");
    });
  });

  it("prevents scroll updates during programmatic scrolling", async () => {
    render(<SideNav label="On this page" />);

    await waitFor(() => {
      const link = screen.getByText("Second Heading");
      fireEvent.click(link);
    });

    // During the 1100ms timeout, scroll events should be ignored
    (window as any).scrollY = 100;

    if (mockScrollEventListener) {
      mockScrollEventListener(new Event("scroll"));
    }

    // Current should still be "Second Heading", not changed by scroll
    const secondLink = screen.getByText("Second Heading").closest("a");
    expect(secondLink).toHaveClass("usa-current");

    // Fast-forward timer to end the scroll timeout
    jest.advanceTimersByTime(1100);

    // Now scroll events should work again
    if (mockScrollEventListener) {
      mockScrollEventListener(new Event("scroll"));
    }

    await waitFor(() => {
      const firstLink = screen.getByText("First Heading").closest("a");
      expect(firstLink).toHaveClass("usa-current");
    });
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
});
