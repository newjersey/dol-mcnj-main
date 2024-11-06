import { CtaBanner } from "@components/blocks/CtaBanner";
import { Stepper } from "@components/blocks/Stepper";
import { SectionHeading } from "@components/modules/SectionHeading";
import { client } from "@utils/client";
import { createButtonObject } from "@utils/createButtonObject";
import {
  ButtonProps,
  CareerPathwaysPageProps,
  LinkProps,
  ThemeColors,
} from "@utils/types";
import { CAREER_PATHWAYS_PAGE_QUERY } from "queries/careerPathwaysPage";
import { PathwaysLayout } from "./PathwaysLayout";
import { notFound } from "next/navigation";
import globalOgImage from "@images/globalOgImage.jpeg";
import { content } from "@data/careerPathways";
import { Heading } from "@components/modules/Heading";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { MinimalBanner } from "@components/blocks/MinimalBanner";
import { IconNames } from "@utils/enums";
import { IndustrySelector } from "@components/blocks/IndustrySelector";

async function getData() {
  const { page } = await client({
    query: CAREER_PATHWAYS_PAGE_QUERY,
  });

  if (process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "false") {
    return notFound();
  }

  return {
    page,
  };
}
export const revalidate = 86400;

export async function generateMetadata({}) {
  const { page } = (await getData()) as CareerPathwaysPageProps;

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

export default async function CareerPathwaysPage() {
  const { page } = (await getData()) as CareerPathwaysPageProps;

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

  return (
    <>
      <MinimalBanner
        crumbs={{
          items: page.pageBanner.breadcrumbsCollection?.items || [],
          pageTitle: page.title,
        }}
        heading={content.banner.title}
        description={content.banner.description}
        tag={{
          color: "navy",
          title: "Beta",
          tooltip:
            "Our team is currently researching and developing more pathways. Check back regularly for updates.",
          icon: IconNames.Info as string,
        }}
      />
      <IndustrySelector {...content.industrySelector} />

      {page.exploreHeading && (
        <CtaBanner
          fullColor
          theme="purple"
          headingLevel={3}
          heading={page.exploreHeading}
          customLinks={interrupterLinksConverter(
            page.exploreButtonsCollection.items,
          )}
        />
      )}
    </>
  );
}
