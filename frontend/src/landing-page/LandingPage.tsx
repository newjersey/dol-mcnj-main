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
import pageImage from "../images/ogImages/homePage.jpg";
import { useTranslation } from "react-i18next";

interface Props extends RouteComponentProps {
  client: Client;
}

export const LandingPage = (props: Props): ReactElement => {
  const data: HomepageProps = useContentful({
    path: `/home-page`,
  });

  const pageData = data?.homePage;
  const { t } = useTranslation();

  usePageTitle(pageData?.title);

  const seoObject = {
    title: pageData?.title || (process.env.REACT_APP_SITE_NAME as string),
    pageDescription:
      "Explore My Career NJ to find job training, career resources, and employment opportunities with the New Jersey Department of Labor.",
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

  return (
    <Layout client={props.client} noPad seo={seoObject}>
      <div className="home-page">
        {data && (
          <>
            <HomeBanner
              heading={pageData.title}
              buttonCopy={pageData.bannerButtonCopy}
              image={pageData.bannerImage}
              subheading={t("LandingPage.bannerSubheading")}
              message={t("LandingPage.bannerMessageCopy")}
              preload
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
              allSameIcon
              cards={pageData.jobSearchToolLinksCollection.items}
              heading="All Job Search Tools"
              theme="blue"
            />
            <CardRow
              sectionId="training"
              allSameIcon
              cards={pageData.trainingToolLinksCollection.items}
              heading="All Training Tools"
              theme="green"
            />
            <CardRow
              sectionId="explore"
              allSameIcon
              cards={pageData.careerExplorationToolLinksCollection.items}
              heading="All Career Exploration Resources"
              theme="purple"
            />
            <CardRow
              sectionId="support"
              allSameIcon
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
