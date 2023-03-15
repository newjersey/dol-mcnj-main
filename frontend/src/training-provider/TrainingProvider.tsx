import React, { ReactElement, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
// import { ContentfulRichText } from "../components/ContentfulRichText";
import { Header } from "../components/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Footer } from "../components/Footer";
interface Props extends RouteComponentProps {
  client: Client;
}

export const TrainingProviderPage = (props: Props): ReactElement<Props> => {
  // const [contentfulData, setContentfulData] = useState<[] | ContentfulFAQQuery>([]);

  // useEffect(() => {
  //   props.client.getContentful("tpr", {
  //     onSuccess: (response: ContentfulFAQQuery) => {
  //       console.log( response );
  //       // setContentfulData(response.data.data.faqItemCollection.items);
  //     },
  //     onError: (e) => {
  //       console.log(`An error, maybe an error code: ${e}`);
  //     },
  //   });
  // }, [props.client]);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="row mbm">
          <div className="col-sm-12">
            <h2 className="text-xl mvd">Training Provider Resources</h2>
            <div>
              {/* {data.map((item) => (
                <div>
                  <p>
                    <b>{item.title}</b>
                  </p>
                  <div>{JSON.stringify(item.description)}</div>
                  <ContentfulRichText
                      document={item.answer}
                      key={`content`}
                    />
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
