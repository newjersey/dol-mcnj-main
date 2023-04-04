import { RouteComponentProps } from "@reach/router";
import { ReactElement, useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { FinancialResourcePageData, FinancialResourcePageProps } from "../types/contentful";
import { PageBanner } from "../components/PageBanner";
import { OverlayTool } from "../components/OverlayTool";
import image from "../overlayImages/Financial Resources.png";
import { FinancialResourceFilter } from "../components/FinancialResourceFilter";

interface Props extends RouteComponentProps {
  client: Client;
}

export const FinancialPage = (props: Props): ReactElement => {
  const [data, setData] = useState<FinancialResourcePageData>();

  useEffect(() => {
    props.client.getContentfulFRP("frp", {
      onSuccess: (response: FinancialResourcePageProps) => {
        setData(response.data.data);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
  }, [props.client]);

  const breadCrumbs = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "Financial Resources",
    },
  ];

  return (
    <Layout client={props.client}>
      <OverlayTool img={image} />

      <PageBanner
        breadCrumbs={breadCrumbs}
        heading={`${data?.page.bannerHeading}`}
        image={`${data?.page.bannerImage?.url}`}
        message={data?.page.bannerCopy}
      />
      <section className="resource-filter">
        <div className="container">
          <FinancialResourceFilter education={data?.education} funding={data?.funding} />
          <div className="content">test</div>
        </div>
      </section>
    </Layout>
  );
};
