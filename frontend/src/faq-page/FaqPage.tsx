import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { FaqCollection } from "../components/FaqCollection";
import { ResourceLinks } from "../components/ResourceLinks";
import { FaqPageData } from "../types/contentful";
import { Layout } from "../components/Layout";
import { useContentfulClient } from "../utils/useContentfulClient";
import { FAQ_PAGE_QUERY } from "../queries/faq";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const FaqPage = (props: Props): ReactElement<Props> => {
  const data: FaqPageData = useContentfulClient({ query: FAQ_PAGE_QUERY });

  return (
    <Layout client={props.client} theme="support">
      {data && (
        <>
          <PageBanner {...data.page.pageBanner} date={data.page.sys.publishedAt} />
          <FaqCollection items={data?.page.topics.items}>
            {data.page.resourceLinks && (
              <ResourceLinks
                heading={data?.page.resourceLinkHeading}
                links={data?.page.resourceLinks}
              />
            )}
          </FaqCollection>
        </>
      )}
    </Layout>
  );
};
