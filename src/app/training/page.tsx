import { CtaBanner } from "@components/blocks/CtaBanner";
import { PageBanner } from "@components/blocks/PageBanner";
import { Stepper } from "@components/blocks/Stepper";
import { TrainingSearch } from "@components/blocks/TrainingSearch";
import { VideoBlock } from "@components/blocks/VideoBlock";
import { SectionHeading } from "@components/modules/SectionHeading";
import { client } from "@utils/client";
import { createButtonObject } from "@utils/createButtonObject";
import { TrainingExplorerPageProps } from "@utils/types";
import { TRAINING_EXPLORER_PAGE_QUERY } from "queries/trainingExplorer";
import { Accordion } from "@components/blocks/Accordion";
import { MainLayout } from "@components/global/MainLayout";
import { getNav } from "@utils/getNav";
import globalOgImage from "@images/globalOgImage.jpeg";
import { Steps } from "./Steps";
import { TrainingExplorerHeading } from "./TrainingExplorerHeading";

async function getData() {
  const { globalNav, mainNav, footerNav1, footerNav2 } = await getNav();

  const { page } = await client({
    query: TRAINING_EXPLORER_PAGE_QUERY,
  });
  return {
    page,
    globalNav,
    mainNav,
    footerNav1,
    footerNav2,
  };
}

export const revalidate = 1800;

export async function generateMetadata({}) {
  const { page } = (await getData()) as TrainingExplorerPageProps;

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

export default async function TrainingExplorerPage() {
  const { page, footerNav1, footerNav2, mainNav, globalNav } =
    (await getData()) as TrainingExplorerPageProps;

  const interrupterLinksConverter = page.interrupterLinksCollection?.items.map(
    (link) => {
      return createButtonObject(
        {
          ...link,
        },
        {
          svgName: "SupportBold",
          highlight: "navy",
        },
      );
    },
  );

  const navs = {
    footerNav1,
    footerNav2,
    mainNav,
    globalNav,
  };

  const stepArray = [
    {
      sys: { id: "step1" },
      heading: page.stepOneHeading,
      description: page.stepOneText,
      icon: page.stepOneIcon,
    },
    {
      sys: { id: "step2" },
      heading: page.stepTwoHeading,
      description: page.stepTwoText,
      icon: page.stepTwoIcon,
    },
    {
      sys: { id: "step3" },
      heading: page.stepThreeHeading,
      description: page.stepThreeText,
      icon: page.stepThreeIcon,
    },
  ];

  return (
    <MainLayout {...navs}>
      <div className="page trainingExplorer">
        <TrainingExplorerHeading heading={page.title} />

        <section className="howTo">
          <div className="container">
            {page.interrupterBannerHeading && (
              <SectionHeading heading={page.interrupterBannerHeading} />
            )}
            <VideoBlock video={page.demoVideoUrl} />
            <Stepper steps={stepArray} />
          </div>
        </section>
        <CtaBanner
          heading={page.interrupterBannerHeading}
          customLinks={interrupterLinksConverter}
          fullColor
          theme="navy"
        />
        <section className="faq">
          <div className="container">
            <SectionHeading
              headingLevel={3}
              heading="Frequently Asked Questions"
            />
            <Accordion items={page.faqsCollection.items} />
          </div>
          <CtaBanner
            heading="Don't see your question?"
            inlineButtons
            items={[
              {
                copy: "See all FAQs",
                url: "/faq",
              },
            ]}
          />
        </section>
        {page.footerCtaHeading &&
          page.footerCtaLinkCollection &&
          page.footerCtaLinkCollection.items.length > 0 && (
            <CtaBanner
              inlineButtons
              heading={page.footerCtaHeading}
              items={page.footerCtaLinkCollection.items}
            />
          )}
      </div>
    </MainLayout>
  );
}
