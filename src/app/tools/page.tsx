import { PageHero } from "@components/blocks/PageHero";
import { Card } from "@components/modules/Card";
import { SectionHeading } from "@components/modules/SectionHeading";
import { TOOLS_PAGE_DATA as pageData } from "@data/pages/tools";
import { SupportedLanguages } from "@utils/types/types";
import { cookies } from "next/headers";
import globalOgImage from "@images/globalOgImage.jpeg";

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

export default async function ToolsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <>
      <PageHero {...pageData[lang].banner} />

      {pageData[lang].toolRows.map((row, i) => {
        const isEven = i % 2 === 0;
        return (
          <div
            id={row.id}
            className={`theme-${row.theme}${
              isEven ? " bg-baseCool" : ""
            } py-16`}
            key={row.heading}
          >
            <div className="container">
              <SectionHeading
                heading={row.heading}
                className="pb-2"
                noDivider
                color={row.theme}
              />
              <div className="flex w-full flex-col tabletXl:flex-row items-start gap-8">
                {row.mainCard && <Card {...row.mainCard} theme={row.theme} />}

                {row.items.length > 0 && (
                  <div
                    className={`w-full grid mobileLg:grid-cols-2 ${
                      row.mainCard
                        ? "tablet:grid-cols-3"
                        : "tablet:grid-cols-3 tabletLg:grid-cols-4"
                    } gap-8`}
                  >
                    {row.items.map((item) => (
                      <Card
                        key={item.title}
                        {...item}
                        iconWeight="regular"
                        outline
                        theme="blue"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
