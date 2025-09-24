"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageLoadTime, generateSmartPageName } from "@utils/analytics";

interface SmartPageLoadTrackerProps {
  /**
   * Optional override for the page name. If not provided, will use smart detection.
   */
  pageName?: string;
  /**
   * Optional override for the page URL. If not provided, will use current pathname.
   */
  pageUrl?: string;
  /**
   * Whether to enable smart detection. Defaults to true.
   */
  enableSmartDetection?: boolean;
}

export function SmartPageLoadTracker({
  pageName,
  pageUrl,
  enableSmartDetection = true,
}: SmartPageLoadTrackerProps = {}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentUrl = pageUrl || pathname;
    
    // Determine page name using smart detection or provided override
    let detectedPageName: string;
    try {
      detectedPageName = pageName || 
        (enableSmartDetection ? generateSmartPageName(currentUrl) : "Page");
    } catch (error) {
      console.error('Error generating smart page name:', error);
      detectedPageName = pageName || "Page";
    }

    const timer = setTimeout(() => {
      try {
        trackPageLoadTime(detectedPageName, currentUrl);
      } catch (error) {
        console.error('Error tracking page load time:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, pageName, pageUrl, enableSmartDetection]);

  return null;
}