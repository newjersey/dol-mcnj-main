import { useEffect, useState } from "react";
import { useContentfulClient } from "../../utils/useContentfulClient";
import { CAREER_MAP_NODE_QUERY } from "../../queries/careerMapNode";
import { numberShorthand } from "../../utils/numberShorthand";
import { EducationLevel } from "./EducationLevel";

export interface CareerMapNodeProps {
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
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

interface NextNodeProps extends CareerMapNodeProps {
  level: number;
}

const NextNode = (props: NextNodeProps) => {
  const data = useContentfulClient({
    query: CAREER_MAP_NODE_QUERY,
    variables: { id: props.sys.id },
  });

  return <>{data && <CareerMapNode {...data.careerMapObject} level={props.level} />}</>;
};

export const CareerMapNode = (props: CareerMapNodeProps) => {
  const [above, setAbove] = useState(false);
  const [left, setLeft] = useState(false);
  const [horizontal, setHorizontal] = useState(0);
  const [vertical, setVertical] = useState(0);

  const { level = 2 } = props;

  useEffect(() => {
    setTimeout(() => {
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
            const mainEdge = mainDiv.getBoundingClientRect().left;
            const relatedEdge = relatedDiv.getBoundingClientRect().right;
            setHorizontal(mainEdge - relatedEdge + relatedDivWidth - 2);
          } else {
            const mainEdge = mainDiv.getBoundingClientRect().right;
            const relatedEdge = relatedDiv.getBoundingClientRect().left;
            setHorizontal(relatedEdge - mainEdge + relatedDivWidth - 2);
          }

          if (above) {
            const mainEdge = mainDiv.getBoundingClientRect().top;
            const relatedEdge = relatedDiv.getBoundingClientRect().bottom;
            setVertical(mainEdge - relatedEdge + relatedDivHeight / 2);
          } else {
            const mainEdge = mainDiv.getBoundingClientRect().bottom;
            const relatedEdge = relatedDiv.getBoundingClientRect().top;
            setVertical(relatedEdge - mainEdge + relatedDivHeight / 2);
          }
        }
      }
    }, 500);
  }, [horizontal, vertical]);

  const hasNextItems = !!props.nextItem && props.nextItem.items.length > 0;

  return (
    <li className={`level-${level}${!hasNextItems ? " no-children" : ""}`}>
      <div className="info" id={props?.sys?.id}>
        <div className="box">
          <div className="inner">
            <strong>{props.shortTitle || props.title}</strong>
            <br />
            <p>
              <strong>Salary:</strong> ${numberShorthand(props.salaryRangeStart)} - $
              {numberShorthand(props.salaryRangeEnd)}
            </p>
            <p>
              <strong>Education:</strong> <EducationLevel level={props.educationLevel} />
            </p>
          </div>
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
            <NextNode key={nextItem?.sys?.id} {...nextItem} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};
