import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Header } from "../components/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Footer } from "../components/Footer";
import { FAQ_PAGE_QUERY } from "../queries/faqQuery";
import { useContentfulClient } from "../utils/useContentfulClient";
import { PageBanner } from "../components/PageBanner";
import { QuestionBubble } from "../svg/QuestionBubble";
import { FaqCollection } from "../components/FaqCollection";
import { ResourceLinks } from "../components/ResourceLinks";
import { FaqPageProps } from "../types/contentful";
import { OverlayTool } from "../components/OverlayTool";
import IMAGE from "../overlayImages/mobile.png";

interface Props extends RouteComponentProps {
  client: Client;
}

export const FaqPage = (props: Props): ReactElement<Props> => {
  const data: FaqPageProps = useContentfulClient({ query: FAQ_PAGE_QUERY });
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

  return (
    <>
      <Header />
      <BetaBanner />
      <main className="below-banners" role="main">
        <OverlayTool img={IMAGE} />
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
      </main>
      <Footer />
    </>
  );
};
