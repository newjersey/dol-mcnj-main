import { CaretRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { FaqItem } from "../../types/contentful";

interface TopicProps {
  sys: { id: string };
  topic: string;
  itemsCollection: { items: FaqItem[] };
}

interface DropGroupProps {
  sys: { id: string };
  title: string;
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

const DropGroup = ({ activeItem, className, onChange, sys, title, topics }: DropGroupProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeTopic, setActiveTopic] = useState<TopicProps>();

  useEffect(() => {
    if (onChange && activeTopic) {
      onChange(activeTopic);
    }
    if (activeTopic) {
      setOpen(true);
    }
  }, [activeTopic]);

  return (
    <li
      key={sys?.id}
      className={`dropGroup${className ? ` ${className}` : ""}${open ? " active" : ""}`}
    >
      <button
        type="button"
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
            className={activeTopic && activeItem?.sys.id === item.sys.id ? "active" : undefined}
          >
            <button
              id={item.sys.id}
              onClick={() => {
                setActiveTopic(undefined);
                setTimeout(() => {
                  setActiveTopic(item);
                }, 10);
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
