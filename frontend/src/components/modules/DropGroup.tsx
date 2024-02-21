import { CaretRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useLocation } from "@reach/router";
import { FaqTopic } from "../../types/contentful";
import { slugify } from "../../utils/slugify";

interface DropGroupProps {
  sys: { id: string };
  title: string;
  topics: {
    items: FaqTopic[];
  };
  activeItem?: FaqTopic;
  className?: string;
  defaultTopic?: string;
  onChange?: (selected: FaqTopic) => void;
}

const toggleOpen = (isOpen: boolean, contentId: string): void => {
  const contentBlock = document.getElementById(contentId);
  if (contentBlock) {
    const height = contentBlock?.scrollHeight;
    contentBlock.style.height = !isOpen ? `${height}px` : "0px";
  }
};

const DropGroup = ({ activeItem, className, defaultTopic, onChange, sys, title, topics }: DropGroupProps) => {
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const [activeTopic, setActiveTopic] = useState<FaqTopic>();

  const resetActiveTopic = async(topic: FaqTopic) => {
    setActiveTopic(undefined);
    setTimeout(() => {
      setActiveTopic(topic);
    }, 10);
  }

  useEffect(() => {
    const urlParams = window.location.hash;
    const searchTopic = urlParams.replace("#", "");

    if (searchTopic) {
      const searchedTopic = topics.items.find((topic) => slugify(topic.topic) === searchTopic);

      if (searchedTopic) {
        resetActiveTopic(searchedTopic);
        setOpen(true)
        const contentBlock = document.getElementById(`list-${sys?.id}`);

        if (contentBlock) {
          const height = contentBlock?.scrollHeight;
          contentBlock.style.height = `${height}px`;
        }
      }
    } else {
      if (!activeItem) {
        const searchedTopic = topics.items.find((topic) => slugify(topic.topic) === slugify(defaultTopic || ""));
  
        if (searchedTopic) {
          setActiveTopic(searchedTopic);
          setOpen(true)
          const contentBlock = document.getElementById(`list-${sys?.id}`);
  
          if (contentBlock) {
            const height = contentBlock?.scrollHeight;
            contentBlock.style.height = `${height}px`;
          }
        }
      }
    }
  }, [location]);

  // If activeTopic is set, open the accordion
  useEffect(() => {
    if (onChange && activeTopic) {
      onChange(activeTopic);
    }

    if (activeTopic) {
      setOpen(true);
    }
  }, [activeTopic, location]);

  return (
    <li
      key={sys?.id}
      className={`dropGroup${className ? ` ${className}` : ""}${open ? " active" : ""}`}
      data-testid={`topic-${slugify(title)}`}
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
            data-testid={`link-${slugify(item.topic)}`}
            className={activeItem?.sys.id === item.sys.id ? "active-link active" : undefined}
          >
            <button
              id={`${item.sys.id}-${slugify(title)}`}
              onClick={() => {
                resetActiveTopic(item);
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
