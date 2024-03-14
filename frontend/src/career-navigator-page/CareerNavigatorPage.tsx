import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Layout } from "../components/Layout";
import { useContentful } from "../utils/useContentful";
import { CareerNavigatorPageProps, ThemeColors } from "../types/contentful";
import { PageBanner } from "../components/PageBanner";
import { IconCard } from "../components/IconCard";
import { SectionHeading } from "../components/modules/SectionHeading";
import { Stepper } from "../components/Stepper";
import { Cta } from "../components/modules/Cta";
import { CtaBanner } from "../components/CtaBanner";
import { River } from "../components/River";
import { FooterCta } from "../components/FooterCta";
import { usePageTitle } from "../utils/usePageTitle";

interface Props extends RouteComponentProps {
  client: Client;
  slug?: string;
}

export const CareerNavigatorPage = (props: Props): ReactElement<Props> => {
  const data: CareerNavigatorPageProps = useContentful({ path: "/career-navigator" });

  const interrupterLinks = data?.page.interrupterLinks?.items.map((link, index: number) => {
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

  usePageTitle(`${data?.page.title} | ${process.env.REACT_APP_SITE_NAME}`);

  const seoObject = {
    title: `${data?.page.title} | ${process.env.REACT_APP_SITE_NAME}`,
    description: data?.page.pageDescription,
    image: data?.page.ogImage?.url,
    keywords: data?.page.keywords,
    url: props.location?.pathname,
  };

  return (
    <>
      {data && (
        <Layout
          client={props.client}
          seo={seoObject}
          theme="support"
          footerComponent={
            <FooterCta
              headingLevel={4}
              heading={data?.page.footerCtaHeading}
              link={data?.page.footerCtaLink}
            />
          }
        >
          <div className="career-navigator">
            <PageBanner {...data.page.pageBanner} />
            <section className="opportunity-cards">
              <div className="container">
                {data.page.opportunitiesHeading && (
                  <SectionHeading heading={data.page.opportunitiesHeading} />
                )}
                <div className="inner">
                  {data.page.opportunityCards.items.map((card, index: number) => {
                    const cardColor = index % 2 === 0 ? "blue" : "purple";
                    const isExternal = card.url?.includes("http");
                    return (
                      <IconCard
                        key={card.sys ? card.sys.id : card.copy}
                        title={card.copy}
                        description={card.description}
                        fill
                        theme={cardColor}
                        icon={card.icon}
                        indicator={isExternal ? "ArrowRight" : undefined}
                        url={card.url}
                      />
                    );
                  })}
                </div>
              </div>
            </section>
            <section>
              <div className="container">
                {data.page.stepsHeading && <SectionHeading heading={data.page.stepsHeading} />}
              </div>
              <div className="container">
                <div className="steps">
                  {data.page.stepsCollection && (
                    <Stepper theme="purple" steps={data.page.stepsCollection.items} />
                  )}
                </div>
              </div>
            </section>
            <section className="mid-cta">
              {data.page.midPageCtaLinks && (
                <Cta
                  heading={data.page.midPageCtaHeading}
                  linkDirection="row"
                  noIndicator
                  theme="blue"
                  links={data.page.midPageCtaLinks?.items}
                />
              )}
            </section>

            <CtaBanner
              heading={data.page.interrupterHeading}
              headingLevel={3}
              theme="purple"
              fullColor
              links={interrupterLinks}
            />
            <section className="info-cards">
              <div className="container">
                {data.page.infoHeading && <SectionHeading heading={data.page.infoHeading} />}
                <div className="info-card-row">
                  {data.page.infoCards?.items.map((card, index: number) => {
                    const themeColor =
                      (index + 1) % 4 === 1
                        ? "blue"
                        : (index + 1) % 4 === 2
                          ? "green"
                          : (index + 1) % 4 === 3
                            ? "purple"
                            : "navy";
                    return (
                      <IconCard
                        {...card}
                        theme={themeColor}
                        title={card.heading}
                        key={card.sys?.id}
                      />
                    );
                  })}
                </div>
              </div>
            </section>
            {data.page.river && <River items={data.page.river.items} />}
          </div>
        </Layout>
      )}
    </>
  );
};
