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
import { ArrowRight } from "@phosphor-icons/react";
import { Interrupter } from "../components/Interrupter";
import { Heading } from "../components/modules/Heading";

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
        header: pageData?.stepOneHeading,
        icon: pageData?.stepOneIcon,
        text: pageData?.stepOneText,
      },
      {
        header: pageData?.stepTwoHeading,
        icon: pageData?.stepTwoIcon,
        text: pageData?.stepTwoText,
      },
      {
        header: pageData?.stepThreeHeading,
        icon: pageData?.stepThreeIcon,
        text: pageData?.stepThreeText,
      },
    ],
  };

  const interrupterContent = {
    header: pageData?.interrupterBannerHeading,
    links: pageData?.interrupterLinksCollection.items,
  };

  return (
    <Layout client={props.client}>
      {data && (
        <>
          <PageBanner noCrumbs {...pageData?.pageBanner} theme="green" />
          <SearchBlock />
          <HowTo {...howToContent} />
          <Interrupter {...interrupterContent} />
          <section className="landing-faq">
            <div className="container">
              <Heading level={3}>Frequently Asked Questions</Heading>
              {pageData?.faqsCollection.items.map((item, index: number) => (
                <Accordion
                  keyValue={index}
                  content={item.answer.json}
                  title={item.question}
                  key={item.sys?.id}
                />
              ))}
              <div className="cta">
                <Heading level={4}>Don't see your question?</Heading>
                <a href="/faq" className="usa-button">
                  See all FAQs
                  <ArrowRight color="#fff" size={20} />
                </a>
              </div>
            </div>
          </section>
          <section className="footer-cta">
            <Heading level={4}>{pageData?.footerCtaHeading}</Heading>
            {pageData?.footerCtaLinkCollection.items.map((link) => (
              <a
                key={link.sys?.id}
                href={link.url}
                className={`usa-button${link.className ? ` ${link.className}` : ""}`}
              >
                {link.copy}
              </a>
            ))}
          </section>
        </>
      )}
    </Layout>
  );
};
