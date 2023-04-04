import { RouteComponentProps } from "@reach/router";
import { ReactElement, useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { OverlayTool } from "../components/OverlayTool";
import image from "../overlayImages/Financial Resources - Mobile.png";
import { Client } from "../domain/Client";
import { FinancialResourcePageData, FinancialResourcePageProps } from "../types/contentful";
import { PageBanner } from "../components/PageBanner";

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
    <Layout>
      <OverlayTool img={image} />

      {/* <code>
        <pre
          style={{
            fontFamily: "monospace",
            display: "block",
            padding: "50px",
            color: "#88ffbf",
            backgroundColor: "black",
            textAlign: "left",
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(data?.page.bannerImage, null, "    ")}
        </pre>
      </code> */}

      <PageBanner
        breadCrumbs={breadCrumbs}
        heading={`${data?.page.bannerHeading}`}
        image={`${data?.page.bannerImage?.url}`}
        message={data?.page.bannerCopy}
      />
      <div className="container">
        <h1>Financial Page</h1>
      </div>
    </Layout>
  );
};
