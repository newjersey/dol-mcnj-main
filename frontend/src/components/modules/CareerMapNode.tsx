import { useEffect, useState } from "react";

export interface CareerMapNodeProps {
  sys: {
    id: string;
  };
  level?: number;
  title: string;
  shortTitle?: string;
  description: string;
  salaryRangeStart: number;
  salaryRangeEnd: number;
  educationLevel: 1 | 2 | 3 | 4;
  extendsTo?: {
    sys: {
      id: string;
    };
  };
  nextItem?: {
    items: CareerMapNodeProps[];
  };
}

export const CareerMapNode = (props: CareerMapNodeProps) => {
  const [above, setAbove] = useState(false);
  const [left, setLeft] = useState(false);
  const [horizontal, setHorizontal] = useState(0);
  const [vertical, setVertical] = useState(0);

  const { level = 2 } = props;

  useEffect(() => {
    if (props.extendsTo) {
      const mainDiv = document.getElementById(props.sys.id);
      const relatedDiv = document.getElementById(props.extendsTo.sys.id);

      if (mainDiv && relatedDiv) {
        const mainDivY = mainDiv.getBoundingClientRect().y;
        const relatedDivY = relatedDiv.getBoundingClientRect().y;
        const mainDivX = mainDiv.getBoundingClientRect().x;
        const relatedDivX = relatedDiv.getBoundingClientRect().x;
        setAbove(mainDivY > relatedDivY);
        setLeft(mainDivX > relatedDivX);

        const relatedDivHeight = relatedDiv.getBoundingClientRect().height;
        const relatedDivWidth = relatedDiv.getBoundingClientRect().width;

        if (left) {
          console.log({ left });
          const mainEdge = mainDiv.getBoundingClientRect().left;
          const relatedEdge = relatedDiv.getBoundingClientRect().right;
          setHorizontal(mainEdge - relatedEdge + relatedDivWidth / 2 + 30);
        } else {
          console.log({ left });
          const mainEdge = mainDiv.getBoundingClientRect().right;
          const relatedEdge = relatedDiv.getBoundingClientRect().left;
          setHorizontal(relatedEdge - mainEdge + relatedDivWidth / 2 + 30);
        }

        if (above) {
          console.log({ above });
          const mainEdge = mainDiv.getBoundingClientRect().top;
          const relatedEdge = relatedDiv.getBoundingClientRect().bottom;
          setVertical(mainEdge - relatedEdge + relatedDivHeight / 2);
        } else {
          console.log({ above });
          const mainEdge = mainDiv.getBoundingClientRect().bottom;
          const relatedEdge = relatedDiv.getBoundingClientRect().top;
          setVertical(relatedEdge - mainEdge + relatedDivHeight / 2);
        }
        console.log({ horizontal, vertical });
      }
    }
  }, [horizontal, vertical]);

  const hasNextItems = !!props.nextItem && props.nextItem.items.length > 0;

  return (
    <li className={`level-${level}${!hasNextItems ? " no-children" : ""}`}>
      <div className="info" id={props?.sys?.id}>
        <div className="box">
          <strong>{props.shortTitle || props.title}</strong>
          {hasNextItems && <span />}
        </div>
      </div>
      {props.extendsTo && (
        <div
          style={{
            width: horizontal,
          }}
          className={`line ${above ? "above" : "below"} ${left ? "left" : "right"}`}
        >
          <div
            style={{
              left: left ? "auto" : horizontal - 2,
              right: left ? horizontal - 2 : "auto",
              height: vertical + 5,
            }}
          />
        </div>
      )}

      {!!props.nextItem && (
        <ul
          className={`inner-list${
            props.nextItem
              ? props.nextItem.items.length === 1
                ? " single-item-list"
                : props.nextItem.items.length > 1
                ? " multi-item-list"
                : ""
              : ""
          }`}
        >
          {props.nextItem.items.map((nextItem) => (
            <CareerMapNode key={nextItem?.sys?.id} {...nextItem} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};
