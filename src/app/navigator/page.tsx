import { CtaBanner } from "@components/blocks/CtaBanner";
import { PageBanner } from "@components/blocks/PageBanner";
import { River } from "@components/blocks/River";
import { Stepper } from "@components/blocks/Stepper";
import { MainLayout } from "@components/global/MainLayout";
import { IconCard } from "@components/modules/IconCard";
import { SectionHeading } from "@components/modules/SectionHeading";
import { client } from "@utils/client";
import { createButtonObject } from "@utils/createButtonObject";
import { getNav } from "@utils/getNav";

import globalOgImage from "@images/globalOgImage.jpeg";
import {
  ButtonProps,
  CareerNavigatorProps,
  LinkProps,
  ThemeColors,
} from "@utils/types";
import { CAREER_NAVIGATOR_QUERY } from "queries/careerNavigator";

async function getData() {
  const { globalNav, mainNav, footerNav1, footerNav2 } = await getNav();

  const { page } = await client({
    query: CAREER_NAVIGATOR_QUERY,
  });

  return {
    page,
    globalNav,
    mainNav,
    footerNav1,
    footerNav2,
  };
}

export const revalidate = 86400;

export async function generateMetadata({}) {
  const { page } = (await getData()) as CareerNavigatorProps;

  return {
    title: `${page.title} | ${process.env.REACT_APP_SITE_NAME}`,
    description: page.pageDescription,
    keywords: page.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
  };
}

export default async function CareerNavigatorPage() {
  const { page, footerNav1, footerNav2, mainNav, globalNav } =
    (await getData()) as CareerNavigatorProps;

  const interrupterLinksConverter = (links: LinkProps[]): ButtonProps[] => {
    return links.map((link, index: number): ButtonProps => {
      const theme: ThemeColors =
        index % 4 === 0
          ? "blue"
          : index % 4 === 1
            ? "orange"
            : index % 4 === 2
              ? "navy"
              : "green";
      return createButtonObject(
        {
          ...link,
        },
        {
          highlight: theme,
        },
      );
    });
  };

  const navs = {
    footerNav1,
    footerNav2,
    mainNav,
    globalNav,
  };

  return (
    <MainLayout {...navs}>
      <div className="page careerNavigator">
        <PageBanner {...page.pageBanner} />
        <section className="opportunities">
          <div className="container">
            {page.opportunitiesHeading && (
              <SectionHeading heading={page.opportunitiesHeading} />
            )}
            <div className="inner">
              {page.opportunityCards.items.map((card, index: number) => {
                const theme =
                  index % 3 === 0
                    ? "blue"
                    : index % 3 === 1
                      ? "purple"
                      : "green";
                const isExternal = card.url?.includes("http");
                return (
                  card.sys && (
                    <IconCard
                      key={card.sys.id}
                      fill
                      message={card.description}
                      indicator={isExternal ? "ArrowRight" : undefined}
                      theme={theme}
                      {...card}
                    />
                  )
                );
              })}
            </div>
          </div>
        </section>
        <section className="howTo">
          <div className="container">
            {page.stepsHeading && (
              <SectionHeading heading={page.stepsHeading} />
            )}
          </div>
          {page.stepsCollection.items && (
            <div className="container ">
              <Stepper theme="purple" steps={page.stepsCollection.items} />
            </div>
          )}
        </section>
        {page.midPageCtaLinks?.items && (
          <CtaBanner
            headingLevel={2}
            noIndicator
            inlineButtons
            heading={page.midPageCtaHeading}
            items={page.midPageCtaLinks?.items}
          />
        )}
        {page.interrupterLinks?.items && page.interrupterHeading && (
          <CtaBanner
            fullColor
            theme="purple"
            headingLevel={3}
            heading={page.interrupterHeading}
            customLinks={interrupterLinksConverter(
              page.interrupterLinks?.items,
            )}
          />
        )}
        <section className="info">
          <div className="container">
            {page.infoHeading && (
              <SectionHeading headingLevel={3} heading={page.infoHeading} />
            )}
          </div>
          <div className="container narrow">
            <div className="inner">
              {page.infoCards?.items.map((card, index: number) => {
                const theme: ThemeColors =
                  index % 3 === 0
                    ? "blue"
                    : index % 3 === 1
                      ? "green"
                      : "purple";
                return (
                  <IconCard
                    {...card}
                    key={card.sys?.id}
                    theme={theme}
                    icon={card.icon}
                    systemIcon={card.sectionIcon}
                    copy={card.heading}
                    message={card.description}
                  />
                );
              })}
            </div>
          </div>
        </section>
        {page.river && page.river.items.length > 0 && (
          <River headingLevel={4} items={page.river.items} />
        )}
        <CtaBanner
          inlineButtons
          heading={page.footerCtaHeading}
          items={[page.footerCtaLink]}
        />
      </div>
    </MainLayout>
  );
}
