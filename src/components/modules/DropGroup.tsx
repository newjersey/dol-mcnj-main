"use client";
import { CaretRight } from "@phosphor-icons/react";
import { slugify } from "@utils/slugify";
import { TopicProps } from "@utils/types";
import { useEffect, useState } from "react";

interface DropGroupProps {
  sys: { id: string };
  title: string;
  testId?: string;
  topics: {
    items: TopicProps[];
  };
  activeItem?: TopicProps;
  className?: string;
  onChange?: (selected: TopicProps) => void;
}

const toggleOpen = (isOpen: boolean, contentId: string): void => {
  const contentBlock = document.getElementById(contentId);
  if (contentBlock) {
    const height = contentBlock?.scrollHeight;
    contentBlock.style.height = !isOpen ? `${height}px` : "0px";
  }
};

const DropGroup = ({
  activeItem,
  className,
  onChange,
  testId,
  sys,
  title,
  topics,
}: DropGroupProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeTopic, setActiveTopic] = useState<TopicProps>();

  useEffect(() => {
    const urlParams = window.location.hash;
    const searchTopic = urlParams.replace("#", "");

    if (searchTopic) {
      const activeItem = topics.items.find(
        (topic) => slugify(topic.topic) === searchTopic,
      );

      if (activeItem) {
        setOpen(true);

        setTimeout(() => {
          setActiveTopic(activeItem);
          onChange && onChange(activeItem);
          toggleOpen(open, `list-${sys?.id}`);
        }, 10);
      }
    } else {
      setActiveTopic(topics.items[0]);
    }
  }, []);

  return (
    <li
      key={sys?.id}
      data-testid={testId}
      className={`dropGroup${className ? ` ${className}` : ""}${
        open ? " active" : ""
      }`}
    >
      <button
        type="button"
        className="drop-toggle"
        onClick={() => {
          setOpen(!open);
          toggleOpen(open, `list-${sys?.id}`);
        }}
      >
        {title}
        <CaretRight size={16} weight="bold" />
      </button>

      <ul className={`unstyled${open ? " active" : ""}`} id={`list-${sys?.id}`}>
        {topics.items.map((item) => (
          <li
            key={item.sys.id}
            className={
              activeTopic && activeItem?.sys.id === item.sys.id
                ? "active"
                : undefined
            }
          >
            <button
              type="button"
              id={`${item.sys.id}-${slugify(title)}`}
              onClick={() => {
                setActiveTopic(item);
                onChange && onChange(item);
              }}
            >
              {item.topic}
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
};

export { DropGroup };
