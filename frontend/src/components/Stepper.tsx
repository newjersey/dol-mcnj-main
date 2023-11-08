import { IconNames } from "../types/icons";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";
import { PhosphorIconSelector } from "./modules/PhosphorIconSelector";

export const Stepper = ({
  theme = "green",
  steps,
}: {
  steps: {
    heading?: string;
    icon: IconNames;
    description: string;
  }[];
  theme?: "green" | "navy" | "purple" | "blue";
}) => {
  return (
    <div className={`stepper${theme ? ` theme-${theme}` : ""}`}>
      {steps?.map(({ heading, icon, description }, index: number) => (
        <div className="step" key={heading + icon + index}>
          <PhosphorIconSelector name={icon} size={32} />

          <span className="title">{heading}</span>
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
