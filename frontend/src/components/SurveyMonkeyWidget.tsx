import { useEffect } from "react";
import { useLocation, RouteComponentProps } from "@reach/router";

type Props = RouteComponentProps & {
    onlyOnPath?: string;
    enabled?: boolean;
    src?: string;
    sessionKey?: string;
};

// CHANGED: Use "export default" here
export default function SurveyMonkeyWidget({
                                               onlyOnPath = "/",
                                               enabled = true,
                                               src = "https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgd4s_2B939eKTW1a_2Fbw_2Bu9_2F78EJbLgCCroXntvIim4X_2F6yB.js",
                                               sessionKey = "smcx_shown",
                                           }: Props) {
    const location = useLocation();

    useEffect(() => {
        console.log("--- SurveyMonkeyWidget Effect Fired ---");
        console.log("Checking conditions for pathname:", location.pathname);

        // 1. Check if enabled
        console.log(`1. Is enabled? -> ${enabled}`);
        if (!enabled) {
            console.log("-> EXIT: Component is disabled via prop.");
            return;
        }

        // 2. Check path
        console.log(`2. Path match? -> Current: '${location.pathname}', Required: '${onlyOnPath}'`);
        if (onlyOnPath && location.pathname !== onlyOnPath) {
            console.log("-> EXIT: Path does not match.");
            return;
        }

        // 3. Check sessionStorage
        const sessionValue = sessionStorage.getItem(sessionKey);
        console.log(`3. Session storage check ('${sessionKey}') -> Value: ${sessionValue}`);
        if (sessionValue) {
            console.log("-> EXIT: Already shown this session.");
            return;
        }

        console.log("✅ All checks passed! Injecting script...");

        try {
            const SCRIPT_ID = "smcx-sdk";
            if (!document.getElementById(SCRIPT_ID)) {
                const s = document.createElement("script");
                s.type = "text/javascript";
                s.async = true;
                s.id = SCRIPT_ID;
                s.src = src;

                const scripts = document.getElementsByTagName("script");
                const last = scripts[scripts.length - 1];
                if (last && last.parentNode) {
                    last.parentNode.insertBefore(s, last.nextSibling);
                } else {
                    document.head.appendChild(s);
                }
                console.log("-> SCRIPT INJECTED.");
            } else {
                console.log("-> Script tag already exists, not injecting again.");
            }

            sessionStorage.setItem(sessionKey, "1");
            console.log(`-> Session key '${sessionKey}' set to '1'.`);
        } catch (e) {
            console.error("-> ERROR during script injection:", e);
        }
    }, [location.pathname, onlyOnPath, enabled, src, sessionKey]);

    return null;
}