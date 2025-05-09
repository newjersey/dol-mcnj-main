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
import { Heading } from "../components/modules/Heading";
import { content } from "./content";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";
import { HeroBanner } from "../components/HeroBanner";
import pathwaysImage from "../images/pathways.png";
// import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";

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
          <HeroBanner
            eyebrow={content.banner.title}
            heading={content.banner.subheading}
            message={content.banner.description}
            image={pathwaysImage}
            theme="purple"
            buttons={[
              {
                text: "Start exploring",
                href: "/career-pathways#industry-selector",
                icon: "ArrowDown",
                onClick: () => {
                  const element = document.getElementById("industry-selector");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                },
              },
            ]}
          />

          <IndustrySelector />
          <section className="pathways body-copy container">
            <div className="container">
              {content.copySections.map((section, index) => (
                <div key={`body-copy-${index}`} className="contentContainer">
                  <div className="image">
                    <img src={section.image} alt="" placeholder="blur" />
                  </div>
                  <div className="contentBlocks">
                    {section.blocks.map((block) => (
                      <div
                        key={block.copy}
                        className={`content block-${block.theme}`}
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdownToHTML(`${block.copy}`),
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
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
