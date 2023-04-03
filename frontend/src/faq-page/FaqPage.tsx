import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { QuestionBubble } from "../svg/QuestionBubble";
import { FaqCollection } from "../components/FaqCollection";
import { ResourceLinks } from "../components/ResourceLinks";
import { FaqPageData, NavMenuData } from "../types/contentful";
import { Layout } from "../components/Layout";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const FaqPage = (props: Props): ReactElement<Props> => {
  const [data, setData] = useState<FaqPageData>();
  const [globalNav, setGlobalNav] = useState<NavMenuData>();
  const [mainNav, setMainNav] = useState<NavMenuData>();
  const [footerNav1, setFooterNav1] = useState<NavMenuData>();
  const [footerNav2, setFooterNav2] = useState<NavMenuData>();

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
        console.log(`An error, maybe an error code: ${e}`);
      },
    });

    props.client.getContentfulGNav("gnav", {
      onSuccess: (response: {
        data: {
          data: NavMenuData;
        };
      }) => {
        setGlobalNav(response.data.data);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
    props.client.getContentfulMNav("mnav", {
      onSuccess: (response: {
        data: {
          data: NavMenuData;
        };
      }) => {
        setMainNav(response.data.data);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
    props.client.getContentfulFootNav1("footNav", {
      onSuccess: (response: {
        data: {
          data: NavMenuData;
        };
      }) => {
        setFooterNav1(response.data.data);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
    props.client.getContentfulFootNav2("footNav2", {
      onSuccess: (response: {
        data: {
          data: NavMenuData;
        };
      }) => {
        setFooterNav2(response.data.data);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
  }, [props.client]);

  const global = {
    globalNav,
    mainNav,
    footerNav1,
    footerNav2,
  };

  return (
    <Layout {...global}>
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
