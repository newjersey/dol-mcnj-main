import { useState } from "react";
import { IconSelector } from "../IconSelector";
import { Heading } from "./Heading";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

interface LabelBoxProps {
  centered?: boolean;
  children: React.ReactNode;
  className?: string;
  color: "blue" | "purple" | "green" | "navy" | "orange";
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  icon?: string;
  iconWeight?: "regular" | "bold" | "thin" | "light" | "duotone" | "fill";
  title: string;
  toggle?: boolean;
}

export const LabelBox = ({
  centered,
  children,
  className,
  color,
  headingLevel = 3,
  icon,
  iconWeight,
  title,
  toggle,
}: LabelBoxProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div
      className={`labelBox${className ? ` ${className}` : ""}${color ? ` color-${color}` : ""}${
        centered ? ` centered` : ""
      }${toggle ? ` toggleBox` : ""}`}
    >
      {toggle ? (
        <button
          className="title toggle"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <Heading level={headingLevel}>
            {icon && <IconSelector name={icon} size={20} weight={iconWeight} />}
            {title}
          </Heading>
          {open ? (
            <CaretUp className="indicator" weight="bold" size={20} />
          ) : (
            <CaretDown className="indicator" weight="bold" size={20} />
          )}
        </button>
      ) : (
        <Heading className="title" level={headingLevel}>
          {icon && <IconSelector name={icon} size={20} weight={iconWeight} />}
          {title}
        </Heading>
      )}
      <div className={`content${open ? ` open` : ""}`}>{children}</div>
    </div>
  );
};
