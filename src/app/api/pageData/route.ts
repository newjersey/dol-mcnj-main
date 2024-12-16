import { NextRequest, NextResponse } from "next/server";
import { HOMEPAGE_DATA } from "@data/pages/home";
import { TRAINING_EXPLORER_PAGE_DATA } from "@data/pages/training";
import { GLOBAL_NAV_DATA } from "@data/global/navigation/global";
import { MAIN_NAV_DATA } from "@data/global/navigation/main";
import {
  FOOTER_NAV_1_DATA,
  FOOTER_NAV_2_DATA,
} from "@data/global/navigation/footer";
import { CAREER_PATHWAYS_PAGE_DATA } from "@data/pages/career-pathways";
import { SUPPORT_RESOURCES_PAGE_DATA } from "@data/pages/support-resources";

export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get("slug");

  if (slug === "nav") {
    return NextResponse.json({
      globalNav: GLOBAL_NAV_DATA,
      mainNav: MAIN_NAV_DATA,
      footerNav1: FOOTER_NAV_1_DATA,
      footerNav2: FOOTER_NAV_2_DATA,
    });
  }

  if (slug === "home") {
    return NextResponse.json(HOMEPAGE_DATA);
  }

  if (slug === "training") {
    return NextResponse.json(TRAINING_EXPLORER_PAGE_DATA);
  }

  if (slug === "career-pathways") {
    return NextResponse.json(CAREER_PATHWAYS_PAGE_DATA);
  }

  if (slug === "support-resources") {
    return NextResponse.json(SUPPORT_RESOURCES_PAGE_DATA);
  }

  return NextResponse.json({
    error: "Page not found",
  });
}
