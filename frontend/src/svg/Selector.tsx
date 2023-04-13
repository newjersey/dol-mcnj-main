import { Explore } from "./Icons/Explore";
import { Jobs } from "./Icons/Jobs";
import { Support } from "./Icons/Support";
import { Training } from "./Icons/Training";

interface SelectorProps {
  name: "explore" | "jobs" | "support" | "training";
  color?: string;
}

export const Selector = ({ name, color }: SelectorProps) => {
  return (
    <>
      {name === "explore" && <Explore color={color} />}
      {name === "jobs" && <Jobs color={color} />}
      {name === "support" && <Support color={color} />}
      {name === "training" && <Training color={color} />}
    </>
  );
};
