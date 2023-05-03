import { CareerMapProps } from "../types/contentful";
import { PathwayGroup } from "./PathwayGroup";

export const CareerMaps = ({
  icon,
  industry,
  careerMaps,
}: {
  industry: string;
  icon: "explore" | "jobs" | "support" | "training" | "healthcare" | "manufacturing" | "tdl";
  careerMaps: CareerMapProps[];
}) => {
  return (
    <div>
      {careerMaps.map((map) => (
        <PathwayGroup key={map.sys.id} {...map} icon={icon} />
      ))}
    </div>
  );
};
