import { CareerMapProps } from "../types/contentful";
import { PathwayGroup } from "./PathwayGroup";

export const CareerMaps = ({ careerMaps }: { careerMaps: CareerMapProps[] }) => {
  return (
    <div>
      {careerMaps.map((map) => (
        <PathwayGroup key={map.sys.id} {...map} />
      ))}
    </div>
  );
};
