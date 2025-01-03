"use client";
import { FaqTopic, TopicProps } from "@utils/types";
import { DropNav } from "./DropNav";
import { ReactNode, useEffect, useState } from "react";
import { Accordion } from "./Accordion";
import { slugify } from "@utils/slugify";
import { Spinner } from "@components/modules/Spinner";
import { colors } from "@utils/settings";

interface FaqSectionProps {
  className?: string;
  children?: ReactNode;
  items: {
    sys: { id: string };
    title: string;
    topics: {
      items: TopicProps[];
    };
  }[];
}

const FaqSection = ({ className, items }: FaqSectionProps) => {
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
      setActiveTopic(items[0].topics.items[0]);
      window.history.pushState(
        null,
        "",
        `#${slugify(items[0].topics.items[0].topic)}`
      );
    }

    const allAccordions = document.querySelectorAll(
      ".accordion"
    ) as NodeListOf<HTMLElement>;

    if (allAccordions[0]) {
      const firstButton = allAccordions[0].querySelector(
        "button"
      ) as HTMLButtonElement;

      firstButton.click();
    }

    if (!activeTopic && items) {
      setActiveTopic(items[0].topics.items[0]);
    }
  }, [activeTopic]);

  return (
    <section className={`faqSection${className ? ` ${className}` : ""}`}>
      <div className="container">
        <div className="inner">
          {activeTopic && (
            <DropNav
              elementId="faqNav"
              items={items}
              onChange={(topic) => {
                setActiveTopic(topic);
                window.history.pushState(null, "", `#${slugify(topic.topic)}`);
              }}
            />
          )}
          <hr className="mobile-only" />
          {activeTopic &&
          activeTopic.itemsCollection &&
          activeTopic.itemsCollection.items.length > 0 ? (
            <Accordion items={activeTopic.itemsCollection?.items} />
          ) : (
            <Spinner size={120} color={colors.primary} />
          )}
        </div>
      </div>
    </section>
  );
};

export { FaqSection };
