# Testing the Analytics Tracking System

The analytics tracking system is now set up with debugging capabilities. Here's how to test it locally:

## 🚀 Quick Start

1. **Development server is running** at: http://localhost:3000
2. **Add the AnalyticsDebugger** to any page for visual debugging
3. **Check browser dev tools** for console logs and network requests

## 🔍 Using the AnalyticsDebugger Component

Add this component to any page where you want to see analytics events in real-time:

```jsx
import { AnalyticsDebugger } from '@/components/dev/AnalyticsDebugger';

// Add this to your page component:
<AnalyticsDebugger />
```

The debugger will:
- Show all gtag() calls in real-time
- Display dataLayer events as they happen
- Provide timestamps for each event
- Show full event data and parameters

## 🧪 Testing Steps

### 1. Basic Page Load Tracking
- Navigate to http://localhost:3000
- Open browser dev tools (F12)
- Look for console messages starting with "📊 [Analytics Debug]"
- Check the Network tab for requests to Google Analytics

### 2. Navigation Tracking
- Navigate between pages (e.g., / → /career-pathways → /faq)
- Watch for "Page navigation detected" messages in console
- Verify that each navigation triggers a new page load event

### 3. Smart Page Name Generation
Pages should be tracked with these names:
- `/` → "Home"
- `/career-pathways` → "Career Pathways"
- `/career-pathways/healthcare` → "Career Pathways - Healthcare"
- `/training/search` → "Training Search"
- `/occupation/123` → "Occupation Details"

### 4. Event Data Structure
Look for events with this structure:
```json
{
  "event": "page_load_time",
  "page_title": "Smart Generated Name",
  "page_location": "http://localhost:3000/path",
  "load_time_ms": 1234,
  "navigation_type": "navigate|reload|back_forward"
}
```

## 🔧 Debug Console Commands

Open browser dev tools and try these commands:

```javascript
// Check if tracking is active
console.log('DataLayer:', window.dataLayer);
console.log('gtag available:', typeof window.gtag);

// Manually trigger a test event
window.gtag?.('event', 'test_event', {
  custom_parameter: 'test_value'
});

// Check recent dataLayer events
console.log('Recent events:', window.dataLayer?.slice(-5));
```

## 📊 What to Look For

### ✅ Success Indicators:
- Console messages show page load times
- Navigation changes are detected automatically  
- Smart page names are generated correctly
- Events appear in browser Network tab (analytics requests)
- AnalyticsDebugger shows events in real-time

### ❌ Issues to Watch For:
- No console debug messages
- Navigation changes not detected
- Missing or incorrect page names
- No network requests to analytics endpoints
- JavaScript errors in console

## 🎯 Next Steps

After local testing works correctly:

1. **Test in staging/production environment**
2. **Verify events appear in Google Analytics Real-Time reports**
3. **Test on mobile devices and different browsers**
4. **Validate tracking across all page types**

## 🛠️ Debugging Tips

- Ensure Google Analytics is properly configured in your environment
- Check that the GA measurement ID is correct in your config
- Verify the SmartPageLoadTracker is included in your layout
- Use the AnalyticsDebugger component for visual feedback
- Monitor browser dev tools Network tab for outgoing requests

The tracking system is designed to work automatically across your entire Next.js application with minimal configuration required.