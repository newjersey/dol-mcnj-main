import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { useContentful } from "../utils/useContentful";
import { HomepageProps } from "../types/contentful";
import { HomeBanner } from "../components/HomeBanner";
import CardRow from "../components/CardRow";
import { IconCard } from "../components/IconCard";
import { SectionHeading } from "../components/modules/SectionHeading";
import { IntroBlocks } from "../components/IntroBlocks";
import { UpdateNotifier } from "../components/UpdateNotifier";
import { usePageTitle } from "../utils/usePageTitle";

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
    title: pageData?.title,
    description: pageData?.pageDescription,
    image: pageData?.ogImage?.url,
    keywords: pageData?.keywords,
    url: props.location?.pathname,
  };

  if (
    process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "false" &&
    pageData?.careerExplorationToolLinksCollection?.items
  ) {
    const index = pageData.careerExplorationToolLinksCollection.items.findIndex(
      (item) => item.copy === "NJ Career Pathways",
    );

    if (index !== -1) {
      pageData.careerExplorationToolLinksCollection.items.splice(index, 1);
    }
  }

  const careerSectionActive =
    process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "true" ||
    process.env.REACT_APP_FEATURE_CAREER_NAVIGATOR === "true";

  if (!careerSectionActive) {
    const index = pageData?.toolsCollection?.items.findIndex(
      (item) => item.copy === "Explore Careers",
    );
    if (index !== -1) {
      pageData?.toolsCollection?.items.splice(index, 1);
    }
  }

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
            {careerSectionActive && (
              <CardRow
                sectionId="explore"
                cards={pageData.careerExplorationToolLinksCollection.items}
                heading="All Career Exploration Tools"
                theme="purple"
              />
            )}
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
