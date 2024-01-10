import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { TrainingProviderData } from "../types/contentful";
import { Layout } from "../components/Layout";
import { TabContent } from "../components/TabContent";
import { useContentfulClient } from "../utils/useContentfulClient";
import { TRAINING_PROVIDER_PAGE_QUERY } from "../queries/trainingProvider";
import { usePageTitle } from "../utils/usePageTitle";

interface Props extends RouteComponentProps {
  client: Client;
}

export const TrainingProviderPage = (props: Props): ReactElement<Props> => {
  const data: TrainingProviderData = useContentfulClient({ query: TRAINING_PROVIDER_PAGE_QUERY });

  usePageTitle(`${data?.page?.title} | New Jersey Career Central`);

  const seoObject = {
    title: `${data?.page?.title} | New Jersey Career Central`,
    description: data?.page?.pageDescription,
    image: data?.page?.ogImage?.url,
    keywords: data?.page?.keywords,
    url: props.location?.pathname,
  };

  return (
    <>
      {data && (
        <Layout client={props.client} theme="training" seo={seoObject}>
          <PageBanner {...data.page.pageBanner} date={data.page.sys.publishedAt} />
          <TabContent items={data?.page.tabs.items} />
        </Layout>
      )}
    </>
  );
};
