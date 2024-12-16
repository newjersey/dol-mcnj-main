import { CtaBanner } from "@components/blocks/CtaBanner";
import { Stepper } from "@components/blocks/Stepper";
import { VideoBlock } from "@components/blocks/VideoBlock";
import { SectionHeading } from "@components/modules/SectionHeading";
import { TrainingExplorerPageProps } from "@utils/types";
import { Accordion } from "@components/blocks/Accordion";
import globalOgImage from "@images/globalOgImage.jpeg";
import { TrainingExplorerHeading } from "./TrainingExplorerHeading";

async function getData() {
  const pageData = await fetch(
    `${process.env.REACT_APP_SITE_URL}/api/pageData?slug=training`
  );

  return {
    pageData: await pageData.json(),
  };
}

export const revalidate = 1800;

export async function generateMetadata({}) {
  const { pageData } = (await getData()) as TrainingExplorerPageProps;

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

export default async function TrainingExplorerPage() {
  const { pageData } = (await getData()) as TrainingExplorerPageProps;

  return (
    <div className="page trainingExplorer">
      <TrainingExplorerHeading {...pageData.banner} />
      <section className="howTo">
        <div className="container">
          <SectionHeading heading={pageData.resourceHeading} />
          <VideoBlock video={pageData.demoVideoUrl} />
          <Stepper steps={pageData.iconCards} />
        </div>
      </section>
      <CtaBanner {...pageData.interruptor} />
      <section className="faq">
        <div className="container">
          <SectionHeading {...pageData.faqs.heading} />
          <Accordion items={pageData.faqs.items} />
        </div>
        <CtaBanner {...pageData.faqs.cta} />
      </section>
      <CtaBanner {...pageData.footerCta} />
    </div>
  );
}
