import { useEffect, useState } from "react";
import { DropGroup } from "./modules/DropGroup";
import { FaqItem } from "../types/contentful";

interface TopicProps {
  sys: { id: string };
  topic: string;
  itemsCollection: { items: FaqItem[] };
}

interface DropNavProps {
  className?: string;
  elementId: string;
  items: {
    sys: { id: string };
    title: string;
    topics: {
      items: TopicProps[];
    };
  }[];
  onChange?: (selected: TopicProps) => void;
}

const DropNav = ({ className, elementId, onChange, items }: DropNavProps) => {
  const [activeTopic, setActiveTopic] = useState<TopicProps>();

  useEffect(() => {
    if (onChange && activeTopic) {
      onChange(activeTopic);
    }
  }, [activeTopic]);

  return (
    <aside className={`dropNav${className ? ` ${className}` : ""}`}>
      <nav id={elementId}>
        <p className="title mobile-only">Categories</p>
        <ul className="unstyled">
          {items.map((item) => (
            <DropGroup
              key={item.sys?.id}
              {...item}
              activeItem={activeTopic}
              onChange={(activeTopic) => {
                setActiveTopic(activeTopic);
              }}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export { DropNav };
