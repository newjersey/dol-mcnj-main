declare const window: any;

export function logEvent(
  category: string,
  action: string,
  label: string | undefined
): void {
  if (typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
    });
  }
}

export function trackPageLoadTime(pageName: string, pageUrl: string): void {
  if (typeof window === "undefined") return;

  if (document.readyState === "complete") {
    measureAndSendLoadTime(pageName, pageUrl);
  } else {
    window.addEventListener("load", () => {
      measureAndSendLoadTime(pageName, pageUrl);
    });
  }
}

function measureAndSendLoadTime(pageName: string, pageUrl: string): void {
  let loadTime = 0;

  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    loadTime = timing.loadEventEnd - timing.navigationStart;
  } else if (window.performance && window.performance.getEntriesByType) {
    const navigationEntries = window.performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0];
      loadTime = Math.round(entry.loadEventEnd - entry.fetchStart);
    }
  }

  if (loadTime > 0) {
    sendLoadTimeToAnalytics(pageName, pageUrl, loadTime);
  }
}

function sendLoadTimeToAnalytics(
  pageName: string,
  pageUrl: string,
  loadTime: number
): void {
  if (typeof window.gtag === "function") {
    window.gtag("event", "timing_complete", {
      name: "page_load_time",
      value: loadTime,
      event_category: "Page Load Performance",
      event_label: `${pageName} - ${pageUrl}`,
      custom_map: {
        metric1: loadTime,
      },
    });
  }

  if (window.dataLayer) {
    window.dataLayer.push({
      event: "page_load_time_tracked",
      page_name: pageName,
      page_url: pageUrl,
      load_time_ms: loadTime,
      load_time_seconds: Math.round((loadTime / 1000) * 100) / 100,
    });
  }

  console.log(`Page Load Time Tracked: ${pageName} loaded in ${loadTime}ms`);
}
