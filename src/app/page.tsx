import { FancyBanner } from "@components/blocks/FancyBanner";
import { SurveyMonkeyModal } from "@components/blocks/SurveyMonkeyModal";
import globalOgImage from "@images/globalOgImage.jpeg";
import { HOMEPAGE_DATA as pageData } from "@data/pages/home";
import { SupportedLanguages, ThemeColors } from "@utils/types/types";
import { cookies } from "next/headers";
import { Card } from "@components/modules/Card";
import { generatePageMetadata, generateStructuredData } from "@utils/seo";
import Script from "next/script";

export const revalidate = 86400;

export async function generateMetadata({}) {
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://mycareer.nj.gov';
  
  return {
    title: process.env.REACT_APP_SITE_NAME,
    description: pageData.seo.pageDescription,
    keywords: pageData.seo.keywords?.join(', '),
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: `${process.env.REACT_APP_SITE_NAME} - New Jersey Career Resources`,
      description: pageData.seo.pageDescription,
      url: baseUrl,
      siteName: process.env.REACT_APP_SITE_NAME,
      images: [
        {
          url: `${baseUrl}/stateSeal.png`,
          width: 1200,
          height: 630,
          alt: 'My Career NJ - New Jersey Department of Labor'
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${process.env.REACT_APP_SITE_NAME} - New Jersey Career Resources`,
      description: pageData.seo.pageDescription,
      images: [`${baseUrl}/stateSeal.png`],
      site: '@NewJerseyDOL'
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-US': baseUrl,
        'es-US': `${baseUrl}?lang=es`
      },
      types: {
        'application/rss+xml': `${baseUrl}/rss.xml`
      }
    },
    other: {
      'geo.region': 'US-NJ',
      'geo.placename': 'New Jersey',
      'DC.Title': process.env.REACT_APP_SITE_NAME,
      'DC.Description': pageData.seo.pageDescription,
      'DC.Subject': 'Career Resources, Job Training, Employment Services',
      'DC.Language': 'en'
    }
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

  // Generate breadcrumb structured data for homepage
  const breadcrumbStructuredData = generateStructuredData({
    type: 'BreadcrumbList',
    data: {
      items: [{ name: 'Home', url: '/' }]
    }
  });

  return (
    <>
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbStructuredData
        }}
      />
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
            surveyUrl={process.env.NEXT_PUBLIC_SURVEY_URL || "https://www.surveymonkey.com/r/Preview/?sm=bTZe7KLw5KwHqgb_2BcXf6rRBzZw0EKbCVPCOGhE6DpTdGdLSkS_2FGF_2BYjAFNSbfqt"}
            title="Help Us Improve My Career NJ"
            storageKey="mcnj_landing_survey"
          />
        </div>
      </div>
    </>
  );
}
