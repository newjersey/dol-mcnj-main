import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { TrainingProviderData } from "../types/contentful";
import { Layout } from "../components/Layout";
import { LightBulb } from "../svg/LightBulb";
import { TabContent } from "../components/TabContent";
import dayjs from "dayjs";

interface Props extends RouteComponentProps {
  client: Client;
}

export const TrainingProviderPage = (props: Props): ReactElement<Props> => {
  const [data, setData] = useState<TrainingProviderData>();
  useEffect(() => {
    props.client.getContentfulTPR("tpr", {
      onSuccess: (response: {
        data: {
          data: TrainingProviderData;
        };
      }) => {
        setData(response.data.data);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${JSON.stringify(e)}`);
      },
    });
  }, [props.client]);

  return (
    <Layout client={props.client}>
      <PageBanner
        heading="Training Provider Resources"
        svg={<LightBulb />}
        subheading={`last updated ${dayjs(data?.page.sys.publishedAt).format("MMMM D, YYYY")}`}
      />
      <TabContent items={data?.page.tabs.items} />
    </Layout>
  );
};
