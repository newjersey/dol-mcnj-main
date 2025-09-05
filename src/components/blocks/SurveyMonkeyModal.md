# SurveyMonkey Modal Component

A reusable React component that displays SurveyMonkey surveys as an exit-intent modal overlay. The modal automatically appears when users attempt to navigate away from the page, unless they have already completed or dismissed the survey.

## Features

- **Exit-Intent Survey**: Automatically shows when users try to navigate away
- **Persistent Storage**: Tracks completion/dismissal status using localStorage
- **Navigation Interception**: Intercepts link clicks and navigation attempts
- **Iframe Integration**: Embeds SurveyMonkey surveys seamlessly
- **Accessible**: Full keyboard navigation, screen reader support, ARIA labels
- **Responsive**: Works on mobile and desktop devices
- **Secure**: Uses iframe sandbox attributes for security

## Usage

### Basic Usage

```tsx
import { SurveyMonkeyModal } from "@components/blocks/SurveyMonkeyModal";

function MyComponent() {
  return (
    <SurveyMonkeyModal
      surveyUrl="https://www.surveymonkey.com/r/YOUR_SURVEY_ID"
      title="Help Us Improve"
      storageKey="feedback_survey"
    />
  );
}
```

### Environment Variable Configuration

Set the survey URL via environment variable for easy configuration:

```tsx
<SurveyMonkeyModal
  surveyUrl={process.env.NEXT_PUBLIC_SURVEY_URL || "https://fallback-survey.com"}
  title="User Experience Survey"
  storageKey="ux_survey"
/>
```

### Custom Storage Key

Use a custom localStorage key to track different surveys:

```tsx
<SurveyMonkeyModal
  surveyUrl="https://www.surveymonkey.com/r/YOUR_SURVEY_ID"
  title="Landing Page Survey"
  storageKey="landing_page_feedback"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `surveyUrl` | `string` | **Required** | The SurveyMonkey survey URL to embed |
| `title` | `string` | `"Survey"` | Modal title displayed in the header |
| `storageKey` | `string` | `"surveyMonkey_feedback_status"` | localStorage key for tracking survey status |

## How It Works

1. **Page Load**: Component renders invisibly on the page
2. **Navigation Detection**: Listens for navigation attempts (link clicks, form submissions)
3. **Status Check**: Checks localStorage for previous completion/dismissal
4. **Modal Display**: Shows survey modal if not previously interacted with
5. **Status Tracking**: Saves completion or dismissal status to localStorage
6. **Navigation Continuation**: Allows navigation to proceed after modal interaction

## Survey Status Tracking

The component tracks three states in localStorage:

- `null` - No previous interaction (will show survey)
- `"completed"` - User completed the survey (will not show again)
- `"dismissed"` - User dismissed the survey (will not show again)

## Styling

The component uses SCSS classes that can be customized:

- `.surveyMonkeyModal` - Main modal container  
- `.modal-header` - Modal header area
- `.modal-content` - Modal content area
- `.survey-iframe` - Iframe styling

## Accessibility Features

- **Keyboard Navigation**: Tab through focusable elements, Escape to close
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Focus is trapped within the modal when open
- **High Contrast Support**: Respects user's contrast preferences
- **Reduced Motion**: Respects user's motion preferences

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SURVEY_URL` | Default SurveyMonkey survey URL | `https://www.surveymonkey.com/r/ABC123` |

## Security

The iframe uses sandbox attributes for security:
- `allow-scripts` - Allows JavaScript execution
- `allow-same-origin` - Allows same-origin requests
- `allow-forms` - Allows form submissions
- `allow-popups` - Allows popups (for SurveyMonkey features)
- `allow-popups-to-escape-sandbox` - Required for some SurveyMonkey functionality

## Testing

The component includes comprehensive tests covering:
- Exit-intent functionality and navigation interception
- localStorage tracking for completion/dismissal
- Modal open/close functionality
- Keyboard interactions
- Accessibility attributes

Run tests with:
```bash
npm test -- --testPathPattern=SurveyMonkeyModal.test.tsx
```

## Integration Example

Example integration in a landing page:

```tsx
// In your page component (e.g., app/page.tsx)
export default function HomePage() {
  return (
    <div>
      {/* Your page content */}
      <h1>Welcome to My Career NJ</h1>
      <p>Explore career opportunities...</p>
      
      {/* Navigation links that will trigger the survey */}
      <nav>
        <a href="/explore">Explore Careers</a>
        <a href="/training">Find Training</a>
      </nav>
      
      {/* Exit-intent survey modal (invisible until triggered) */}
      <SurveyMonkeyModal
        surveyUrl={process.env.NEXT_PUBLIC_SURVEY_URL || "https://fallback-url.com"}
        title="Help Us Improve My Career NJ"
        storageKey="mcnj_landing_survey"
      />
    </div>
  );
}
```

## Browser Support

- Modern browsers with iframe support
- JavaScript required for modal functionality  
- CSS Grid and Flexbox support recommended for optimal styling
- localStorage support required for status tracking

## Notes

- The component automatically intercepts navigation attempts to show the survey
- Survey status is persisted in localStorage to prevent repeated displays
- Body scroll is locked when the modal is open
- Modal closes on Escape key press or clicking outside the modal content
- The component is client-side rendered (uses "use client" directive)
- Survey will only show once per user unless localStorage is cleared