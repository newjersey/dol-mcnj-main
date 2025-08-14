import { useEffect } from "react";

type Props = {
    onlyOnPath?: string;
    enabled?: boolean;
    src?: string; // the SurveyMonkey widget script URL
    sessionKey?: string; // sessionStorage key for "shown"
};

/**
 * Loads the SurveyMonkey Website Collector widget with simple guards:
 * - Only on a specific path (defaults to "/")
 * - Only once per session (via sessionStorage)
 * - Optional enable flag (for feature toggling)
 *
 * Notes:
 * - The SurveyMonkey website collector configuration (dismiss behavior, display rules, etc.)
 *   is controlled in SurveyMonkey; this component only controls when the script is loaded.
 */
export function SurveyMonkeyWidget({
                                       onlyOnPath = "/",
                                       enabled = true,
                                       src = "https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgd4s_2B939eKTW1a_2Fbw_2Bu9_2F78EJbLgCCroXntvIim4X_2F6yB.js",
                                       sessionKey = "smcx_shown",
                                   }: Props) {
    useEffect(() => {
        try {
            if (!enabled) return;
            if (typeof window === "undefined") return;

            // Only run on the specified route (root by default)
            if (onlyOnPath && window.location.pathname !== onlyOnPath) return;

            // Show only once per session
            if (sessionStorage.getItem(sessionKey)) return;

            const SCRIPT_ID = "smcx-sdk";
            if (!document.getElementById(SCRIPT_ID)) {
                const s = document.createElement("script");
                s.type = "text/javascript";
                s.async = true;
                s.id = SCRIPT_ID;
                s.src = src;

                // Insert after the last existing script tag if possible to mimic the vendor snippet;
                // otherwise, fall back to head.
                const scripts = document.getElementsByTagName("script");
                const last = scripts[scripts.length - 1];
                if (last && last.parentNode) {
                    last.parentNode.insertBefore(s, last.nextSibling);
                } else if (document.head) {
                    document.head.appendChild(s);
                } else {
                    document.body.appendChild(s);
                }
            }

            // Mark as shown for this session so we don’t reinject during SPA nav
            sessionStorage.setItem(sessionKey, "1");
        } catch {
            // no-op; fail closed
        }
    }, [onlyOnPath, enabled, src, sessionKey]);

    return null;
}

export default SurveyMonkeyWidget;