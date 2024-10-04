import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { CareerPathwaysPageData, IndustryProps, ThemeColors } from "../types/contentful";
import { Layout } from "../components/Layout";
import { IndustrySelector } from "../components/IndustrySelector";
import { useContentful } from "../utils/useContentful";
import { NotFoundPage } from "../error/NotFoundPage";
import { CtaBanner } from "../components/CtaBanner";
import { usePageTitle } from "../utils/usePageTitle";
import pageImage from "../images/ogImages/careerPathways.png";
import { Icon } from "@material-ui/core";
import { Tooltip } from "react-tooltip";
import { Heading } from "../components/modules/Heading";
import { content } from "./content";
import { Info } from "@phosphor-icons/react";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";

interface Props extends RouteComponentProps {
  client: Client;
  slug?: string;
}

export const CareerPathwaysPage = (props: Props): ReactElement<Props> => {
  const [industry, setIndustry] = useState<IndustryProps>();

  const data: CareerPathwaysPageData = useContentful({ path: "/career-pathways" });
  const industryData: {
    industryCollection: {
      items: IndustryProps[];
    };
  } = useContentful({
    path: `/industry/${props.slug}`,
  });

  useEffect(() => {
    if (industryData) {
      setIndustry(industryData?.industryCollection.items[0]);
    }
  }, [industryData]);

  usePageTitle(`${data?.page.title} | ${process.env.REACT_APP_SITE_NAME}`);

  if (props.slug && industryData?.industryCollection?.items.length === 0) {
    return <NotFoundPage client={props.client} />;
  }

  const exploreLinks = data?.page.exploreButtonsCollection.items.map((link, index: number) => {
    const highlight =
      (index + 1) % 4 === 1
        ? "purple"
        : (index + 1) % 4 === 2
          ? "orange"
          : (index + 1) % 4 === 3
            ? "blue"
            : "green";
    return {
      ...link,
      iconPrefix: link.icon,
      highlight: highlight as ThemeColors,
    };
  });

  const breadcrumbs = data
    ? { items: [...data.page.pageBanner.breadcrumbsCollection.items] }
    : { items: [] };

  if (props.slug && industry) {
    breadcrumbs.items.push({
      copy: "NJ Career Pathways",
      url: `/career-pathways`,
      sys: {
        id: industry.sys.id,
      },
    });
  }

  const seoObject = {
    title: data
      ? `${data?.page.title} | ${process.env.REACT_APP_SITE_NAME}`
      : `Career Pathways | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      data?.page.pageDescription ||
      "Explore popular industries and careers in the state of New Jersey.",
    image: data?.page.ogImage?.url || pageImage,
    keywords: data?.page.keywords || [
      "New Jersey",
      "Career",
      "Job",
      "Training",
      "New Jersey Career Central",
      "Career Pathways",
    ],
    url: props.location?.pathname || "/career-pathways",
  };

  return (
    <>
      {data && (
        <Layout
          client={props.client}
          theme="support"
          noPad
          className="career-pathways-page"
          seo={seoObject}
        >
          <section className="banner">
            <div className="container">
              <div className="inner">
                <div className="top-nav">
                  <nav className="usa-breadcrumb" aria-label="Breadcrumbs">
                    <Icon>keyboard_backspace</Icon>
                    <ol className="usa-breadcrumb__list">
                      {data.page.pageBanner.breadcrumbsCollection?.items.map((crumb) => {
                        return (
                          <li
                            className="usa-breadcrumb__list-item"
                            key={crumb.sys?.id || crumb.copy}
                          >
                            <a className="usa-breadcrumb__link" href={crumb.url}>
                              {crumb.copy}
                            </a>
                          </li>
                        );
                      })}
                      <li className="usa-breadcrumb__list-item use-current" aria-current="page">
                        <span data-testid="title">
                          {data.page.pageBanner.breadcrumbTitle || data.page.title}
                        </span>
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="content">
                  <Heading level={1}>
                    {content.banner.title}
                    <span className="tag-item color-navy" data-tooltip-id="beta-tooltip"
                          data-tooltip-content={content.betaToolTip}>
                    <Info/> Beta
                  </span>
                    <Tooltip id="beta-tooltip" className="custom-tooltip" />
                  </Heading>
                  <p>{content.banner.description}</p>
                </div>
              </div>
            </div>
          </section>

          <IndustrySelector />
          <section className="body-copy">
            <div className="container">
              <div
                className="content"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdownToHTML(`${content.markdownSection}`),
                }}
              />
            </div>
          </section>
          <section className="contact-cta">
            <div className="container">
              <div className="inner">
                <Heading level={3}>{content.cta.heading}</Heading>
                <a href={content.cta.button.url} className="usa-button margin-right-0 primary">
                  {content.cta.button.text}
                </a>
              </div>
            </div>
          </section>
          <CtaBanner
            heading={data.page.exploreHeading}
            headingLevel={3}
            theme="purple"
            fullColor
            links={exploreLinks}
          />
        </Layout>
      )}
    </>
  );
};
