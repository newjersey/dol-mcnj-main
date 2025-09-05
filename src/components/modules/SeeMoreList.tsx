"use client";
import { useState } from "react";
import { LinkObject } from "./LinkObject";
import { Button } from "./Button";

interface SeeMoreListProps {
  className?: string;
  title?: string;
  initialSeen?: number;
  items: {
    copy: string;
    url?: string;
  }[];
}

const SeeMoreList = ({
  className,
  title,
  items,
  initialSeen = 5,
}: SeeMoreListProps) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const firstChunk = items.slice(0, initialSeen);
  const activeItems = showAll ? items : firstChunk;
  return (
    <div className={`seeMoreList${className ? ` ${className}` : ""}`}>
      {title && <p>{title}</p>}
      <ul>
        {activeItems.map((item, index) => (
          <li
            className={item.url ? "hasLink" : undefined}
            key={item.copy + item.url + index}
          >
            {item.url ? (
              <LinkObject url={item.url} noIndicator>
                {item.copy}
              </LinkObject>
            ) : (
              <span
                dangerouslySetInnerHTML={{
                  __html: item.copy,
                }}
              />
            )}
          </li>
        ))}
      </ul>
      <Button
        unstyled
        className="show"
        type="button"
        onClick={() => setShowAll(!showAll)}
        iconSuffix={showAll ? "CaretUp" : "CaretDown"}
        iconWeight="bold"
      >
        {showAll ? "See Less" : "See More"}
      </Button>
    </div>
  );
};

export { SeeMoreList };
