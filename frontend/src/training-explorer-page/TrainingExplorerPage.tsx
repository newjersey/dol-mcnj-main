import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { useContentfulClient } from "../utils/useContentfulClient";
import { TRAINING_EXPLORER_PAGE_QUERY } from "../queries/trainingExplorer";
import { TrainingExplorerPageProps } from "../types/contentful";
import { PageBanner } from "../components/PageBanner";
import { SearchBlock } from "../components/SearchBlock";
import { HowTo } from "../components/HowTo";
import { Accordion } from "../components/Accordion";
import { Interrupter } from "../components/Interrupter";
import { CtaBanner } from "../components/CtaBanner";
import { IconNames } from "../types/icons";
import { SectionHeading } from "../components/modules/SectionHeading";
import { usePageTitle } from "../utils/usePageTitle";

interface Props extends RouteComponentProps {
  client: Client;
}

export const TrainingExplorerPage = (props: Props): ReactElement => {
  const data: TrainingExplorerPageProps = useContentfulClient({
    query: TRAINING_EXPLORER_PAGE_QUERY,
  });

  const pageData = data?.trainingExplorerPage;

  const howToContent = {
    header: "How to use the Training Explorer",
    video: pageData?.demoVideoUrl,
    steps: [
      {
        heading: pageData?.stepOneHeading,
        icon: pageData?.stepOneIcon,
        description: pageData?.stepOneText,
      },
      {
        heading: pageData?.stepTwoHeading,
        icon: pageData?.stepTwoIcon,
        description: pageData?.stepTwoText,
      },
      {
        heading: pageData?.stepThreeHeading,
        icon: pageData?.stepThreeIcon,
        description: pageData?.stepThreeText,
      },
    ],
  };

  const interrupterContent = {
    header: pageData?.interrupterBannerHeading,
    links: pageData?.interrupterLinksCollection.items,
  };

  usePageTitle(`${pageData?.title} | New Jersey Career Central`);

  const seoObject = {
    title: `${pageData?.title} | New Jersey Career Central`,
    description: pageData?.pageDescription,
    image: pageData?.ogImage?.url,
    keywords: pageData?.keywords,
    url: props.location?.pathname,
  };

  return (
    <>
      {data && (
        <Layout
          client={props.client}
          seo={seoObject}
          footerComponent={
            <div className="cta-collection">
              <CtaBanner
                heading="Don’t see your question? Go to our FAQ page."
                noIndicator
                inlineButtons
                links={[
                  {
                    sys: {
                      id: "SeeallFAQs",
                    },
                    copy: "See all FAQs",
                    url: "/faq",
                    iconSuffix: "ArrowRight" as IconNames,
                  },
                ]}
                theme="blue"
              />
              <CtaBanner
                heading={pageData?.footerCtaHeading}
                inlineButtons
                noIndicator
                links={pageData?.footerCtaLinkCollection.items}
                theme="blue"
              />
            </div>
          }
        >
          <PageBanner {...pageData?.pageBanner} theme="green" />
          <SearchBlock drawerContent={pageData.drawerContent} />
          <HowTo {...howToContent} />
          <Interrupter {...interrupterContent} />
          <section className="landing-faq">
            <div className="container">
              <SectionHeading heading="Frequently Asked Questions" headingLevel={3} />
              {pageData?.faqsCollection.items.map((item, index: number) => (
                <Accordion
                  keyValue={index}
                  content={item.answer.json}
                  title={item.question}
                  key={item.sys?.id}
                />
              ))}
            </div>
          </section>
        </Layout>
      )}
    </>
  );
};
