import { IconNames } from "../types/icons";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";
import { PhosphorIconSelector } from "./modules/PhosphorIconSelector";

export const Stepper = ({
  theme = "green",
  steps,
}: {
  steps: {
    header?: string;
    icon: IconNames;
    description: string;
  }[];
  theme?: "green" | "navy" | "purple" | "blue";
}) => {
  return (
    <div className={`stepper${theme ? ` theme-${theme}` : ""}`}>
      {steps?.map(({ header, icon, description }, index: number) => (
        <div className="step" key={header + icon + index}>
          <span className="number">{index + 1}</span>
          <PhosphorIconSelector name={icon} size={32} />

          <span className="title">{header}</span>
          <div
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(description),
            }}
          />
        </div>
      ))}
    </div>
  );
};
