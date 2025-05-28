import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Client } from "../domain/Client";
import pageImage from "../images/ogImages/homePage.jpg";
import { Layout } from "../components/Layout";
import { HeroBanner } from "../components/HeroBanner";
import { useTranslation } from "react-i18next";
import { Card, CardProps } from "../components/Card";

interface Props extends RouteComponentProps {
  client: Client;
}

const seoObject = {
  title: `Tools | ${process.env.REACT_APP_SITE_NAME}`,
  description: "Certifications, Prage?.url ofessional Development, Apprenticeships & More!",
  image: pageImage,
  url: "/tools",
};

export const ToolRow = ({
  id,
  heading,
  items,
  mainCard,
  theme,
}: {
  id: string;
  heading?: string;
  items: CardProps[];
  mainCard?: CardProps;
  theme?: "blue" | "green" | "purple" | "navy";
}) => {
  return (
    <section className={`toolRow${theme ? ` theme-${theme}` : ""}`} id={id}>
      <div className="container">
        <h3>{heading}</h3>
        <div className="inner">
          {mainCard && <Card {...mainCard} className="main" theme={theme} />}
          <div className={`cards${!mainCard ? " wide" : ""}`}>
            {items.map((item) => (
              <Card key={item.heading} {...item} outline />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ToolsPage = (props: Props): ReactElement => {
  const { t } = useTranslation();

  return (
    <Layout client={props.client} seo={seoObject}>
      <div className="tools-page">
        <HeroBanner
          eyebrow={t("ToolsPage.heroBannerEyebrow")}
          heading={t("ToolsPage.heroBannerHeading")}
        />

        <ToolRow
          id="jobs"
          heading={t("ToolsPage.jobHeading")}
          theme="blue"
          items={[
            {
              heading: t("ToolsPage.jobLink1Heading"),
              description: t("ToolsPage.jobLink1Description"),
              icon: "ArrowSquareOut",
              iconWeight: "regular",
              link: {
                href: "https://www.naswa.org/partnerships/nlx",
              },
            },
            {
              heading: t("ToolsPage.jobLink2Heading"),
              description: t("ToolsPage.jobLink2Description"),
              icon: "ArrowSquareOut",
              iconWeight: "regular",
              link: {
                href: "https://www.nj.gov/labor/labormarketinformation/",
              },
            },
            {
              heading: t("ToolsPage.jobLink3Heading"),
              description: t("ToolsPage.jobLink3Description"),
              icon: "ArrowSquareOut",
              iconWeight: "regular",
              link: {
                href: "https://www.nj.gov/labor/career-services/apprenticeship/",
              },
            },
          ]}
          mainCard={{
            heading: t("LandingPage.topToolNavigatorHeading"),
            description: t("LandingPage.topToolNavigatorDescription"),
            icon: "Compass",
            link: {
              href: "/navigator",
              text: t("LandingPage.topToolNavigatorButtonText"),
            },
          }}
        />
        <ToolRow
          id="training"
          heading={t("ToolsPage.trainingHeading")}
          theme="green"
          items={[
            {
              heading: t("ToolsPage.trainingLink1Heading"),
              description: t("ToolsPage.trainingLink1Description"),
              link: {
                href: "/support-resources/tuition-assistance",
              },
            },
            {
              heading: t("ToolsPage.trainingLink2Heading"),
              description: t("ToolsPage.trainingLink2Description"),
              link: {
                href: "/training-provider-resources",
              },
            },
          ]}
          mainCard={{
            heading: t("LandingPage.topToolExplorerHeading"),
            description: t("LandingPage.topToolExplorerDescription"),
            icon: "Signpost",
            link: {
              href: "/training",
              text: t("LandingPage.topToolExplorerButtonText"),
            },
          }}
        />
        <ToolRow
          id="career"
          theme="purple"
          heading={t("ToolsPage.careerHeading")}
          items={[
            {
              heading: t("ToolsPage.careerLink1Heading"),
              description: t("ToolsPage.careerLink1Description"),
              link: {
                href: "/in-demand-occupations",
              },
            },
          ]}
          mainCard={{
            heading: t("LandingPage.topToolPathwaysHeading"),
            description: t("LandingPage.topToolPathwaysDescription"),
            icon: "Path",
            link: {
              href: "/career-pathways",
              text: t("LandingPage.topToolPathwaysButtonText"),
            },
          }}
        />
        <ToolRow
          id="resources"
          heading={t("ToolsPage.supportHeading")}
          theme="navy"
          items={[
            {
              heading: t("ToolsPage.supportLink1Heading"),
              description: t("ToolsPage.supportLink1Description"),
              link: {
                href: "/support-resources/career-support",
              },
            },
            {
              heading: t("ToolsPage.supportLink2Heading"),
              description: t("ToolsPage.supportLink2Description"),

              link: {
                href: "/support-resources/tuition-assistance",
              },
            },
            {
              heading: t("ToolsPage.supportLink3Heading"),
              description: t("ToolsPage.supportLink3Description"),

              link: {
                href: "/support-resources/other",
              },
            },
            {
              heading: t("ToolsPage.supportLink4Heading"),
              description: t("ToolsPage.supportLink4Description"),

              link: {
                href: "/faq",
              },
            },
          ]}
        />
      </div>
    </Layout>
  );
};
