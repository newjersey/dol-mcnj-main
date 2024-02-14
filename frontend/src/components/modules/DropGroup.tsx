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
  onChange?: (selected: FaqTopic) => void;
}

const toggleOpen = (isOpen: boolean, contentId: string): void => {
  const contentBlock = document.getElementById(contentId);
  if (contentBlock) {
    const height = contentBlock?.scrollHeight;
    contentBlock.style.height = !isOpen ? `${height}px` : "0px";
  }
};

const DropGroup = ({ activeItem, className, onChange, sys, title, topics }: DropGroupProps) => {
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const [activeTopic, setActiveTopic] = useState<FaqTopic>();

  // If activeTopic is set, open the accordion
  useEffect(() => {
    if (onChange && activeTopic) {
      onChange(activeTopic);
    }

    if (!activeTopic) {
      const urlParams = window.location.hash;
      const searchTopic = urlParams.replace("#", "");

      if (searchTopic) {
        const searchedTopic = topics.items.find((topic) => slugify(topic.topic) === searchTopic);

        if (searchedTopic) {
          setActiveTopic(searchedTopic);
          setOpen(true)
          const contentBlock = document.getElementById(`list-${sys?.id}`);

          if (contentBlock) {
            const height = contentBlock?.scrollHeight;
            contentBlock.style.height = `${height}px`;
          }
        }
      } else {
        const searchedTopic = topics.items.find((topic) => slugify(topic.topic) === 'training');
        
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

    if (activeTopic) {
      setOpen(true);
    }
  }, [activeTopic]);

  // If hash changes, update the activeTopic
  useEffect(() => {
    if (activeTopic) {
      if (location.hash !== `#${slugify(activeTopic.topic)}`) {
        const searchTopic = location.hash.replace("#", "");
        
        if (searchTopic) {
          const searchedTopic = topics.items.find((topic) => slugify(topic.topic) === searchTopic);
        
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
    }
  }, [location]);

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
              id={`${item.sys.id}-${slugify(title)}`}
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
