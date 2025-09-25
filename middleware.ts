import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Supported locales
const locales = ["en", "es"] as const;
const defaultLocale = "en";

// Map synonyms to canonical industry slugs used under /career-pathways
// Extend as additional industries/synonyms are introduced.
const industryRedirectMap: Record<string, string> = {
  // Canonical slug is 'healthcare'
  health: "healthcare", // synonym -> canonical
  healthcare: "healthcare",
  manufacturing: "manufacturing",
  tdl: "tdl",
};

function getLocale(request: NextRequest): string {
  const acceptLanguageHeader = request.headers.get("accept-language") || "";
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguageHeader },
  }).languages();
  return match(languages, locales as unknown as string[], defaultLocale);
}

function redirectToCanonicalIndustry(request: NextRequest, canonical: string) {
  const dest = new URL(`/career-pathways/${canonical}`, request.url);
  // Preserve any existing query string
  dest.search = request.nextUrl.search;
  return NextResponse.redirect(dest, 308);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean); // remove empty

  // 1. Industry root entry ( /health, /healthcare, /manufacturing, /tdl )
  // Always canonicalize to /career-pathways/{canonical} even if already canonical.
  // This ensures downstream career pathways page logic (auto-select occupation) executes.
  if (segments.length === 1) {
    const maybeIndustry = segments[0].toLowerCase();
    const canonical = industryRedirectMap[maybeIndustry];
    if (canonical) {
      return redirectToCanonicalIndustry(request, canonical);
    }
  }

  // 2. /career-pathways/{synonym or canonical}[/*] ensure first param canonical
  if (segments[0] === "career-pathways" && segments.length >= 2) {
    const industrySlug = segments[1].toLowerCase();
    const canonical = industryRedirectMap[industrySlug];
    if (canonical && industrySlug !== canonical) {
      const rest = segments.slice(2).join("/");
      const destPath = `/career-pathways/${canonical}${rest ? `/${rest}` : ""}`;
      const url = new URL(destPath, request.url);
      url.search = request.nextUrl.search;
      return NextResponse.redirect(url, 308);
    }
  }

  // 3. Locale handling - skip if the path already begins with a supported locale
  const firstSegment = segments[0];
  const hasLocale = locales.includes(firstSegment as any);
  if (hasLocale) return NextResponse.next();

  // 4. Automatic locale prefix (only when not default? we skip adding default)
  const locale = getLocale(request);
  if (locale === defaultLocale) {
    return NextResponse.next();
  }
  const urlWithLocale = request.nextUrl.clone();
  urlWithLocale.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(urlWithLocale);
}

export const config = {
  matcher: "/((?!_next|.*\\..*).*)", // ignore _next & static assets
};
