import { PageHero } from "@components/blocks/PageHero";
import { MediaCard } from "@components/modules/MediaCard";
import { SectionHeading } from "@components/modules/SectionHeading";
import { ASSETGUIDE_PAGE_DATA as pageData } from "@data/pages/assetGuide";
import globalOgImage from "@images/globalOgImage.jpeg";
import { SupportedLanguages } from "@utils/types/types";
import { ReferenceCards } from "./Components/ReferenceCards";
import { cookies } from "next/headers";
import { SideNav } from "./Components/SideNav";

export const revalidate = 86400;

export async function generateMetadata({}) {
  return {
    title: `${pageData.seo.title} | ${process.env.REACT_APP_SITE_NAME}`,
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

export const cardRowClasses =
  "grid grid-cols-1 mobileLg:grid-cols-2 tabletLg:grid-cols-3 gap-4";

export default async function MediaPressPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <div className="page careerNavigator">
      <PageHero {...pageData[lang].pageHero} className="mb-12" />
      <section className="container flex items-start flex-row-reverse gap-12">
        <SideNav />
        <div
          id="pageCopySection"
          className="flex flex-col gap-24 mb-24 w-[calc(100%-300px)]"
        >
          <div>
            <SectionHeading
              withIds
              heading={pageData[lang].cardRow.heading}
              description={pageData[lang].cardRow.description}
              noDivider
            />
            <div className={cardRowClasses}>
              {pageData[lang].cardRow.cards.map((card, index) => (
                <MediaCard key={card.title + index} {...card} />
              ))}
            </div>
          </div>
          <div>
            <SectionHeading
              withIds
              heading={pageData[lang].cardRow2.heading}
              description={pageData[lang].cardRow2.description}
              noDivider
            />
            <div className={cardRowClasses}>
              {pageData[lang].cardRow2.cards.map((card, index) => (
                <MediaCard key={card.title + index} {...card} />
              ))}
            </div>
          </div>
          <ReferenceCards {...pageData[lang].referenceRow} />
        </div>
      </section>
    </div>
  );
}
