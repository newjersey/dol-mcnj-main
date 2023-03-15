import { ReactNode, useEffect, useState } from "react";
import { FaqPageProps, FaqTopic } from "../types/contentful";
import { Accordion } from "./Accordion";
import { OverlayTool } from "./OverlayTool";
import IMAGE from "../overlayImages/Faq.png";

export const FaqCollection = ({
  topicHeading,
  content,
  children,
}: {
  topicHeading?: string;
  content: FaqPageProps;
  children?: ReactNode;
}) => {
  const { faqCollection } = content;
  const [activeTopic, setActiveTopic] = useState<FaqTopic>();
  useEffect(() => {
    if (faqCollection?.topicsCollection?.items.length) {
      setActiveTopic(faqCollection?.topicsCollection?.items[0]);
    }
  }, [faqCollection]);
  return (
    <div className="faq-collection">
      <OverlayTool img={IMAGE} />
      <div className="container">
        <nav>
          <ul>
            {topicHeading && <li className="heading">{topicHeading}</li>}
            {faqCollection?.topicsCollection?.items.map((item, index) => (
              <li
                key={item.topic + index}
                className={activeTopic?.topic === item.topic ? "active" : undefined}
              >
                <button
                  onClick={() => {
                    setActiveTopic(item);
                  }}
                >
                  {item.topic}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="questions">
          {activeTopic?.itemsCollection.items.map((item, index) => (
            <Accordion
              keyValue={index}
              content={item.answer.json}
              title={item.question}
              key={item.question}
            />
          ))}
          {children}
        </div>
      </div>
    </div>
  );
};
