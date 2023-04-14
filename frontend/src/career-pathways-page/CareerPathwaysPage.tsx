import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { CareerPathwaysPageData } from "../types/contentful";
import { Layout } from "../components/Layout";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const CareerPathwaysPage = (props: Props): ReactElement<Props> => {
  const [data, setData] = useState<CareerPathwaysPageData>();

  useEffect(() => {
    props.client.getContentfulCPW(
      "cpw",
      {
        onSuccess: (response: {
          data: {
            data: CareerPathwaysPageData;
          };
        }) => {
          setData(response.data.data);
        },
        onError: (e) => {
          console.log(`An error, maybe an error code: ${JSON.stringify(e)}`);
        },
      },
      { industry: "manufacturing" }
    );
  }, [props.client]);

  return (
    <Layout client={props.client} theme="support">
      {data && <PageBanner {...data.page.pageBanner} date={data.page.sys.publishedAt} />}

      <code>
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
          {JSON.stringify(props, null, "    ")}
        </pre>
      </code>
    </Layout>
  );
};
