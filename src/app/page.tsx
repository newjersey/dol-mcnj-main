import { FancyBanner } from "@components/blocks/FancyBanner";
import globalOgImage from "@images/globalOgImage.jpeg";
import { HOMEPAGE_DATA as pageData } from "@data/pages/home";
import { SupportedLanguages } from "@utils/types/types";
import { cookies } from "next/headers";

export const revalidate = 86400;

export async function generateMetadata({}) {
  return {
    title: process.env.REACT_APP_SITE_NAME,
    description: pageData.seo.pageDescription,
    keywords: pageData.seo.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
  };
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <>
      <div className="page home">
        <FancyBanner {...pageData[lang].banner} />
      </div>
    </>
  );
}
