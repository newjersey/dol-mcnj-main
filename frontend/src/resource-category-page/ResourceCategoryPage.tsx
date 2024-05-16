import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { ResourceCategoryPageProps } from "../types/contentful";
import { PageBanner } from "../components/PageBanner";
import { ResourceList } from "../components/ResourceList";
import { useContentful } from "../utils/useContentful";

interface Props extends RouteComponentProps {
  client: Client;
  slug?: string;
}

export const ResourceCategoryPage = (props: Props): ReactElement => {
  const data: ResourceCategoryPageProps = useContentful({
    path: `/resource-category/${props.slug}`,
  });

  const seoObject = {
    title: data?.page.items[0].title
      ? `${data?.page.items[0].title} | Support Resources | ${process.env.REACT_APP_SITE_NAME}`
      : `Support Resources | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      data?.page.items[0].description || "Browse support and assistance resources by category.",
    url: props.location?.pathname || "/support-resources",
  };

  return (
    <>
      {data && (
        <Layout client={props.client} theme="support" seo={seoObject}>
          <PageBanner
            title={data.page.items[0].title}
            theme="navy"
            description={data.page.items[0].description}
            section="support"
            breadcrumbsCollection={{
              items: [
                {
                  copy: "Home",
                  url: "/",
                },
                {
                  copy: "Support and Assistance Resources",
                  url: "/support-resources",
                },
              ],
            }}
          />

          <section className="all-support-cards">
            <ResourceList
              category={data.page.items[0].title}
              tags={data.tags.items}
              info={data.page.items[0].infoBox}
              audience={data.audience.items}
              cta={data.cta}
              related={data.page.items[0].related?.items}
            />
          </section>
        </Layout>
      )}
    </>
  );
};
