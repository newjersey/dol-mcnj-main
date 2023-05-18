import { useEffect, useState } from "react";
import { CAREER_MAP_NODE_QUERY } from "../queries/careerMapNode";
import { CareerMapNode } from "./modules/CareerMapNode";
import { contentfulClient } from "../utils/contentfulClient";
import { CareerMapNodeProps } from "../types/contentful";

interface SinglePathObjectProps {
  careerMapObject: CareerMapNodeProps;
}

export const SinglePath = ({ mapId }: { mapId: string }) => {
  const [data, setData] = useState<SinglePathObjectProps>();
  useEffect(() => {
    if (mapId) {
      const fetchData = async () => {
        try {
          /* eslint-disable-next-line  */
          const result: any = await contentfulClient({
            query: CAREER_MAP_NODE_QUERY,
            variables: { id: mapId },
          });
          setData(result);
        } catch (error) {
          console.error(error);
          return {};
        }
      };

      fetchData();
    }
  }, [mapId]);
  return <>{data && <CareerMapNode {...data.careerMapObject} />}</>;
};
