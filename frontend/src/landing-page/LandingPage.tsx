import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { useContentfulClient } from "../utils/useContentfulClient";
import { HomepageProps } from "../types/contentful";
import { HOMEPAGE_QUERY } from "../queries/homePage";
import { HomeBanner } from "../components/HomeBanner";
import CardSlider from "../components/CardSlider";
import { IconCard } from "../components/IconCard";
import { SectionHeading } from "../components/modules/SectionHeading";
import { IntroBlocks } from "../components/IntroBlocks";

interface Props extends RouteComponentProps {
  client: Client;
}

export const LandingPage = (props: Props): ReactElement => {
  const data: HomepageProps = useContentfulClient({
    query: HOMEPAGE_QUERY,
  });

  const pageData = data?.homePage;

  return (
    <Layout client={props.client} noPad>
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
                  {pageData.toolsCollection.items.map((item) => {
                    const svgName =
                      item.sectionIcon === "explore"
                        ? "Explore"
                        : item.sectionIcon === "jobs"
                        ? "Jobs"
                        : item.sectionIcon === "support"
                        ? "Support"
                        : "Training";
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
            <CardSlider
              sectionId="jobs"
              cards={pageData.jobSearchToolLinksCollection.items}
              heading="All Job Search Tools"
              theme="blue"
            />
            <CardSlider
              sectionId="training"
              cards={pageData.trainingToolLinksCollection.items}
              heading="All Training Tools"
              theme="green"
            />
            <CardSlider
              sectionId="explore"
              cards={pageData.careerExplorationToolLinksCollection.items}
              heading="All Career Exploration Tools"
              theme="purple"
            />
            <CardSlider
              sectionId="support"
              cards={pageData.supportAndAssistanceLinksCollection.items}
              heading="All Support and Assistance Resources"
              theme="navy"
            />
          </>
        )}
      </div>
    </Layout>
  );
};
