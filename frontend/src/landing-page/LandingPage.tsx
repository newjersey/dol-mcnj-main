import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { useContentfulClient } from "../utils/useContentfulClient";
import { HomepageProps } from "../types/contentful";
import { HOMEPAGE_QUERY } from "../queries/homePage";
import { HomeBanner } from "../components/HomeBanner";
import CardSlider from "../components/CardSlider";

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
          <div className="container">
            <CardSlider
              cards={[
                {
                  id: "1",
                  title: "Card 1",
                },
                {
                  id: "2",
                  title: "Card 2",
                },
                {
                  id: "3",
                  title: "Card 3",
                },
                {
                  id: "4",
                  title: "Card 4",
                },
                {
                  id: "5",
                  title: "Card 5",
                },
                {
                  id: "6",
                  title: "Card 6",
                },
                {
                  id: "7",
                  title: "Card 7",
                },
                {
                  id: "8",
                  title: "Card 8",
                },
              ]}
            />
          </div>
        </>
      )}
    </Layout>
  );
};
