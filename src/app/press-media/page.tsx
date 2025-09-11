import globalOgImage from "@images/globalOgImage.jpeg";
import { PRESS_MEDIA_DATA as pageData } from "@data/pages/press-media";
import { SupportedLanguages } from "@utils/types/types";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { PageHero } from "@components/blocks/PageHero";
import { CardGrid } from "@components/blocks/CardGrid";

export const metadata: Metadata = {
  title: pageData.seo.title,
  description: pageData.seo.pageDescription,
  openGraph: {
    images: [globalOgImage.src],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function SmsUsePolicyPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <div
      className="container"
      style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
    >
      <PageHero {...pageData[lang].pageHero} />
      <CardGrid {...pageData[lang].cardGrid} />
    </div>
  );
}
