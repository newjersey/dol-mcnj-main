import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { useContentful } from "../utils/useContentful";
import { HomepageProps } from "../types/contentful";
import { HomeBanner } from "./components/HomeBanner";
import { SurveyMonkeyWidget } from "../components/SurveyMonkeyWidget";
import { usePageTitle } from "../utils/usePageTitle";
import pageImage from "../images/ogImages/homePage.jpg";
import { useTranslation } from "react-i18next";
import { content } from "./content";
import { CardProps } from "../components/Card";
import { TopTools } from "./components/TopTools";
import { Resources } from "./components/Resourses";

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

  return (
    <Layout client={props.client} noPad seo={seoObject}>
      <SurveyMonkeyWidget onlyOnPath="/" enabled={true} />
      <div className="home-page">
        <HomeBanner
          heading={t("LandingPage.bannerHeading")}
          images={content.banner.images}
          subheading={t("LandingPage.bannerSubheading")}
          message={t("LandingPage.bannerMessageCopy")}
          preload
        />
        <TopTools
          heading={t("LandingPage.topToolsHeader")}
          items={
            [
              {
                heading: t("LandingPage.topToolNavigatorHeading"),
                description: t("LandingPage.topToolNavigatorDescription"),
                icon: "Compass",
                link: {
                  href: "/navigator",
                  text: t("LandingPage.topToolNavigatorButtonText"),
                },
                theme: "blue",
              },
              {
                heading: t("LandingPage.topToolExplorerHeading"),
                description: t("LandingPage.topToolExplorerDescription"),
                icon: "Signpost",
                link: {
                  href: "/training",
                  text: t("LandingPage.topToolExplorerButtonText"),
                },
                theme: "green",
              },
              {
                heading: t("LandingPage.topToolPathwaysHeading"),
                description: t("LandingPage.topToolPathwaysDescription"),
                icon: "Path",
                link: {
                  href: "/career-pathways",
                  text: t("LandingPage.topToolPathwaysButtonText"),
                },
                theme: "purple",
              },
            ] as CardProps[]
          }
        />
        <Resources
          heading={t("LandingPage.resourcesHeading")}
          subheading={t("LandingPage.resourcesDescription")}
          items={[
            {
              heading: t("LandingPage.resourcesCard1"),
              icon: "Briefcase",
              theme: "blue",
              link: {
                href: "/tools#jobs",
              },
            },
            {
              heading: t("LandingPage.resourcesCard2"),
              icon: "Signpost",
              theme: "green",
              link: {
                href: "/tools#training",
              },
            },
            {
              heading: t("LandingPage.resourcesCard3"),
              icon: "Path",
              theme: "purple",
              link: {
                href: "/tools#career",
              },
            },
            {
              heading: t("LandingPage.resourcesCard4"),
              icon: "Lifebuoy",
              theme: "navy",
              link: {
                href: "/tools#resources",
              },
            },
          ]}
        />
      </div>
    </Layout>
  );
};
