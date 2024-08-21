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
import { getNav } from "@utils/getNav";
import globalOgImage from "@images/globalOgImage.jpeg";

async function getData() {
  const { globalNav, mainNav, footerNav1, footerNav2 } = await getNav();

  const { page } = await client({
    query: CAREER_PATHWAYS_PAGE_QUERY,
  });

  if (process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "false") {
    return notFound();
  }

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
  const { page, footerNav1, footerNav2, mainNav, globalNav } =
    (await getData()) as CareerPathwaysPageProps;

  const navs = {
    footerNav1,
    footerNav2,
    mainNav,
    globalNav,
  };

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
    <PathwaysLayout page={page} navs={navs}>
      <section className="stepCards">
        <div className="container">
          {page.stepsCollection &&
            page.stepsCollection.items.length > 0 &&
            page.stepsHeading && (
              <SectionHeading heading={page.stepsHeading} headingLevel={2} />
            )}
          <Stepper steps={page.stepsCollection.items} />
        </div>
      </section>
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
    </PathwaysLayout>
  );
}
