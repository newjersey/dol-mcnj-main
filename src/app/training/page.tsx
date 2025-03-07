import { CtaBanner } from "@components/blocks/CtaBanner";
import { Stepper } from "@components/blocks/Stepper";
import { VideoBlock } from "@components/blocks/VideoBlock";
import { SectionHeading } from "@components/modules/SectionHeading";
import { Accordion } from "@components/blocks/Accordion";
import globalOgImage from "@images/globalOgImage.jpeg";
import { TrainingExplorerHeading } from "./TrainingExplorerHeading";
import { TRAINING_EXPLORER_PAGE_DATA as pageData } from "@data/pages/training";
import { SupportedLanguages } from "@utils/types/types";
import { cookies } from "next/headers";

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
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <div className="page trainingExplorer">
      <TrainingExplorerHeading {...pageData[lang].banner} lang={lang} />
      <section className="howTo">
        <div className="container">
          <SectionHeading heading={pageData[lang].resourceHeading} />
          <VideoBlock video={pageData[lang].demoVideoUrl} />
          <Stepper steps={pageData[lang].iconCards} />
        </div>
      </section>
      <CtaBanner {...pageData[lang].interruptor} />
      <section className="faq">
        <div className="container">
          <SectionHeading {...pageData[lang].faqs.heading} />
          <Accordion items={pageData[lang].faqs.items} />
        </div>
        <CtaBanner {...pageData[lang].faqs.cta} />
      </section>
      <CtaBanner {...pageData[lang].footerCta} />
    </div>
  );
}
