# GA4 Page Load Time Tracking Implementation

This document describes the implementation of GA4 page load time tracking for the 7 specified pages in the MCNJ application.

## Overview

Page load time tracking has been implemented to measure and send performance metrics to Google Analytics 4 (GA4) via Google Tag Manager (GTM). The tracking measures the time from navigation start to when the page is fully loaded.

## Implementation Details

### 1. Analytics Utility (`src/utils/analytics.ts`)

Enhanced the existing analytics utility with:
- `trackPageLoadTime(pageName: string, pageUrl: string)` function
- Uses Performance API (both Level 1 and Level 2) for accurate timing
- Sends events to GA4 via both gtag and dataLayer
- Includes fallback mechanisms for browser compatibility
- Refactored to eliminate code duplication with separate `sendLoadTimeToAnalytics()` helper function

### 2. PageLoadTracker Component (`src/components/utils/PageLoadTracker.tsx`)

Created a client-side React component that:
- Only runs in browser environment (client-side)
- Uses useEffect to trigger tracking after component mount
- Takes pageName and pageUrl as props
- Renders nothing visually (utility component)

### 3. Pages with Tracking Implemented

The following 7 pages now include page load time tracking:

1. **MCNJ Homepage** (`src/app/page.tsx`)
   - Page Name: "MCNJ Homepage"
   - URL: "/"

2. **Career Pathways Landing Page** (`src/app/career-pathways/page.tsx`)
   - Page Name: "Career Pathways Landing Page"
   - URL: "/career-pathways"

3. **Career Navigator Landing Page** (`src/app/navigator/page.tsx`)
   - Page Name: "Career Navigator Landing Page"
   - URL: "/navigator"

4. **Training Explorer Landing Page** (`src/app/training/page.tsx`)
   - Page Name: "Training Explorer Landing Page"
   - URL: "/training"

5. **In-Demand Occupations Page** (`src/app/in-demand-occupations/page.tsx`)
   - Page Name: "In-Demand Occupations Page"
   - URL: "/in-demand-occupations"

6. **Helpful Resources Page** (`src/app/support-resources/page.tsx`)
   - Page Name: "Helpful Resources Page"
   - URL: "/support-resources"

7. **Tuition Assistance Page** (`src/app/support-resources/ResourceList.tsx`)
   - Page Name: "Tuition Assistance Page"
   - URL: "/support-resources/tuition-assistance"
   - Implementation: Uses standardized PageLoadTracker component

## Data Sent to GA4

For each page load, the following data is sent:

### GTM Event (via gtag)
```javascript
gtag("event", "timing_complete", {
  name: "page_load_time",
  value: loadTime, // in milliseconds
  event_category: "Page Load Performance",
  event_label: "Page Name - /page-url",
  custom_map: {
    metric1: loadTime
  }
});
```

### DataLayer Event (backup)
```javascript
dataLayer.push({
  event: "page_load_time_tracked",
  page_name: "Page Name",
  page_url: "/page-url",
  load_time_ms: loadTime,
  load_time_seconds: loadTimeInSeconds
});
```

## GTM Configuration

The application uses Google Tag Manager with ID: `GTM-KBN58VK9`

### Recommended GTM Setup

1. **Trigger**: Custom Event - `page_load_time_tracked`
2. **Tag**: GA4 Event
3. **Event Name**: `page_load_time`
4. **Parameters**:
   - `page_name`: `{{page_name}}`
   - `page_url`: `{{page_url}}`
   - `load_time_ms`: `{{load_time_ms}}`
   - `load_time_seconds`: `{{load_time_seconds}}`

## Testing

### Manual Testing
1. Open browser developer tools
2. Navigate to any of the 7 tracked pages
3. Check console for log message: "Page Load Time Tracked: [Page Name] loaded in [X]ms"
4. Verify GTM/GA4 events are firing in Network tab or GA4 DebugView

### Automated Testing
Comprehensive Jest test suites have been implemented:

- **PageLoadTracker Component Tests** (`src/components/utils/PageLoadTracker.test.tsx`)
  - 9 test cases covering component behavior, error handling, and edge cases
  - Tests client-side only rendering, prop handling, and cleanup

- **Analytics Utility Tests** (`src/utils/analytics.test.ts`)
  - 8 test cases covering both `logEvent` and `trackPageLoadTime` functions
  - Tests Performance API integration, browser compatibility, and GTM integration
  - Validates proper event tracking for all 7 specified pages

Run tests with:
```bash
npm test -- PageLoadTracker  # Component tests
npm test -- analytics        # Utility tests
npm test                      # All tests
```

## Browser Compatibility

The implementation includes fallbacks:
- Primary: Performance Timing API Level 1
- Fallback: Navigation Timing API Level 2
- Graceful degradation if Performance API is not available

## Performance Considerations

- Tracking only runs client-side (no SSR impact)
- Small delay (100ms) after page load to ensure everything is ready
- Lightweight implementation with minimal overhead
- Only tracks when valid timing data is available

## Maintenance Notes

- Page names and URLs are hardcoded for consistency
- Each page includes the PageLoadTracker component near the top of the JSX
- The utility functions handle edge cases and browser compatibility
- Console logging can be removed in production if needed