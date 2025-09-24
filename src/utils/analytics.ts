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

  // Enhanced debugging logging
  const isDebug = process.env.NODE_ENV === 'development' || window.location.search.includes('debug=analytics');
  
  if (isDebug) {
    console.group(`🔍 Page Load Tracking: ${pageName}`);
    console.log('📍 URL:', pageUrl);
    console.log('🎯 Page Name:', pageName);
    console.log('📊 GA Available:', typeof window.gtag === 'function');
    console.log('📈 DataLayer Available:', !!window.dataLayer);
    console.log('⚡ Performance API:', !!window.performance);
  }

  if (document.readyState === "complete") {
    measureAndSendLoadTime(pageName, pageUrl, isDebug);
  } else {
    window.addEventListener("load", () => {
      measureAndSendLoadTime(pageName, pageUrl, isDebug);
    });
  }

  if (isDebug) {
    console.groupEnd();
  }
}

function measureAndSendLoadTime(pageName: string, pageUrl: string, isDebug: boolean = false): void {
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;

    if (isDebug) {
      console.log('⏱️ Navigation Timing API (Level 1):');
      console.log(`   Navigation Start: ${timing.navigationStart}`);
      console.log(`   Load Event End: ${timing.loadEventEnd}`);
      console.log(`   📊 Calculated Load Time: ${loadTime}ms`);
    }

    if (loadTime > 0) {
      sendLoadTimeEvent(pageName, pageUrl, loadTime, isDebug);
    } else if (isDebug) {
      console.warn('⚠️ Invalid load time (≤0), skipping event');
    }
  } else if (window.performance && window.performance.getEntriesByType) {
    const navigationEntries = window.performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    
    if (isDebug) {
      console.log('⏱️ Navigation Timing API (Level 2):');
      console.log(`   Navigation Entries Found: ${navigationEntries.length}`);
    }
    
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0];
      const loadTime = entry.loadEventEnd - entry.fetchStart;

      if (isDebug) {
        console.log(`   Fetch Start: ${entry.fetchStart}`);
        console.log(`   Load Event End: ${entry.loadEventEnd}`);
        console.log(`   📊 Calculated Load Time: ${Math.round(loadTime)}ms`);
      }

      if (loadTime > 0) {
        sendLoadTimeEvent(pageName, pageUrl, Math.round(loadTime), isDebug);
      } else if (isDebug) {
        console.warn('⚠️ Invalid load time (≤0), skipping event');
      }
    } else if (isDebug) {
      console.warn('⚠️ No navigation entries found');
    }
  } else if (isDebug) {
    console.warn('⚠️ Performance API not available');
  }
}

function sendLoadTimeEvent(pageName: string, pageUrl: string, loadTime: number, isDebug: boolean = false): void {
  const eventData = {
    name: "page_load_time",
    value: loadTime,
    event_category: "Page Load Performance",
    event_label: `${pageName} - ${pageUrl}`,
    custom_map: {
      metric1: loadTime,
    },
  };

  const dataLayerEvent = {
    event: "page_load_time_tracked",
    page_name: pageName,
    page_url: pageUrl,
    load_time_ms: loadTime,
    load_time_seconds: Math.round((loadTime / 1000) * 100) / 100,
  };

  if (isDebug) {
    console.group('📤 Sending Analytics Events');
  }

  // Send to Google Analytics via gtag
  if (typeof window.gtag === "function") {
    window.gtag("event", "timing_complete", eventData);
    if (isDebug) {
      console.log('✅ gtag event sent:', eventData);
    }
  } else if (isDebug) {
    console.warn('⚠️ gtag not available, event not sent:', eventData);
  }

  // Send to Data Layer
  if (window.dataLayer) {
    window.dataLayer.push(dataLayerEvent);
    if (isDebug) {
      console.log('✅ dataLayer event pushed:', dataLayerEvent);
      console.log('📊 Current dataLayer length:', window.dataLayer.length);
    }
  } else if (isDebug) {
    console.warn('⚠️ dataLayer not available, event not sent:', dataLayerEvent);
  }

  // Console logging
  const message = `Page Load Time Tracked: ${pageName} loaded in ${loadTime}ms`;
  if (isDebug) {
    console.log('📝', message);
    console.groupEnd();
  } else {
    console.log(message);
  }
}export function generateSmartPageName(pathname: string): string {
  // Remove query parameters and fragments, then clean up the path
  const cleanPath = pathname.split(/[?#]/)[0].toLowerCase().replace(/\/$/, '') || '/';
  
  // Static route mappings with exact page names from manual tracking
  const staticRoutes: Record<string, string> = {
    '/': 'MCNJ Homepage',
    '/career-pathways': 'Career Pathways Landing Page',
    '/navigator': 'Career Navigator Landing Page',
    '/training': 'Training Explorer Landing Page',
    '/in-demand-occupations': 'In-Demand Occupations Page',
    '/support-resources': 'Helpful Resources Page',
    '/support-resources/tuition-assistance': 'Tuition Assistance Page',
  };

  // Check for exact static route match first
  if (staticRoutes[cleanPath]) {
    return staticRoutes[cleanPath];
  }

  // Dynamic route patterns
  const dynamicPatterns = [
    {
      pattern: /^\/programs\/([^\/]+)$/,
      generator: () => 'Program Details'
    },
    {
      pattern: /^\/training\/programs\/([^\/]+)$/,
      generator: () => 'Training Program Details'
    },
    {
      pattern: /^\/support-resources\/programs\/([^\/]+)$/,
      generator: () => 'Support Resources Program Details'
    },
    {
      pattern: /^\/occupation\/([^\/]+)$/,
      generator: () => 'Occupation Details'
    },
    {
      pattern: /^\/career-pathways\/([^\/]+)$/,
      generator: (matches: RegExpMatchArray) => `Career Pathways - ${formatSlugToTitle(matches[1])}`
    },
    {
      pattern: /^\/support-resources\/([^\/]+)$/,
      generator: (matches: RegExpMatchArray) => `Support Resources - ${formatSlugToTitle(matches[1])}`
    },
  ];

  // Try to match dynamic patterns
  for (const { pattern, generator } of dynamicPatterns) {
    const matches = cleanPath.match(pattern);
    if (matches) {
      return generator(matches);
    }
  }

  // Fallback: convert pathname to readable format
  return formatPathToTitle(cleanPath);
}

export function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatPathToTitle(path: string): string {
  // Handle root path
  if (path === '/' || path === '') {
    return 'Home';
  }
  
  // Remove query parameters and fragments
  const cleanPath = path.split(/[?#]/)[0];
  
  // Handle empty or whitespace-only paths
  if (!cleanPath.trim()) {
    return 'Page';
  }

  // Remove leading slash and split by slashes
  const segments = cleanPath.replace(/^\//, '').split('/');
  
  // Convert each segment to title case and join with spaces
  return segments
    .filter(segment => segment.length > 0)
    .map(segment => formatSlugToTitle(segment))
    .join(' ');
}
