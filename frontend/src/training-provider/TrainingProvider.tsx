import React, { ReactElement, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { api } from "../components/ContentfulAPI";
// import { ContentfulRichText } from "../components/ContentfulRichText";
import { Header } from "../components/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Footer } from "../components/Footer";

// interface TrainingProviderItemCollection {
//   items: TrainingProviderItem[]
// }

interface TrainingProviderItem {
  title: string;
  hide: boolean;
  description: JSON;
  order: number;
  topic: TrainingProviderTopic;
}

interface TrainingProviderTopic {
  topic: string;
  order: number;
}

const query = `
  {
    trainingProviderItemCollection {
      items {
        title
        description {
          json
        }
        order
      }
    }
  }
`;

export const TrainingProviderPage = (_props: RouteComponentProps): ReactElement => {
  const [data, setData] = useState<[] | TrainingProviderItem[]>([]);

  const getData = () =>
    api("/", JSON.stringify({ query })).then((res) => {
      if (res.status === 200) {
        // console.log( res.data.data.trainingProviderItemCollection.items[0] );
        setData(res.data.data.trainingProviderItemCollection.items);
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
            <h2 className="text-xl mvd">Training Provider Resources</h2>
            <div>
              {data.map((item) => (
                <div>
                  <p>
                    <b>{item.title}</b>
                  </p>
                  <div>{JSON.stringify(item.description)}</div>
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
