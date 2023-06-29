import { ReactNode, useEffect, useState } from "react";
import { FaqTopic } from "../types/contentful";
import { Accordion } from "./Accordion";
import { slugify } from "../utils/slugify";
import { Select } from "../svg/Select";

export const FaqCollection = ({
  topicHeading,
  children,
  items,
}: {
  topicHeading?: string;
  children?: ReactNode;
  items?: FaqTopic[];
}) => {
  const [activeTopic, setActiveTopic] = useState<FaqTopic>();
  const [anchor, setAnchor] = useState<string>("");
  const [openNav, setOpenNav] = useState<boolean>(false);

  const handleClick = (newAnchor: string) => {
    setAnchor(newAnchor);
    const newUrl = window.location.href.replace(/#.*/, "") + "#" + newAnchor;
    window.history.replaceState({}, "", newUrl);
  };

  useEffect(() => {
    if (items?.length) {
      if (window.location.href.split("#")[1]) {
        setAnchor(window.location.href.split("#")[1]);
      }

      if (anchor) {
        const currentTopic = items.find((item) => slugify(item.topic) === anchor);
        setActiveTopic(currentTopic);
      } else {
        setActiveTopic(items[0]);
      }
    }
  }, [items, anchor]);
  return (
    <div className="faq-collection">
      <div className="container">
        <nav aria-label="FAQ Navigation">
          <button
            className="drop-selector"
            data-testid="topic-selector"
            onClick={() => {
              setOpenNav(!openNav);
            }}
          >
            {activeTopic?.topic}
            <Select />
          </button>
          <ul className={openNav ? "open" : undefined}>
            {topicHeading && <li className="heading">test{topicHeading}</li>}
            {items?.map((item: FaqTopic) => (
              <li
                key={item.sys?.id}
                className={activeTopic?.topic === item.topic ? "active" : undefined}
              >
                <button
                  onClick={() => {
                    setActiveTopic(item);
                    setOpenNav(false);
                    handleClick(`${slugify(item.topic)}`);
                  }}
                >
                  {item.topic}
                </button>
              </li>
            ))}
          </ul>
        </nav>
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
              )
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
