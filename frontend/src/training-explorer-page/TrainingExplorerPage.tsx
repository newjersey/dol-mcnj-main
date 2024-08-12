import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingExplorerPageProps } from "../types/contentful";
import { HowTo } from "../components/HowTo";
import { Accordion } from "../components/Accordion";
import { Interrupter } from "../components/Interrupter";
import { CtaBanner } from "../components/CtaBanner";
import { IconNames } from "../types/icons";
import { SectionHeading } from "../components/modules/SectionHeading";
import { useContentful } from "../utils/useContentful";
import { useTranslation } from "react-i18next";
import pageImage from "../images/ogImages/trainingExplorer.jpg";
import { TrainingExplorerHeading } from "../components/TrainingExplorerHeading";

interface Props extends RouteComponentProps {
  client: Client;
}

export const TrainingExplorerPage = (props: Props): ReactElement => {
  const { t } = useTranslation();
  const data: TrainingExplorerPageProps = useContentful({
    path: "/training-explorer",
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

  const seoObject = {
    title: pageData?.title
      ? `${pageData?.title} | ${process.env.REACT_APP_SITE_NAME}`
      : `New Jersey Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
    description:
      pageData?.pageDescription ||
      "Certifications, Professional Development, Apprenticeships & More!",
    image: pageData?.ogImage?.url || pageImage,
    keywords: pageData?.keywords,
    url: props.location?.pathname || "/training",
  };

  const steps = [
    t("TrainingPage.trainingStepOneDescription"),
    t("TrainingPage.trainingStepTwoDescription"),
    t("TrainingPage.trainingStepThreeDescription"),
  ];

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
          <TrainingExplorerHeading
            steps={steps}
            title={pageData.title}
            drawerContent={pageData.drawerContent}
          />

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
