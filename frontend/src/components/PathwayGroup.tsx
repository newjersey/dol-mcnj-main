import { Fragment, useEffect } from "react";
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

  useEffect(() => {
    if (data) {
      const firstNode = document.querySelector(".level-2:first-of-type > .info > .box");
      const lastNode = document.querySelector(".level-2:last-of-type> .info > .box");

      if (firstNode && lastNode) {
        const firstNodeBottom = firstNode.getBoundingClientRect().bottom;
        const lastNodeTop = lastNode.getBoundingClientRect().top;
        const distance = lastNodeTop - firstNodeBottom;

        firstNode.insertAdjacentHTML(
          "beforeend",
          `<span class="filler" style="height: ${distance}px"></span>`
        );
      }
    }
  }, [data]);

  return (
    <div className={`career-map-container ${mapSize}`}>
      <div className="career-map">
        {data && (
          <>
            <div className="box main">
              <Selector name={props.icon} color="#fff" />
            </div>
            <div className="main-list">
              <ul>
                {data.careerMap.careerMapItemsCollection.items.map((mapItem) => (
                  <CareerMapNode key={mapItem.sys.id} {...mapItem} />
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
