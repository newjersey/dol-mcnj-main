import { ReactNode, useEffect, useState } from "react";
import { FaqItem, FaqTopic } from "../types/contentful";
import { Accordion } from "./Accordion";
import { slugify } from "../utils/slugify";
import { DropNav } from "./DropNav";

interface TopicProps {
  sys: { id: string };
  topic: string;
  itemsCollection: { items: FaqItem[] };
}

export const FaqCollection = ({
  children,
  items,
}: {
  children?: ReactNode;
  items: {
    sys: { id: string };
    title: string;
    topics: {
      items: TopicProps[];
    };
  }[];
}) => {
  const [activeTopic, setActiveTopic] = useState<FaqTopic>();

  useEffect(() => {
    const urlParams = window.location.hash;
    const searchTopic = urlParams.replace("#", "");

    if (searchTopic) {
      const activeTopic = items
        .map((category) => category.topics.items)
        .flat()
        .find((topic) => slugify(topic.topic) === searchTopic);

      if (activeTopic) {
        setActiveTopic(activeTopic);
      }
    } else {
      // if no topic exists, set active topic to first topic
      setActiveTopic(items[0].topics.items[0]);
    }

    if (!activeTopic && items) {
      setActiveTopic(items[0].topics.items[0]);
    }
  }, [activeTopic]);

  return (
    <div className="faq-collection">
      <div className="container">
        <DropNav
          items={items}
          elementId="faqNav"
          onChange={(topic) => {
            setActiveTopic(topic);
            window.history.pushState(null, "", `#${slugify(topic.topic)}`);
          }}
        />

        <div className="questions">
          {activeTopic?.itemsCollection.items.map(
            (item, index) =>
              item !== null && (
                <Accordion
                  keyValue={index}
                  content={item.answer.json}
                  open={index === 0}
                  title={item.question}
                  key={item.sys?.id}
                />
              ),
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
