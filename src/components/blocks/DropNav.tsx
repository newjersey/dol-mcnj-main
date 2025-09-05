"use client";
import { DropGroup } from "@components/modules/DropGroup";
import { TopicProps } from "@utils/types";
import { useEffect, useState } from "react";

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
    <div className={`dropNav${className ? ` ${className}` : ""}`}>
      <nav
        id={elementId}
        aria-label="FAQ Navigation"
        data-testid="topic-selector"
      >
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
    </div>
  );
};

export { DropNav };
