import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Layout } from "../components/Layout";
import { CAREER_NAVIGATOR_QUERY } from "../queries/careerNavigator";
import { useContentfulClient } from "../utils/useContentfulClient";
import { CareerNavigatorPageProps } from "../types/contentful";
import { PageBanner } from "../components/PageBanner";
import { IconCard } from "../components/IconCard";
import { SectionHeading } from "../components/modules/SectionHeading";
import { Stepper } from "../components/Stepper";
import { Cta } from "../components/modules/Cta";

interface Props extends RouteComponentProps {
  client: Client;
  slug?: string;
}

export const CareerNavigatorPage = (props: Props): ReactElement<Props> => {
  const data: CareerNavigatorPageProps = useContentfulClient({ query: CAREER_NAVIGATOR_QUERY });

  return (
    <Layout client={props.client} theme="support">
      {data && (
        <div className="career-navigator">
          <PageBanner {...data.page.pageBanner} />
          <section className="opportunity-cards">
            <div className="container plus">
              {data.page.opportunitiesHeading && (
                <SectionHeading heading={data.page.opportunitiesHeading} />
              )}
              <div className="inner">
                {data.page.opportunityCards.items.map((card, index: number) => {
                  const cardColor = index % 2 === 0 ? "blue" : "purple";
                  const isExternal = card.url?.includes("http");
                  return (
                    <IconCard
                      key={card.sys ? card.sys.id : card.label}
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
            <div className="container plus">
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
          <section>
            {data.page.midPageCtaLinks && (
              <Cta
                heading={data.page.midPageCtaHeading}
                linkDirection="row"
                theme="blue"
                links={data.page.midPageCtaLinks?.items}
              />
            )}
          </section>
        </div>
      )}
    </Layout>
  );
};
