"use client";
import { LinkObject } from "@components/modules/LinkObject";
import { useState } from "react";

interface HighlightsProps {
  className?: string;
  items: {
    copy: string;
    sys: { id: string };
    url: string;
    value: string;
  }[];
}

const Highlights = ({ className, items }: HighlightsProps) => {
  const [showAll, setShowAll] = useState(false);
  return (
    <div className={`highlights${className ? ` ${className}` : ""}`}>
      Highlights
      {!showAll ? (
        <div className="highlight-item" key={items[0].sys.id}>
          <span className="value">{items[0].value}</span>
          <LinkObject url={items[0].url} noIndicator>
            {items[0].copy}
          </LinkObject>
        </div>
      ) : (
        items.map((highlight) => (
          <div className="highlight-item" key={highlight.sys.id}>
            <span className="value">{highlight.value}</span>
            <LinkObject url={highlight.url} noIndicator>
              {highlight.copy}
            </LinkObject>
          </div>
        ))
      )}
      <button
        type="button"
        onClick={() => {
          setShowAll(!showAll);
        }}
      >
        {showAll ? "Show Less" : "Show All"}
      </button>
    </div>
  );
};

export { Highlights };
