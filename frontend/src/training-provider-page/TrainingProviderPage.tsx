import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { TrainingProviderData } from "../types/contentful";
import { Layout } from "../components/Layout";
import { TabContent } from "../components/TabContent";
import { usePageTitle } from "../utils/usePageTitle";
import { useContentful } from "../utils/useContentful";
import pageImage from "../images/ogImages/trainingProviderResources.jpg";

interface Props extends RouteComponentProps {
  client: Client;
}

export const TrainingProviderPage = (props: Props): ReactElement<Props> => {
  const data: TrainingProviderData = useContentful({
    path: "/training-provider",
  });

  usePageTitle(`${data?.page?.title} | ${process.env.REACT_APP_SITE_NAME}`);

  const seoObject = {
    title: data
      ? `${data?.page?.title} | ${process.env.REACT_APP_SITE_NAME}`
      : `Training Provider | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      data?.page?.pageDescription ||
      "As a training program provider, you may have questions about data collection requirements, Eligible Training Provider List (ETPL) listing, and how the Department of Labor deals with Quality Assurance. You can find answers to your questions here.",
    image: data?.page?.ogImage?.url || pageImage,
    keywords: data?.page?.keywords || [
      "Training Provider",
      "Training Provider Resources",
      "Eligible Training Provider List",
      "ETPL",
      "Training",
      "Training Program",
      "New Jersey",
      "My Career NJ",
    ],
    url: props.location?.pathname || "/training-provider-resources",
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
