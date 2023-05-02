import { Fragment } from "react";
import { CAREER_MAP_QUERY } from "../queries/careerMap";
import { useContentfulClient } from "../utils/useContentfulClient";
import { CareerMapNode, CareerMapNodeProps } from "./modules/CareerMapNode";
import { Selector } from "../svg/Selector";

export const PathwayGroup = (props: {
  sys: {
    id: string;
  };
  title: string;
  icon: "explore" | "jobs" | "support" | "training" | "healthcare" | "manufacturing" | "tdl";
}) => {
  const data: {
    careerMap: {
      title: string;
      careerMapItemsCollection: {
        items: CareerMapNodeProps[];
      };
    };
  } = useContentfulClient({
    query: CAREER_MAP_QUERY,
    variables: { id: props.sys.id },
  });

  const firstItemsLength = data?.careerMap.careerMapItemsCollection.items.length;

  const mapSize =
    firstItemsLength > 2 ? "full-map" : firstItemsLength === 2 ? "medium-map" : "small-map";

  return (
    <div className={`career-map-container ${mapSize}`}>
      <div className="career-map">
        {data && (
          <>
            <div className="box main">
              <Selector name={props.icon} color="#fff" />
            </div>
            <ul className="main-list">
              {data.careerMap.careerMapItemsCollection.items.map((mapItem) => (
                <CareerMapNode key={mapItem.sys.id} {...mapItem} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};
