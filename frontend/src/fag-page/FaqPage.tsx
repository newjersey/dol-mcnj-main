import React, { ReactElement, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Header } from "../components/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Accordion } from "../components/Accordion";
import { Footer } from "../components/Footer";
import { ContentfulFAQQuery, FaqItemTopic, FaqItem } from "../domain/Contentful";
interface Props extends RouteComponentProps {
  client: Client;
}

export const FaqPage = (props: Props): ReactElement<Props> => {
  const [topic, setTopic] = useState<[] | FaqItemTopic[]>([]);
  const [data, setData] = useState<[] | FaqItem[]>([]);

  useEffect(() => {
    props.client.getContentfulFAQ("faq", {
      onSuccess: (response: ContentfulFAQQuery) => {

        // console.log( response );
        setData(response.data.data.faqItemCollection.items);
        setTopic(response.data.data.faqTopicCollection.items);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
  }, [props.client]);

  console.log( topic );

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="row mbm">
          <div className="col-sm-12">
            <h2 className="text-xl mvd">Frequently Asked Questions</h2>
            <div className="flex">
              <div className="mrl">
                <nav aria-label="Secondary navigation">
                  <ul className="usa-sidenav">
                    {topic.sort((a, b) => a.order > b.order ? 1 : -1).map(( item, index) => (
                      <li className="usa-sidenav__item" key={index}><a href="#top">{item.topic}</a></li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div>
                {data.sort((a, b) => a.topic.order > b.topic.order ? 1 : -1).map(( item, index) => (
                  <Accordion title={item.question} content={item.answer.json} keyValue={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
