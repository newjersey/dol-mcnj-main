"use client";

import { useEffect } from "react";
import { trackPageLoadTime } from "@utils/analytics";

interface PageLoadTrackerProps {
  pageName: string;
  pageUrl?: string;
}

export function PageLoadTracker({ pageName, pageUrl }: PageLoadTrackerProps) {
  useEffect(() => {
    const currentUrl =
      pageUrl ||
      (typeof window !== "undefined" ? window.location.pathname : "");

    const timer = setTimeout(() => {
      trackPageLoadTime(pageName, currentUrl);
    }, 100);

    return () => clearTimeout(timer);
  }, [pageName, pageUrl]);

  return null;
}
