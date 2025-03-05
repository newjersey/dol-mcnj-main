import { CtaBanner } from "@components/blocks/CtaBanner";
import { Stepper } from "@components/blocks/Stepper";
import { VideoBlock } from "@components/blocks/VideoBlock";
import { SectionHeading } from "@components/modules/SectionHeading";
import { Accordion } from "@components/blocks/Accordion";
import globalOgImage from "@images/globalOgImage.jpeg";
import { TrainingExplorerHeading } from "./TrainingExplorerHeading";
import { TRAINING_EXPLORER_PAGE_DATA as pageData } from "@data/pages/training";

export const revalidate = 1800;

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

export default async function TrainingExplorerPage() {
  return (
    <div className="page trainingExplorer">
      <TrainingExplorerHeading {...pageData.en.banner} />
      <section className="howTo">
        <div className="container">
          <SectionHeading heading={pageData.en.resourceHeading} />
          <VideoBlock video={pageData.en.demoVideoUrl} />
          <Stepper steps={pageData.en.iconCards} />
        </div>
      </section>
      <CtaBanner {...pageData.en.interruptor} />
      <section className="faq">
        <div className="container">
          <SectionHeading {...pageData.en.faqs.heading} />
          <Accordion items={pageData.en.faqs.items} />
        </div>
        <CtaBanner {...pageData.en.faqs.cta} />
      </section>
      <CtaBanner {...pageData.en.footerCta} />
    </div>
  );
}
