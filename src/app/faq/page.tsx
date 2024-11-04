import { CtaBanner } from "@components/blocks/CtaBanner";
import { FaqSection } from "@components/blocks/FaqSection";
import { PageBanner } from "@components/blocks/PageBanner";
import { client } from "@utils/client";
import { createButtonObject } from "@utils/createButtonObject";
import { FaqPageProps, LinkProps, ThemeColors } from "@utils/types";
import { FAQ_PAGE_QUERY } from "queries/faqPage";
import globalOgImage from "@images/globalOgImage.jpeg";

async function getData() {
  const { page } = await client({
    query: FAQ_PAGE_QUERY,
  });

  return {
    page,
  };
}
export const revalidate = 86400;

export async function generateMetadata({}) {
  const { page } = (await getData()) as FaqPageProps;

  return {
    title: `${page.title} | ${process.env.REACT_APP_SITE_NAME}`,
    description: page.pageDescription,
    keywords: page.keywords,
    openGraph: {
      images: [globalOgImage.src],
    },
  };
}

export default async function FaqPage() {
  const { page } = (await getData()) as FaqPageProps;

  const ctaLinkConverter = (links: LinkProps[]) => {
    return links.map((link, index: number) => {
      const theme =
        index % 4 === 0
          ? "orange"
          : index % 4 === 1
            ? "green"
            : index % 4 === 2
              ? "purple"
              : "blue";

      const icon =
        index % 4 === 0
          ? "Fire"
          : index % 4 === 1
            ? "GraduationCap"
            : index % 4 === 2
              ? "Lifebuoy"
              : "ChalkboardTeacher";
      return createButtonObject(
        {
          ...link,
        },
        {
          highlight: theme as ThemeColors,
          iconPrefix: icon,
        },
      );
    });
  };

  return (
    <div className="page faq">
      <PageBanner {...page.pageBanner} />
      <FaqSection items={page.categoriesCollection.items} />
      <CtaBanner
        fullColor
        {...page.resourceLinks}
        heading={page.resourceLinkHeading}
        headingLevel={2}
        customLinks={ctaLinkConverter(page.resourceLinks.items)}
      />
      <CtaBanner
        headingLevel={3}
        heading="Still have questions?"
        inlineButtons
        items={[
          {
            copy: "Contact Us",
            url: "/contact",
          },
        ]}
      />
    </div>
  );
}
