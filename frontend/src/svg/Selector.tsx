import { Factory, Stethoscope, Truck } from "@phosphor-icons/react";
import { Explore } from "./Icons/Explore";
import { Jobs } from "./Icons/Jobs";
import { Support } from "./Icons/Support";
import { Training } from "./Icons/Training";

interface SelectorProps {
  name: "explore" | "jobs" | "support" | "training" | "healthcare" | "manufacturing" | "tdl";
  color?: string;
}

export const Selector = ({ name, color }: SelectorProps) => {
  return (
    <>
      {name === "explore" && <Explore color={color} />}
      {name === "jobs" && <Jobs color={color} />}
      {name === "support" && <Support color={color} />}
      {name === "training" && <Training color={color} />}
      {name === "healthcare" && <Stethoscope color={color} size={32} />}
      {name === "manufacturing" && <Factory color={color} size={32} />}
      {name === "tdl" && <Truck color={color} size={32} />}
    </>
  );
};
