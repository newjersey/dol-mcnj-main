import { IconNames } from "../types/icons";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";
import { PhosphorIconSelector } from "./modules/PhosphorIconSelector";

export const Stepper = ({
  steps,
}: {
  steps: {
    header: string;
    icon: IconNames;
    text: string;
  }[];
}) => {
  return (
    <div className="stepper">
      {steps?.map(({ header, icon, text }, index: number) => (
        <div className="step" key={header + icon + index}>
          <span className="number">{index + 1}</span>
          <PhosphorIconSelector name={icon} size={32} />
          <span className="title">{header}</span>
          <div
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(text),
            }}
          />
        </div>
      ))}
    </div>
  );
};
