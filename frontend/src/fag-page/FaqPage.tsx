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

interface Props extends RouteComponentProps {
  client: Client;
}

export const FaqPage = (props: Props): ReactElement<Props> => {
  const data: any = useContentfulClient({ query: FAQ_PAGE_QUERY });
  const breadCrumbs = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "FAQs",
    },
  ];

  return (
    <>
      <Header />
      <BetaBanner />
      <main className="below-banners" role="main">
        <PageBanner
          breadCrumbs={breadCrumbs}
          heading="Frequently Asked Questions"
          svg={<QuestionBubble />}
        />
        <FaqCollection topicHeading="Top Questions" content={data} />
      </main>
      <Footer />
    </>
  );
};
