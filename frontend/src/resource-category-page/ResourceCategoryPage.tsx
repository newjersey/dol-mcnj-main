import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { useContentfulClient } from "../utils/useContentfulClient";
import { ResourceCategoryPageProps } from "../types/contentful";
import { RESOURCE_CATEGORY_QUERY } from "../queries/resourceCategory";
import { PageBanner } from "../components/PageBanner";
import { ResourceList } from "../components/ResourceList";

interface Props extends RouteComponentProps {
  client: Client;
  slug?: string;
}

export const ResourceCategoryPage = (props: Props): ReactElement => {
  const data: ResourceCategoryPageProps = useContentfulClient({
    query: RESOURCE_CATEGORY_QUERY,
    variables: { slug: `${props.slug}` },
  });

  return (
    <Layout client={props.client} theme="support">
      {data && (
        <>
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
        </>
      )}
    </Layout>
  );
};
