import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { useContentful } from "../utils/useContentful";
import { HomepageProps } from "../types/contentful";
import { HomeBanner } from "../components/HomeBanner";
// import CardRow from "../components/CardRow";
// import { IconCard } from "../components/IconCard";
// import { SectionHeading } from "../components/modules/SectionHeading";
// import { IntroBlocks } from "../components/IntroBlocks";
import { usePageTitle } from "../utils/usePageTitle";
import pageImage from "../images/ogImages/homePage.jpg";
import { useTranslation } from "react-i18next";
import medical from "../images/medical.jpg";
import mechanic from "../images/mechanic.jpg";
import welder from "../images/welder.jpg";

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

  // function findSvg(sectionIcon: string | undefined) {
  //   switch (sectionIcon) {
  //     case "explore":
  //       return "Explore";
  //     case "jobs":
  //       return "Jobs";
  //     case "support":
  //       return "Support";
  //     default:
  //       return "Training";
  //   }
  // }

  return (
    <Layout client={props.client} noPad seo={seoObject}>
      <div className="home-page">
        <HomeBanner
          heading={t("LandingPage.bannerHeading")}
          images={[medical, mechanic, welder]}
          subheading={t("LandingPage.bannerSubheading")}
          message={t("LandingPage.bannerMessageCopy")}
          preload
        />
      </div>
    </Layout>
  );
};
