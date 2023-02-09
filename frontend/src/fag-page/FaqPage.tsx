import React, { ReactElement, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { api } from "../components/ContentfulAPI";
// import { ContentfulRichText } from '../components/ContentfulRichText';
import { Header } from "../components/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Footer } from "../components/Footer";

// interface FaqItemCollection {
//   items: FaqItem[]
// }

interface FaqItem {
  question: string;
  answer: JSON;
  order: number;
  topic: FaqItemTopic;
}

interface FaqItemTopic {
  topic: string;
  order: number;
}

const query = `
  {
    faqItemCollection {
      items {
        question
        answer {
          json
        }
        order
      }
    }
  }
`;

export const FaqPage = (_props: RouteComponentProps): ReactElement => {
  const [data, setData] = useState<[] | FaqItem[]>([]);

  const getData = () =>
    api("/", JSON.stringify({ query })).then((res) => {
      if (res.status === 200) {
        // console.log( res.data.data.faqItemCollection.items[0].answer.json );
        setData(res.data.data.faqItemCollection.items);
      } else {
        console.log(res);
      }
    });

  useEffect(() => {
    getData();
  });

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="row mbm">
          <div className="col-sm-12">
            <h2 className="text-xl mvd">Frequently Asked Questions</h2>
            <div>
              {data.map((item) => (
                <div key={item.question}>
                  <p>
                    <b>{item.question}</b>
                  </p>
                  <div>{JSON.stringify(item.answer)}</div>
                  {/* <ContentfulRichText
                      document={item.answer}
                      key={`content`}
                    /> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
