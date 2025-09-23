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
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
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
});
