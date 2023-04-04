import React, { ReactElement, useEffect, useState } from "react";
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

  const topics = data?.faqCollection?.topicsCollection?.items;
  const linkGroup = data?.faqCollection?.linkGroup;

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
    <Layout>
      <PageBanner
        breadCrumbs={breadCrumbs}
        heading="Frequently Asked Questions"
        svg={<QuestionBubble />}
      />

      {data && (
        <FaqCollection topicHeading="Top Questions" items={topics}>
          {linkGroup && <ResourceLinks {...linkGroup} />}
        </FaqCollection>
      )}
    </Layout>
  );
};
