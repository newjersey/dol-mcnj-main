import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { AllSupportPageProps } from "../types/contentful";
import { PageBanner } from "../components/PageBanner";
import { IconCard } from "../components/IconCard";
import { FooterCta } from "../components/FooterCta";
import { usePageTitle } from "../utils/usePageTitle";
import { useContentful } from "../utils/useContentful";
import pageImage from "../images/ogImages/supportAssistance.jpg";

interface Props extends RouteComponentProps {
  client: Client;
}

export const AllSupportPage = (props: Props): ReactElement => {
  const data: AllSupportPageProps = useContentful({
    path: `/all-support`,
  });

  // sort categories by title
  data?.categories.items.sort((a, b) => a.title.localeCompare(b.title));

  // filter out categories that is titled "Other Assistance"
  const filteredCategories: AllSupportPageProps["categories"]["items"] =
    data?.categories.items.filter((category) => category.title !== "Other Assistance");

  const otherAssistance = data?.categories.items.find(
    (category) => category.title === "Other Assistance",
  );

  // add "Other Assistance" to the end of the list
  if (otherAssistance) {
    filteredCategories.push(otherAssistance);
  }

  usePageTitle(`${data?.page.title} | ${process.env.REACT_APP_SITE_NAME}`);

  const seoObject = {
    title: data
      ? `${data?.page.title} | ${process.env.REACT_APP_SITE_NAME}`
      : `Support and Assistance Resources | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      data?.page.pageDescription || "Browse support and assistance resources by category.",
    image: data?.page.ogImage?.url || pageImage,
    keywords: data?.page.keywords || [
      "New Jersey",
      "Support",
      "Assistance",
      "Resources",
      "Training",
      "Job",
      "Career",
      "My Career NJ",
    ],
    url: props.location?.pathname || "/support-resources",
  };

  return (
    <>
      {data && (
        <Layout
          client={props.client}
          theme="support"
          seo={seoObject}
          footerComponent={
            data && (
              <FooterCta
                heading={data.page.footerCtaHeading}
                link={data.page.footerCtaLink}
                headingLevel={2}
              />
            )
          }
        >
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
                    titleType="h2"
                  />
                ))}
              </div>
            </div>
          </section>
        </Layout>
      )}
    </>
  );
};
