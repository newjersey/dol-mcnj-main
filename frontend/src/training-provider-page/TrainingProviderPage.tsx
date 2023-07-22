import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { TrainingProviderData } from "../types/contentful";
import { Layout } from "../components/Layout";
import { TabContent } from "../components/TabContent";
import { useContentfulClient } from "../utils/useContentfulClient";
import { TRAINING_PROVIDER_PAGE_QUERY } from "../queries/trainingProvider";

interface Props extends RouteComponentProps {
  client: Client;
}

export const TrainingProviderPage = (props: Props): ReactElement<Props> => {
  const data: TrainingProviderData = useContentfulClient({ query: TRAINING_PROVIDER_PAGE_QUERY });

  return (
    <Layout client={props.client} theme="training">
      {data && (
        <>
          <PageBanner {...data.page.pageBanner} date={data.page.sys.publishedAt} />
          <TabContent items={data?.page.tabs.items} />
        </>
      )}
    </Layout>
  );
};
