# SurveyMonkey Modal Component

A reusable React component that displays SurveyMonkey surveys in an accessible iframe modal overlay.

## Features

- **Iframe Integration**: Embeds SurveyMonkey surveys seamlessly
- **Accessible**: Full keyboard navigation, screen reader support, ARIA labels
- **Responsive**: Works on mobile and desktop devices
- **Configurable**: Customizable survey URL, button text, icons, and styling
- **Auto-open Support**: Can display immediately or with trigger button
- **Secure**: Uses iframe sandbox attributes for security

## Usage

### Basic Usage

```tsx
import { SurveyMonkeyModal } from "@components/blocks/SurveyMonkeyModal";

function MyComponent() {
  return (
    <SurveyMonkeyModal
      surveyUrl="https://www.surveymonkey.com/r/YOUR_SURVEY_ID"
      buttonText="Take Survey"
      title="Customer Feedback Survey"
    />
  );
}
```

### Environment Variable Configuration

Set the survey URL via environment variable for easy configuration:

```tsx
<SurveyMonkeyModal
  surveyUrl={process.env.NEXT_PUBLIC_SURVEY_URL || "https://fallback-survey.com"}
  buttonText="Share Feedback"
  title="User Experience Survey"
/>
```

### Auto-open Modal

Display the modal immediately without a trigger button:

```tsx
<SurveyMonkeyModal
  surveyUrl="https://www.surveymonkey.com/r/YOUR_SURVEY_ID"
  title="Welcome Survey"
  autoOpen={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `surveyUrl` | `string` | **Required** | The SurveyMonkey survey URL to embed |
| `buttonText` | `string` | `"Take Survey"` | Text displayed on the trigger button |
| `buttonIcon` | `string` | `"ClipboardText"` | Phosphor icon name for the trigger button |
| `title` | `string` | `"Survey"` | Modal title displayed in the header |
| `buttonClassName` | `string` | `""` | Additional CSS classes for the trigger button |
| `autoOpen` | `boolean` | `false` | Whether to show the modal immediately on mount |

## Styling

The component uses SCSS classes that can be customized:

- `.surveyMonkeyModal` - Main modal container
- `.survey-trigger` - Trigger button styling
- `.modal-header` - Modal header area
- `.modal-content` - Modal content area
- `.survey-iframe` - Iframe styling

### Custom Button Styling

```tsx
<SurveyMonkeyModal
  surveyUrl="https://example.com"
  buttonClassName="my-custom-button-class"
  // ... other props
/>
```

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
- Rendering with different props
- Modal open/close functionality
- Keyboard interactions
- Accessibility attributes
- Auto-open mode

Run tests with:
```bash
npm test -- --testPathPattern=SurveyMonkeyModal.test.tsx
```

## Integration Example

Example integration in a landing page:

```tsx
// In your page component
<div className="survey-section">
  <h2>Help Us Improve</h2>
  <p>Share your feedback to help us enhance our services</p>
  <SurveyMonkeyModal
    surveyUrl={process.env.NEXT_PUBLIC_SURVEY_URL || "https://fallback-url.com"}
    buttonText="Share Your Feedback"
    buttonIcon="ChatCircle"
    title="User Feedback Survey"
    buttonClassName="primary-cta"
  />
</div>
```

## Browser Support

- Modern browsers with iframe support
- JavaScript required for modal functionality
- CSS Grid and Flexbox support recommended for optimal styling

## Notes

- The iframe src is reset when the modal opens to ensure fresh survey loads
- Body scroll is locked when the modal is open
- Modal closes on Escape key press or clicking outside the modal content
- The component is client-side rendered (uses "use client" directive)