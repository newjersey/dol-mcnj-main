import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { useContentfulClient } from "../utils/useContentfulClient";
import { PageBanner } from "../components/PageBanner";
import { TrainingProviderPageProps } from "../types/contentful";
import { Layout } from "../components/Layout";
import { LightBulb } from "../svg/LightBulb";
import { TRAINING_PROVIDER_PAGE_QUERY } from "../queries/trainingProviderQuery";
import { TabContent } from "../components/TabContent";
import dayjs from "dayjs";

interface Props extends RouteComponentProps {
  client: Client;
}

export const TrainingProviderPage = (_props: Props): ReactElement<Props> => {
  const data: TrainingProviderPageProps = useContentfulClient({
    query: TRAINING_PROVIDER_PAGE_QUERY,
  });

  return (
    <Layout>
      <PageBanner
        heading="Training Provider Resources"
        svg={<LightBulb />}
        subheading={`last updated ${dayjs(data?.tabContent.sys.publishedAt).format(
          "MMMM D, YYYY"
        )}`}
      />
      <TabContent items={data?.tabContent.tabsCollection.items} />
    </Layout>
  );
};
