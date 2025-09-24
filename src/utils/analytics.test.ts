import { logEvent, trackPageLoadTime, generateSmartPageName, formatSlugToTitle, formatPathToTitle } from "./analytics";

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

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
      value: "complete",
      writable: true,
      configurable: true,
    });
  });

  it("should handle document.readyState being 'interactive'", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    Object.defineProperty(document, "readyState", {
      value: "interactive",
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
      value: "complete",
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

  it("should handle negative load times by not sending events", () => {
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
          navigationStart: 2500,
          loadEventEnd: 1000, // Earlier than navigation start = negative load time
        },
      },
      writable: true,
      configurable: true,
    });

    trackPageLoadTime("Test Page", "/test");

    expect(mockGtag).not.toHaveBeenCalled();
    expect(mockDataLayer).toHaveLength(0);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should handle zero load times by not sending events", () => {
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
          loadEventEnd: 1000, // Same as navigation start = zero load time
        },
      },
      writable: true,
      configurable: true,
    });

    trackPageLoadTime("Test Page", "/test");

    expect(mockGtag).not.toHaveBeenCalled();
    expect(mockDataLayer).toHaveLength(0);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should use Navigation Timing API Level 2 as fallback", () => {
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
        timing: undefined, // No Level 1 timing
        getEntriesByType: jest.fn().mockReturnValue([
          {
            fetchStart: 1000,
            loadEventEnd: 2300.5,
          },
        ]),
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
        value: 1301, // Math.round(1300.5)
        event_category: "Page Load Performance",
        event_label: "Test Page - /test",
      })
    );

    expect(mockDataLayer).toContainEqual(
      expect.objectContaining({
        event: "page_load_time_tracked",
        page_name: "Test Page",
        page_url: "/test",
        load_time_ms: 1301,
        load_time_seconds: 1.3,
      })
    );
  });

  it("should handle empty navigation entries array", () => {
    const mockGtag = jest.fn();
    const mockDataLayer: any[] = [];

    Object.defineProperty(window, "performance", {
      value: {
        timing: undefined,
        getEntriesByType: jest.fn().mockReturnValue([]), // Empty array
      },
      writable: true,
      configurable: true,
    });

    trackPageLoadTime("Test Page", "/test");

    expect(mockGtag).not.toHaveBeenCalled();
    expect(mockDataLayer).toHaveLength(0);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should work when only dataLayer is available (no gtag)", () => {
    const mockDataLayer: any[] = [];

    Object.defineProperty(window, "dataLayer", {
      value: mockDataLayer,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, "performance", {
      value: {
        timing: {
          navigationStart: 1000,
          loadEventEnd: 2000,
        },
      },
      writable: true,
      configurable: true,
    });

    trackPageLoadTime("Test Page", "/test");

    expect(mockDataLayer).toContainEqual(
      expect.objectContaining({
        event: "page_load_time_tracked",
        page_name: "Test Page",
        page_url: "/test",
        load_time_ms: 1000,
        load_time_seconds: 1,
      })
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Page Load Time Tracked: Test Page loaded in 1000ms"
    );
  });

  it("should work when only gtag is available (no dataLayer)", () => {
    const mockGtag = jest.fn();

    Object.defineProperty(window, "gtag", {
      value: mockGtag,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, "performance", {
      value: {
        timing: {
          navigationStart: 1000,
          loadEventEnd: 1800,
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
        value: 800,
        event_category: "Page Load Performance",
        event_label: "Test Page - /test",
        custom_map: { metric1: 800 },
      })
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Page Load Time Tracked: Test Page loaded in 800ms"
    );
  });

  it("should handle special characters in page names and URLs correctly", () => {
    const mockGtag = jest.fn();
    const specialPageName = 'Page with "quotes" & symbols <>';
    const specialPageUrl = "/path/with-special-chars?param=value&other=test#anchor";

    Object.defineProperty(window, "gtag", {
      value: mockGtag,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, "performance", {
      value: {
        timing: {
          navigationStart: 1000,
          loadEventEnd: 2000,
        },
      },
      writable: true,
      configurable: true,
    });

    trackPageLoadTime(specialPageName, specialPageUrl);

    expect(mockGtag).toHaveBeenCalledWith(
      "event",
      "timing_complete",
      expect.objectContaining({
        event_label: `${specialPageName} - ${specialPageUrl}`,
      })
    );
  });
});

describe('formatSlugToTitle', () => {
  it('should convert slug to title case', () => {
    expect(formatSlugToTitle('career-pathways')).toBe('Career Pathways');
    expect(formatSlugToTitle('training-programs')).toBe('Training Programs');
    expect(formatSlugToTitle('single-word')).toBe('Single Word');
    expect(formatSlugToTitle('single')).toBe('Single');
  });

  it('should handle empty or invalid input', () => {
    expect(formatSlugToTitle('')).toBe('');
    expect(formatSlugToTitle('   ')).toBe('   ');
  });

  it('should handle special cases', () => {
    expect(formatSlugToTitle('web-development-101')).toBe('Web Development 101');
    expect(formatSlugToTitle('a-b-c-d')).toBe('A B C D');
  });
});

describe('formatPathToTitle', () => {
  it('should convert single segment paths to titles', () => {
    expect(formatPathToTitle('/about')).toBe('About');
    expect(formatPathToTitle('/training')).toBe('Training');
    expect(formatPathToTitle('/support-resources')).toBe('Support Resources');
    expect(formatPathToTitle('/career-pathways')).toBe('Career Pathways');
  });

  it('should handle root path', () => {
    expect(formatPathToTitle('/')).toBe('Home');
  });

  it('should handle multi-segment paths', () => {
    expect(formatPathToTitle('/support-resources/tuition-assistance')).toBe('Support Resources Tuition Assistance');
    expect(formatPathToTitle('/training/web-development')).toBe('Training Web Development');
    expect(formatPathToTitle('/deep/nested/path')).toBe('Deep Nested Path');
  });

  it('should handle paths with query parameters', () => {
    expect(formatPathToTitle('/training?category=tech')).toBe('Training');
    expect(formatPathToTitle('/programs/web-dev?id=123')).toBe('Programs Web Dev');
  });

  it('should handle paths with fragments', () => {
    expect(formatPathToTitle('/about#section')).toBe('About');
    expect(formatPathToTitle('/training/details#overview')).toBe('Training Details');
  });

  it('should handle empty or invalid paths', () => {
    expect(formatPathToTitle('')).toBe('Home');
    expect(formatPathToTitle('   ')).toBe('Page');
    expect(formatPathToTitle('invalid-path')).toBe('Invalid Path');
  });
});

describe('generateSmartPageName', () => {
  it('should generate names for static routes using exact manual tracking names', () => {
    expect(generateSmartPageName('/')).toBe('MCNJ Homepage');
    expect(generateSmartPageName('/career-pathways')).toBe('Career Pathways Landing Page');
    expect(generateSmartPageName('/navigator')).toBe('Career Navigator Landing Page');
    expect(generateSmartPageName('/training')).toBe('Training Explorer Landing Page');
    expect(generateSmartPageName('/support-resources')).toBe('Helpful Resources Page');
    expect(generateSmartPageName('/in-demand-occupations')).toBe('In-Demand Occupations Page');
    expect(generateSmartPageName('/support-resources/tuition-assistance')).toBe('Tuition Assistance Page');
  });

  it('should detect dynamic program routes and generate appropriate names', () => {
    expect(generateSmartPageName('/programs/web-development')).toBe('Program Details');
    expect(generateSmartPageName('/programs/123')).toBe('Program Details');
    expect(generateSmartPageName('/programs/career-change-program')).toBe('Program Details');
  });

  it('should handle nested dynamic program routes', () => {
    expect(generateSmartPageName('/training/programs/web-dev')).toBe('Training Program Details');
    expect(generateSmartPageName('/support-resources/programs/financial-aid')).toBe('Support Resources Program Details');
  });

  it('should handle occupation routes', () => {
    expect(generateSmartPageName('/occupation/software-engineer')).toBe('Occupation Details');
    expect(generateSmartPageName('/occupation/11-1021')).toBe('Occupation Details');
  });

  it('should handle career pathway dynamic routes', () => {
    expect(generateSmartPageName('/career-pathways/technology')).toBe('Career Pathways - Technology');
    expect(generateSmartPageName('/career-pathways/health-care')).toBe('Career Pathways - Health Care');
  });

  it('should handle other support resource routes', () => {
    expect(generateSmartPageName('/support-resources/financial-aid')).toBe('Support Resources - Financial Aid');
    expect(generateSmartPageName('/support-resources/career-guidance')).toBe('Support Resources - Career Guidance');
  });

  it('should handle paths with query parameters and fragments', () => {
    expect(generateSmartPageName('/training?search=coding')).toBe('Training Explorer Landing Page');
    expect(generateSmartPageName('/programs/web-dev?id=123#overview')).toBe('Program Details');
    expect(generateSmartPageName('/?utm_source=google')).toBe('MCNJ Homepage');
  });

  it('should provide meaningful fallbacks for unrecognized patterns', () => {
    expect(generateSmartPageName('/unknown-route')).toBe('Unknown Route');
    expect(generateSmartPageName('/deeply/nested/unknown/path')).toBe('Deeply Nested Unknown Path');
    expect(generateSmartPageName('')).toBe('MCNJ Homepage'); // Empty string becomes '/' which matches homepage
  });

  it('should handle edge cases', () => {
    expect(generateSmartPageName('   ')).toBe('Page'); // Whitespace path falls back to formatPathToTitle
    expect(generateSmartPageName('//')).toBe('MCNJ Homepage');
    expect(generateSmartPageName('relative-path')).toBe('Relative Path');
  });

  it('should prioritize known patterns over generic path formatting', () => {
    // These should be detected as program routes, not generic paths
    expect(generateSmartPageName('/programs/anything')).toBe('Program Details');
    expect(generateSmartPageName('/programs/web-development-bootcamp')).toBe('Program Details');
    
    // These should use path formatting since they're not known dynamic patterns
    expect(generateSmartPageName('/resources/helpful-guides')).toBe('Resources Helpful Guides');
    expect(generateSmartPageName('/about/team')).toBe('About Team');
  });

  it('should handle case variations', () => {
    expect(generateSmartPageName('/Training')).toBe('Training Explorer Landing Page');
    expect(generateSmartPageName('/PROGRAMS/web-dev')).toBe('Program Details');
    expect(generateSmartPageName('/Support-Resources')).toBe('Helpful Resources Page');
  });

  it('should handle trailing slashes correctly', () => {
    expect(generateSmartPageName('/training/')).toBe('Training Explorer Landing Page');
    expect(generateSmartPageName('/programs/web-dev/')).toBe('Program Details');
    expect(generateSmartPageName('/career-pathways/')).toBe('Career Pathways Landing Page');
  });
});
