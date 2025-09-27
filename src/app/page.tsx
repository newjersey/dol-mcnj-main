import { FancyBanner } from "@components/blocks/FancyBanner";
import { SurveyMonkeyModal } from "@components/blocks/SurveyMonkeyModal";
import globalOgImage from "@images/globalOgImage.jpeg";
import { HOMEPAGE_DATA as pageData } from "@data/pages/home";
import { SupportedLanguages, ThemeColors } from "@utils/types/types";
import { cookies } from "next/headers";
import { Card } from "@components/modules/Card";
import { PageLoadTracker } from "@components/utils/PageLoadTracker";

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
      <PageLoadTracker pageName="MCNJ Homepage" pageUrl="/" />
      <div className="page home">
        <FancyBanner {...pageData[lang].banner} />
        <div className="container flex-col flex gap-24">
          <div className="flex flex-col gap-6 text-primaryDark mt-4">
            <h2 className="font-extrabold text-[32px] m-0">
              {pageData[lang].topTools.heading}
            </h2>
            <div className="flex flex-col tablet:flex-row gap-6">
              {pageData[lang].topTools.items.map((tool) => (
                <Card
                  key={tool.title}
                  {...tool}
                  theme={tool.theme as ThemeColors}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6 text-primaryDark mb-16">
            <div className="flex flex-col gap-2">
              <h2 className="font-extrabold text-[32px] m-0 leading-[1.2]">
                {pageData[lang].toolLinks.heading}
              </h2>
              <p className="m-0 text-lrg">
                {pageData[lang].toolLinks.subheading}
              </p>
            </div>
            <div className="grid mobileLg:grid-cols-2 tabletLg:grid-cols-4 gap-6">
              {pageData[lang].toolLinks.items.map((tool) => (
                <Card
                  key={tool.title}
                  {...tool}
                  theme={tool.theme as ThemeColors}
                />
              ))}
            </div>
          </div>

          {/* Exit-intent Survey Modal */}
          <SurveyMonkeyModal
            surveyUrl={
              process.env.NEXT_PUBLIC_SURVEY_URL ||
              "https://www.surveymonkey.com/r/Preview/?sm=bTZe7KLw5KwHqgb_2BcXf6rRBzZw0EKbCVPCOGhE6DpTdGdLSkS_2FGF_2BYjAFNSbfqt"
            }
            title="Help Us Improve My Career NJ"
            storageKey="mcnj_landing_survey"
          />
        </div>
      </div>
    </>
  );
}
