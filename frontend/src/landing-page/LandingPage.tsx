import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { useEffect } from "react";
import { Client } from "../domain/Client";
import { Certificates } from "../domain/CredentialEngine";
import { Layout } from "../components/Layout";
import { useContentful } from "../utils/useContentful";
import { HomepageProps } from "../types/contentful";
import { HomeBanner } from "../components/HomeBanner";
import CardRow from "../components/CardRow";
import { IconCard } from "../components/IconCard";
import { SectionHeading } from "../components/modules/SectionHeading";
import { IntroBlocks } from "../components/IntroBlocks";
import { UpdateNotifier } from "../components/UpdateNotifier";
import { usePageTitle } from "../utils/usePageTitle";
import pageImage from "../images/ogImages/homePage.jpg";

interface Props extends RouteComponentProps {
  client: Client;
}

export const LandingPage = (props: Props): ReactElement => {
  const data: HomepageProps = useContentful({
    path: `/home-page`,
  });

  const pageData = data?.homePage;

  usePageTitle(pageData?.title);

  const seoObject = {
    title: pageData?.title || (process.env.REACT_APP_SITE_NAME as string),
    description:
      pageData?.pageDescription ||
      "Your home for career exploration, job training, and workforce support tools and resources in New Jersey.",
    image: pageData?.ogImage?.url || pageImage,
    keywords: pageData?.keywords,
    url: props.location?.pathname || "/",
  };

  function findSvg(sectionIcon: string | undefined) {
    switch (sectionIcon) {
      case "explore":
        return "Explore";
      case "jobs":
        return "Jobs";
      case "support":
        return "Support";
      default:
        return "Training";
    }
  }

  useEffect(() => {
    props.client.getAllCertificates(0, 5, "^search:recordCreated", false, {
      onSuccess: (data: Certificates) => {
        console.log(`Some JSON, maybe: ${JSON.stringify(data, null, 2)}`);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
  });

  return (
    <Layout client={props.client} noPad seo={seoObject}>
      <div className="home-page">
        {data && (
          <>
            <HomeBanner
              heading={pageData.title}
              buttonCopy={pageData.bannerButtonCopy}
              image={pageData.bannerImage}
              subheading={pageData.bannerMessage}
            />
            {pageData.introBlocks && <IntroBlocks {...pageData.introBlocks} />}
            <div className="container" id="homeContent">
              <div className="tools">
                <SectionHeading heading="Explore Tools" strikeThrough />
                <div className="tiles">
                  {pageData.toolsCollection?.items.map((item) => {
                    const svgName = findSvg(item.sectionIcon);
                    return (
                      <IconCard
                        key={item.sys.id}
                        centered
                        svg={svgName}
                        title={item.copy}
                        url={item.url}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <CardRow
              sectionId="jobs"
              cards={pageData.jobSearchToolLinksCollection.items}
              heading="All Job Search Tools"
              theme="blue"
            />
            <CardRow
              sectionId="training"
              cards={pageData.trainingToolLinksCollection.items}
              heading="All Training Tools"
              theme="green"
            />
            <CardRow
              sectionId="support"
              cards={pageData.supportAndAssistanceLinksCollection.items}
              heading="All Support and Assistance Resources"
              theme="navy"
            />
          </>
        )}
        {process.env.REACT_APP_FEATURE_PINPOINT === "true" && <UpdateNotifier />}
      </div>
    </Layout>
  );
};
