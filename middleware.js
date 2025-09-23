import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "es"];
const defaultLocale = "en";

const industryRedirectMap = {
  health: "healthcare",
  healthcare: "healthcare",
  manufacturing: "manufacturing",
  tdl: "tdl",
};

function getLocale(request) {
  const acceptLanguageHeader = request.headers.get("accept-language") || "";
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguageHeader },
  }).languages();
  return match(languages, locales, defaultLocale);
}

function redirectToCanonicalIndustry(request, canonical) {
  const dest = new URL(`/career-pathways/${canonical}`, request.url);
  dest.search = request.nextUrl.search;
  return NextResponse.redirect(dest, 308);
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1) {
    const maybeIndustry = segments[0].toLowerCase();
    const canonical = industryRedirectMap[maybeIndustry];
    if (canonical && maybeIndustry !== canonical) {
      return redirectToCanonicalIndustry(request, canonical);
    }
  }

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

  const firstSegment = segments[0];
  const hasLocale = locales.includes(firstSegment);
  if (hasLocale) return NextResponse.next();

  const locale = getLocale(request);
  if (locale === defaultLocale) {
    return NextResponse.next();
  }
  const urlWithLocale = request.nextUrl.clone();
  urlWithLocale.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(urlWithLocale);
}

export const config = {
  matcher: "/((?!_next|.*\\..*).*)",
};
