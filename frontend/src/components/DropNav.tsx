import { useEffect, useState } from "react";
import { DropGroup } from "./modules/DropGroup";
import { FaqTopic } from "../types/contentful";

interface DropNavProps {
  className?: string;
  defaultActiveItem?: FaqTopic;
  elementId: string;
  items: {
    sys: { id: string };
    title: string;
    topics: {
      items: FaqTopic[];
    };
  }[];
  onChange?: (selected: FaqTopic) => void;
}

const DropNav = ({ className, defaultActiveItem, elementId, onChange, items }: DropNavProps) => {
  const [activeTopic, setActiveTopic] = useState<FaqTopic>();

  useEffect(() => {
    if (onChange && activeTopic) {
      onChange(activeTopic);
    }
  }, [activeTopic]);

  return (
    <aside className={`dropNav${className ? ` ${className}` : ""}`}>
      <nav id={elementId} aria-label="FAQ Navigation" data-testid="topic-selector">
        <p className="title mobile-only">Categories</p>
        <ul className="unstyled">
          {items.map((item) => (
            <DropGroup
              key={item.sys?.id}
              {...item}
              activeItem={activeTopic || defaultActiveItem}
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
