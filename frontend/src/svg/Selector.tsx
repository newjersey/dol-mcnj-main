import { Factory, Stethoscope, Truck } from "@phosphor-icons/react";
import { Explore } from "./Icons/Explore";
import { Jobs } from "./Icons/Jobs";
import { Support } from "./Icons/Support";
import { Training } from "./Icons/Training";
import { ExploreBold } from "./Icons/ExploreBold";
import { JobsBold } from "./Icons/JobsBold";
import { SupportBold } from "./Icons/SupportBold";
import { TrainingBold } from "./Icons/TrainingBold";

interface SelectorProps {
  name:
    | "exploreBold"
    | "jobsBold"
    | "supportBold"
    | "trainingBold"
    | "explore"
    | "jobs"
    | "support"
    | "training"
    | "healthcare"
    | "manufacturing"
    | "tdl";
  color?: string;
}

export const Selector = ({ name, color }: SelectorProps) => {
  return (
    <>
      {name === "explore" && <Explore color={color} />}
      {name === "jobs" && <Jobs color={color} />}
      {name === "support" && <Support color={color} />}
      {name === "training" && <Training color={color} />}
      {name === "exploreBold" && <ExploreBold color={color} />}
      {name === "jobsBold" && <JobsBold color={color} />}
      {name === "supportBold" && <SupportBold color={color} />}
      {name === "trainingBold" && <TrainingBold color={color} />}
      {name === "healthcare" && <Stethoscope color={color} size={32} />}
      {name === "manufacturing" && <Factory color={color} size={32} />}
      {name === "tdl" && <Truck color={color} size={32} />}
    </>
  );
};
