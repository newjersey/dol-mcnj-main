// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;
export function logEvent(category: string, action: string, label: string): void {
  if (typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
    });
  }
}
