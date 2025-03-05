import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Define supported locales
const locales = ["en", "es"];
const defaultLocale = "en";

// Function to get the best matching locale
function getLocale(request: NextRequest): string {
  const acceptLanguageHeader = request.headers.get("accept-language") || "";
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguageHeader },
  }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path already includes a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Get the preferred locale
  const locale = getLocale(request);

  // Only add the locale to the path if it's not English
  request.nextUrl.pathname =
    locale === "en" ? pathname : `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

// Next.js matcher to apply middleware to all pages except internal (_next)
export const config = {
  matcher: "/((?!_next).*)",
};
