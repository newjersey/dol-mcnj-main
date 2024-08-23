import { IconSelector } from "@components/modules/IconSelector";
import { Markdown } from "@components/modules/Markdown";
import { Flex } from "@components/utility/Flex";

interface StepperProps {
  className?: string;
  steps: {
    sys: {
      id: string;
    };
    heading?: string;
    icon?: string;
    description?: string;
    sectionIcon?: string;
  }[];
  theme?: "green" | "navy" | "purple" | "blue";
}

export const Stepper = ({
  className,
  theme = "green",
  steps,
}: StepperProps) => {
  return (
    <Flex
      alignItems="stretch"
      fill
      columnBreak="lg"
      className={`stepper${className ? ` ${className}` : ""}${
        theme ? ` theme-${theme}` : ""
      }`}
    >
      {steps?.map((props) => {
        const { heading, icon, description, sys } = props;
        return (
          <Flex direction="column" gap="micro" className="step" key={sys.id}>
            <IconSelector name={icon} size={32} />
            {heading && <span className="title">{heading}</span>}
            {description && <Markdown content={description} />}
          </Flex>
        );
      })}
    </Flex>
  );
};
