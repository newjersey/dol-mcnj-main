import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { useContentfulClient } from "../utils/useContentfulClient";
import { AllSupportPageProps } from "../types/contentful";
import { ALL_SUPPORT_PAGE_QUERY } from "../queries/allSupportPage";
import { PageBanner } from "../components/PageBanner";
import { IconCard } from "../components/IconCard";
import { FooterCta } from "../components/FooterCta";

interface Props extends RouteComponentProps {
  client: Client;
}

export const AllSupportPage = (props: Props): ReactElement => {
  const data: AllSupportPageProps = useContentfulClient({
    query: ALL_SUPPORT_PAGE_QUERY,
  });

  // sort categories by title
  data.categories.items.sort((a, b) => a.title.localeCompare(b.title));

  // filter out categories that is titled "Other Assistance"
  const filteredCategories: AllSupportPageProps["categories"]["items"] =
    data.categories.items.filter((category) => category.title !== "Other Assistance");

  const otherAssistance = data.categories.items.find(
    (category) => category.title === "Other Assistance"
  );

  // add "Other Assistance" to the end of the list
  if (otherAssistance) {
    filteredCategories.push(otherAssistance);
  }

  return (
    <Layout
      client={props.client}
      theme="support"
      footerComponent={
        data && <FooterCta heading={data.page.footerCtaHeading} link={data.page.footerCtaLink} />
      }
    >
      {data && (
        <>
          <PageBanner {...data.page.pageBanner} theme="navy" />
          <section className="all-support-cards">
            <div className="container">
              <div className="flex-card-row section-padding">
                {filteredCategories.map((card) => (
                  <IconCard
                    svg="SupportBold"
                    title={card.title}
                    theme="navy"
                    url={`/support-resources/${card.slug}`}
                    key={card.sys.id}
                    description={card.description}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
};
