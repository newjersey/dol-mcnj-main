import { logEvent, trackPageLoadTime } from "./analytics";

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

const originalReadyState = document.readyState;

afterEach(() => {
  consoleLogSpy.mockClear();
  delete (window as any).gtag;
  delete (window as any).dataLayer;
  delete (window as any).performance;
});

afterAll(() => {
  consoleLogSpy.mockRestore();
});

describe("logEvent", () => {
  it("should call gtag when available", () => {
    const mockGtag = jest.fn();
    (window as any).gtag = mockGtag;

    logEvent("test-category", "test-action", "test-label");

    expect(mockGtag).toHaveBeenCalledWith("event", "test-action", {
      event_category: "test-category",
      event_label: "test-label",
    });
  });

  it("should handle undefined label", () => {
    const mockGtag = jest.fn();
    (window as any).gtag = mockGtag;

    logEvent("test-category", "test-action", undefined);

    expect(mockGtag).toHaveBeenCalledWith("event", "test-action", {
      event_category: "test-category",
      event_label: undefined,
    });
  });

  it("should not throw when gtag is not available", () => {
    expect(() => {
      logEvent("test-category", "test-action", "test-label");
    }).not.toThrow();
  });
});

describe("trackPageLoadTime", () => {
  it("should return early when window is undefined", () => {
    const originalWindow = global.window;
    (global as any).window = undefined;

    expect(() => {
      trackPageLoadTime("Test Page", "/test");
    }).not.toThrow();

    global.window = originalWindow;
  });

  it("should handle missing performance API gracefully", () => {
    const originalPerformance = window.performance;
    (window as any).performance = undefined;

    expect(() => {
      trackPageLoadTime("Test Page", "/test");
    }).not.toThrow();

    (window as any).performance = originalPerformance;
  });

  it("should set up event listener when document is not complete", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    Object.defineProperty(document, "readyState", {
      value: "loading",
      writable: true,
      configurable: true,
    });

    trackPageLoadTime("Test Page", "/test");

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "load",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();

    Object.defineProperty(document, "readyState", {
      value: originalReadyState,
      writable: true,
      configurable: true,
    });
  });

  it("should track all 7 specified pages without errors", () => {
    const testPages = [
      { name: "MCNJ Homepage", url: "/" },
      { name: "Career Pathways Landing Page", url: "/career-pathways" },
      { name: "Career Navigator Landing Page", url: "/navigator" },
      { name: "Training Explorer Landing Page", url: "/training" },
      { name: "In-Demand Occupations Page", url: "/in-demand-occupations" },
      {
        name: "Tuition Assistance Page",
        url: "/support-resources/tuition-assistance",
      },
      { name: "Helpful Resources Page", url: "/support-resources" },
    ];

    testPages.forEach((page) => {
      expect(() => {
        trackPageLoadTime(page.name, page.url);
      }).not.toThrow();
    });
  });

  it("should call gtag when performance timing is available", () => {
    const mockGtag = jest.fn();
    const mockDataLayer: any[] = [];

    Object.defineProperty(window, "gtag", {
      value: mockGtag,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, "dataLayer", {
      value: mockDataLayer,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, "performance", {
      value: {
        timing: {
          navigationStart: 1000,
          loadEventEnd: 2500,
        },
      },
      writable: true,
      configurable: true,
    });

    trackPageLoadTime("Test Page", "/test");

    expect(mockGtag).toHaveBeenCalledWith(
      "event",
      "timing_complete",
      expect.objectContaining({
        name: "page_load_time",
        value: 1500,
        event_category: "Page Load Performance",
        event_label: "Test Page - /test",
        custom_map: { metric1: 1500 },
      })
    );

    expect(mockDataLayer).toContainEqual(
      expect.objectContaining({
        event: "page_load_time_tracked",
        page_name: "Test Page",
        page_url: "/test",
        load_time_ms: 1500,
      })
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Page Load Time Tracked: Test Page loaded in 1500ms"
    );
  });
});
