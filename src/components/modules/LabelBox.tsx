import { HeadingLevel, IconWeight, ThemeColors } from "@utils/types";
import { Heading } from "./Heading";
import { IconSelector } from "./IconSelector";
import { Box } from "@components/utility/Box";

interface LabelBoxProps {
  centered?: boolean;
  children: React.ReactNode;
  className?: string;
  color: ThemeColors;
  headingLevel?: HeadingLevel;
  bgFill?: boolean;
  large?: boolean;
  icon?: string;
  iconSuffix?: string;
  iconWeight?: IconWeight;
  subheading?: string;
  title: string;
}

export const LabelBox = ({
  centered,
  large,
  children,
  bgFill,
  className,
  color = "navy",
  headingLevel = 3,
  icon,
  iconSuffix,
  iconWeight,
  subheading,
  title,
}: LabelBoxProps) => {
  return (
    <Box
      radius={5}
      className={`labelBox${className ? ` ${className}` : ""}${
        color ? ` color-${color}` : ""
      }${centered ? ` centered` : ""}${bgFill ? ` bg-fill` : ""}${
        large ? ` large` : ""
      }`}
    >
      <Heading className="title" level={headingLevel}>
        {icon && <IconSelector name={icon} size={20} weight={iconWeight} />}
        <span>
          {title}
          {subheading && large && (
            <span className="subheading">{subheading}</span>
          )}
        </span>
        {iconSuffix && (
          <IconSelector name={iconSuffix} size={20} weight={iconWeight} />
        )}
      </Heading>
      <div className="content">{children}</div>
    </Box>
  );
};
