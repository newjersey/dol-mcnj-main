import { CtaBanner } from "@components/blocks/CtaBanner";
import { PageBanner } from "@components/blocks/PageBanner";
import { River } from "@components/blocks/River";
import { Stepper } from "@components/blocks/Stepper";
import { IconCard } from "@components/modules/IconCard";
import { SectionHeading } from "@components/modules/SectionHeading";
import { NAVIGATOR_PAGE_DATA as pageData } from "@data/pages/navigator";
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

export default async function CareerNavigatorPage() {
  return (
    <div className="page careerNavigator">
      <PageBanner {...pageData.en.banner} />
      <section className="howTo">
        <div className="container">
          <SectionHeading {...pageData.en.howTo.sectionHeading} />
        </div>
        <div className="container ">
          <Stepper theme="purple" steps={pageData.en.howTo.cards} />
        </div>
      </section>
      <CtaBanner {...pageData.en.midPageCta} />
      <CtaBanner {...pageData.en.ctaBanner} />
      <section className="info">
        <div className="container">
          <SectionHeading {...pageData.en.info.sectionHeading} />
        </div>
        <div className="container narrow">
          <div className="inner">
            {pageData.en.info.cards.map((card) => {
              return <IconCard key={card.sys?.id} {...card} />;
            })}
          </div>
        </div>
      </section>
      <River {...pageData.en.river} />
      <CtaBanner {...pageData.en.footerCta} />
    </div>
  );
}
