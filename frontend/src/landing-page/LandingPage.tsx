import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { useContentfulClient } from "../utils/useContentfulClient";
import { HomepageProps } from "../types/contentful";
import { HOMEPAGE_QUERY } from "../queries/homePage";
import { HomeBanner } from "../components/HomeBanner";

interface Props extends RouteComponentProps {
  client: Client;
}

export const LandingPage = (props: Props): ReactElement => {
  const data: HomepageProps = useContentfulClient({
    query: HOMEPAGE_QUERY,
  });

  const pageData = data?.homePage;

  return (
    <Layout client={props.client}>
      {data && (
        <>
          <HomeBanner
            heading={pageData.title}
            buttonCopy={pageData.bannerButtonCopy}
            image={pageData.bannerImage}
            subheading={pageData.pageDescription}
          />
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
              {JSON.stringify(pageData, null, "    ")}
            </pre>
          </code>
        </>
      )}
    </Layout>
  );
};
