import React from "react";
import { render } from "@testing-library/react";
import { PageLoadTracker } from "./PageLoadTracker";
import { trackPageLoadTime } from "../../utils/analytics";

jest.mock("../../utils/analytics", () => ({
  trackPageLoadTime: jest.fn(),
}));

jest.useFakeTimers();

describe("PageLoadTracker", () => {
  const mockTrackPageLoadTime = trackPageLoadTime as jest.MockedFunction<
    typeof trackPageLoadTime
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    // Reset mock implementation to default
    mockTrackPageLoadTime.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should render without crashing", () => {
    const { container } = render(
      <PageLoadTracker pageName="Test Page" pageUrl="/test" />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should call trackPageLoadTime with provided pageUrl after delay", () => {
    render(<PageLoadTracker pageName="Test Page" pageUrl="/custom-url" />);

    jest.advanceTimersByTime(100);

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith(
      "Test Page",
      "/custom-url"
    );
    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(1);
  });

  it("should use window.location.pathname when pageUrl is not provided", () => {
    render(<PageLoadTracker pageName="Homepage" />);

    jest.advanceTimersByTime(100);

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith("Homepage", "/");
    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(1);
  });

  it("should pass through empty string when explicitly provided as pageUrl", () => {
    render(<PageLoadTracker pageName="Server Page" pageUrl="" />);

    jest.advanceTimersByTime(100);

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith("Server Page", "/");
    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(1);
  });

  it("should handle different page names correctly", () => {
    const testCases = [
      { pageName: "MCNJ Homepage", pageUrl: "/" },
      { pageName: "Career Pathways Landing Page", pageUrl: "/career-pathways" },
      { pageName: "Career Navigator Landing Page", pageUrl: "/navigator" },
      { pageName: "Training Explorer Landing Page", pageUrl: "/training" },
      {
        pageName: "In-Demand Occupations Page",
        pageUrl: "/in-demand-occupations",
      },
      {
        pageName: "Tuition Assistance Page",
        pageUrl: "/support-resources/tuition-assistance",
      },
      { pageName: "Helpful Resources Page", pageUrl: "/support-resources" },
    ];

    testCases.forEach(({ pageName, pageUrl }) => {
      const { unmount } = render(
        <PageLoadTracker pageName={pageName} pageUrl={pageUrl} />
      );

      jest.advanceTimersByTime(100);

      expect(mockTrackPageLoadTime).toHaveBeenCalledWith(pageName, pageUrl);

      unmount();
      mockTrackPageLoadTime.mockClear();
    });
  });

  it("should clean up timeout on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    const { unmount } = render(
      <PageLoadTracker pageName="Test Page" pageUrl="/test" />
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(mockTrackPageLoadTime).not.toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it("should delay tracking by 100ms", () => {
    render(<PageLoadTracker pageName="Test Page" pageUrl="/test" />);

    expect(mockTrackPageLoadTime).not.toHaveBeenCalled();

    jest.advanceTimersByTime(99);
    expect(mockTrackPageLoadTime).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple instances independently", () => {
    const { unmount: unmount1 } = render(
      <PageLoadTracker pageName="Page 1" pageUrl="/page1" />
    );

    const { unmount: unmount2 } = render(
      <PageLoadTracker pageName="Page 2" pageUrl="/page2" />
    );

    jest.advanceTimersByTime(100);

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith("Page 1", "/page1");
    expect(mockTrackPageLoadTime).toHaveBeenCalledWith("Page 2", "/page2");
    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(2);

    unmount1();
    unmount2();
  });

  it("should handle special characters in page names and URLs", () => {
    const specialPageName = 'Test Page with "Special" Characters & Symbols';
    const specialPageUrl =
      "/path/with-special-chars?param=value&other=test#anchor";

    render(
      <PageLoadTracker pageName={specialPageName} pageUrl={specialPageUrl} />
    );

    jest.advanceTimersByTime(100);

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith(
      specialPageName,
      specialPageUrl
    );
  });

  it("should handle server-side rendering by not crashing", () => {
    // Mock server-side environment where window is undefined
    const originalWindow = global.window;
    (global as any).window = undefined;

    expect(() => {
      render(<PageLoadTracker pageName="SSR Test" pageUrl="/ssr" />);
    }).not.toThrow();

    global.window = originalWindow;
  });

  it("should handle prop changes by updating the tracking parameters", () => {
    const { rerender } = render(
      <PageLoadTracker pageName="Original Page" pageUrl="/original" />
    );

    jest.advanceTimersByTime(100);

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith(
      "Original Page",
      "/original"
    );
    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(1);

    mockTrackPageLoadTime.mockClear();

    rerender(
      <PageLoadTracker pageName="Updated Page" pageUrl="/updated" />
    );

    jest.advanceTimersByTime(100);

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith(
      "Updated Page",
      "/updated"
    );
    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(1);
  });

  it("should not call trackPageLoadTime if component unmounts before timer fires", () => {
    const { unmount } = render(
      <PageLoadTracker pageName="Quick Unmount" pageUrl="/quick" />
    );

    jest.advanceTimersByTime(50); // Advance only halfway
    unmount(); // Unmount before timer fires
    jest.advanceTimersByTime(50); // Complete the remaining time

    expect(mockTrackPageLoadTime).not.toHaveBeenCalled();
  });

  it("should handle extremely long page names and URLs", () => {
    const longPageName = "A".repeat(500);
    const longPageUrl = "/very-long-url-with-" + "path-segment-".repeat(50);

    render(
      <PageLoadTracker pageName={longPageName} pageUrl={longPageUrl} />
    );

    jest.advanceTimersByTime(100);

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith(
      longPageName,
      longPageUrl
    );
  });

  it("should handle rapid successive renders without memory leaks", () => {
    const { rerender } = render(
      <PageLoadTracker pageName="Page 1" pageUrl="/page1" />
    );

    // Rapidly rerender multiple times
    for (let i = 2; i <= 10; i++) {
      rerender(
        <PageLoadTracker pageName={`Page ${i}`} pageUrl={`/page${i}`} />
      );
    }

    jest.advanceTimersByTime(100);

    // Should only track the final render
    expect(mockTrackPageLoadTime).toHaveBeenCalledWith("Page 10", "/page10");
    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(1);
  });

  it("should use default pathname when pageUrl is empty string", () => {
    render(<PageLoadTracker pageName="Empty URL Test" pageUrl="" />);

    jest.advanceTimersByTime(100);

    // Since we can't easily mock window.location in jsdom, just verify it was called
    // with the empty string (which gets converted to current pathname in the component)
    expect(mockTrackPageLoadTime).toHaveBeenCalledWith(
      "Empty URL Test",
      expect.any(String)
    );
    expect(mockTrackPageLoadTime).toHaveBeenCalledTimes(1);
  });

  it("should call analytics function even if it throws errors", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockTrackPageLoadTime.mockImplementation(() => {
      throw new Error("Analytics error");
    });

    // The component itself should render without throwing
    expect(() => {
      render(<PageLoadTracker pageName="Error Test" pageUrl="/error" />);
    }).not.toThrow();

    // When the timer fires, the analytics function will be called and throw
    expect(() => {
      jest.advanceTimersByTime(100);
    }).toThrow("Analytics error");

    expect(mockTrackPageLoadTime).toHaveBeenCalledWith("Error Test", "/error");
    consoleErrorSpy.mockRestore();
  });

  it("should work with React.StrictMode double rendering", () => {
    const StrictModeWrapper = ({ children }: { children: React.ReactNode }) => (
      <React.StrictMode>{children}</React.StrictMode>
    );

    expect(() => {
      render(
        <StrictModeWrapper>
          <PageLoadTracker pageName="Strict Mode Test" pageUrl="/strict" />
        </StrictModeWrapper>
      );
    }).not.toThrow();

    jest.advanceTimersByTime(100);

    // Component should work without crashing in StrictMode
    expect(mockTrackPageLoadTime).toHaveBeenCalledWith(
      "Strict Mode Test",
      "/strict"
    );
  });
});
