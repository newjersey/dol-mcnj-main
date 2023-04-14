import { Explore } from "./Icons/Explore";
import { Healthcare } from "./Icons/Healthcare";
import { Jobs } from "./Icons/Jobs";
import { Manufacturing } from "./Icons/Manufacturing";
import { Support } from "./Icons/Support";
import { Tdl } from "./Icons/Tdl";
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
      {name === "healthcare" && <Healthcare color={color} />}
      {name === "manufacturing" && <Manufacturing color={color} />}
      {name === "tdl" && <Tdl color={color} />}
    </>
  );
};
