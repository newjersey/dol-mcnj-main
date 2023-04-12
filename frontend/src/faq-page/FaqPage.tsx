import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { QuestionBubble } from "../svg/QuestionBubble";
import { FaqCollection } from "../components/FaqCollection";
import { ResourceLinks } from "../components/ResourceLinks";
import { FaqPageData } from "../types/contentful";
import { Layout } from "../components/Layout";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const FaqPage = (props: Props): ReactElement<Props> => {
  const [data, setData] = useState<FaqPageData>();
  const breadCrumbs = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "FAQs",
    },
  ];

  useEffect(() => {
    props.client.getContentfulFAQ("faq", {
      onSuccess: (response: {
        data: {
          data: FaqPageData;
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
        breadCrumbs={breadCrumbs}
        heading={`${data?.page.bannerHeading}`}
        svg={<QuestionBubble />}
      />

      {data && (
        <FaqCollection items={data?.page.topics.items}>
          {data?.page.resourceLinks && (
            <ResourceLinks
              heading={data?.page.resourceLinkHeading}
              links={data?.page.resourceLinks}
            />
          )}
        </FaqCollection>
      )}
    </Layout>
  );
};
