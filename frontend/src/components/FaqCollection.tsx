import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "@reach/router";
import { FaqTopic } from "../types/contentful";
import { Accordion } from "./Accordion";
import { slugify } from "../utils/slugify";
import { DropNav } from "./DropNav";

export const FaqCollection = ({
  children,
  items,
}: {
  children?: ReactNode;
  items: {
    sys: { id: string };
    title: string;
    topics: {
      items: FaqTopic[];
    };
  }[];
}) => {
  const location = useLocation();
  const [activeTopic, setActiveTopic] = useState<FaqTopic>();

  useEffect(() => {
    const urlParams = window.location.hash || location.hash;
    const searchTopic = urlParams ? urlParams.replace("#", "") : "";

    if (searchTopic) {
      const activeTopic = items
        .map((category) => category.topics.items)
        .flat()
        .find((topic) => slugify(topic.topic) === searchTopic);

      if (activeTopic) {
        setActiveTopic(activeTopic);
      }
    } else {
      window.history.pushState(null, "", `#${slugify(items[0].topics.items[0].topic)}`);
    }

    if (!activeTopic && items) {
      setActiveTopic(items[0].topics.items[0]);
    }
  }, [activeTopic, location]);

  return (
    <div className="faq-collection">
      <div className="container">
        <DropNav
          items={items}
          elementId="faqNav"
          defaultActiveItem={activeTopic}
          defaultTopic={items[0].topics.items[0].topic}
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
