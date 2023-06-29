import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Layout } from "../components/Layout";
import { CAREER_NAVIGATOR_QUERY } from "../queries/careerNavigator";
import { useContentfulClient } from "../utils/useContentfulClient";

interface Props extends RouteComponentProps {
  client: Client;
  slug?: string;
}

export const CareerNavigatorPage = (props: Props): ReactElement<Props> => {
  const data: any = useContentfulClient({ query: CAREER_NAVIGATOR_QUERY });

  return (
    <Layout client={props.client} theme="support">
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
          {JSON.stringify(data, null, "    ")}
        </pre>
      </code>
    </Layout>
  );
};
