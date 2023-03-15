import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Header } from "../components/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Accordion } from "../components/Accordion";
import { Footer } from "../components/Footer";
import { FAQ_PAGE_QUERY } from "../queries/faqQuery";
import { useContentfulClient } from "../utils/useContentfulClient";
import { FaqPageProps } from "../types/contentful";
import { PageBanner } from "../components/PageBanner";
import { QuestionBubble } from "../svg/QuestionBubble";

interface Props extends RouteComponentProps {
  client: Client;
}

export const FaqPage = (props: Props): ReactElement<Props> => {
  const data: never[] | FaqPageProps = useContentfulClient({ query: FAQ_PAGE_QUERY });
  const breadCrumbs = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "FAQs",
    },
  ];

  console.log({ data });

  return (
    <>
      <Header />
      <BetaBanner />
      <main className="" role="main">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
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
      </main>

      <Footer />
    </>
  );
};
