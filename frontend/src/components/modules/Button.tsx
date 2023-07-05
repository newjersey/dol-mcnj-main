import { LinkObjectProps } from "../../types/contentful";
import { IconNames } from "../../types/icons";
import { IconSelector } from "../IconSelector";

interface ButtonProps extends LinkObjectProps {
  buttonId?: string;
  customBgColor?: string;
  customBorderColor?: string;
  customTextColor?: string;
  fontColor?: string;
  iconWeight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  info?: boolean;
  onClick?: () => void;
  type: "button" | "link";
  unstyled?: boolean;
}

const Button = ({
  buttonId,
  className,
  customBgColor,
  customBorderColor,
  customTextColor,
  highlight,
  iconPrefix,
  iconSuffix,
  iconWeight,
  info,
  copy,
  url,
  onClick,
  svgFill,
  svgName,
  type,
  unstyled,
}: ButtonProps) => {
  const isCustom = customBgColor || customTextColor;

  // Constructing the classNames string for the button element based on different conditions
  const classNames = `usa-button${className ? ` ${className}` : ""}${
    highlight ? ` highlight-${highlight}` : ""
  }${isCustom ? ` custom` : ""}${svgName ? ` svg` : ""}${info ? ` info` : ""}${
    svgFill && svgName ? ` fill` : ""
  }${unstyled ? ` unstyled usa-button--unstyled` : ""}`;

  return type === "button" ? (
    <button
      className={classNames}
      id={buttonId}
      type="button"
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      style={
        customBgColor || customTextColor || customBorderColor
          ? {
              backgroundColor: customBgColor,
              color: customTextColor,
              boxShadow: customBorderColor ? `inset 0 0 0 2px ${customBorderColor}` : undefined,
            }
          : undefined
      }
    >
      {svgName && !iconPrefix && !iconSuffix && (
        <span className="svg-container">
          <IconSelector svgName={svgName} size={20} />
        </span>
      )}
      {iconPrefix && !svgName && (
        <IconSelector weight={iconWeight} name={iconPrefix as IconNames} size={20} />
      )}
      <span>{copy}</span>
      {iconSuffix && !svgName && (
        <IconSelector weight={iconWeight} name={iconSuffix as IconNames} size={20} />
      )}
    </button>
  ) : (
    <a
      href={url || "#"}
      className={classNames}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      style={
        customBgColor || customTextColor
          ? {
              backgroundColor: customBgColor,
              color: customTextColor,
            }
          : undefined
      }
    >
      {svgName && !iconPrefix && !iconSuffix && (
        <span className="svg-container">
          <IconSelector svgName={svgName} size={20} />
        </span>
      )}
      {iconPrefix && !svgName && <IconSelector name={iconPrefix as IconNames} size={20} />}
      <span>{copy}</span>
      {iconSuffix && !svgName && <IconSelector name={iconSuffix as IconNames} size={20} />}
    </a>
  );
};

export { Button };
