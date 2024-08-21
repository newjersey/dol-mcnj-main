"use client";
import { IconNames } from "@utils/enums";
import { ButtonProps } from "@utils/types";
import { IconSelector } from "./IconSelector";
import { LinkObject } from "./LinkObject";

const Button = ({
  buttonId,
  children,
  className,
  customBgColor,
  customBorderColor,
  customTextColor,
  defaultStyle = "primary",
  disabled,
  highlight,
  iconPrefix,
  iconSuffix,
  iconWeight,
  info,
  label,
  link,
  noIndicator,
  onClick,
  outlined,
  svgFill,
  svgName,
  tag,
  type,
  unstyled,
}: ButtonProps) => {
  const isCustom = customBgColor || customTextColor;
  const hasIcon = svgName || iconPrefix || iconSuffix;

  const isDefault = !highlight && !customBgColor && !info && !isCustom;

  // Constructing the classNames string for the button element based on different conditions
  const classNames = `usa-button${
    defaultStyle && isDefault ? ` ${defaultStyle}` : ""
  }${outlined ? " usa-button--outline" : ""}${
    className ? ` ${className}` : ""
  }${highlight ? ` highlight-${highlight}` : ""}${isCustom ? ` custom` : ""}${
    svgName ? ` svg` : ""
  }${info ? ` info` : ""}${tag ? ` tag` : ""}${
    svgFill && svgName ? ` fill` : ""
  }${unstyled ? ` unstyled usa-button--unstyled` : ""}${
    !hasIcon ? ` centered-text` : ""
  }${type === "link" && disabled ? ` disabled` : ""}`;

  return type === "button" ? (
    <button
      className={classNames}
      id={buttonId}
      disabled={disabled}
      type={type}
      role="button"
      onClick={(e?: any) => {
        if (onClick) {
          onClick(e);
        }
      }}
      style={
        customBgColor || customTextColor || customBorderColor
          ? {
              backgroundColor: customBgColor,
              color: customTextColor,
              boxShadow: customBorderColor
                ? `inset 0 0 0 2px ${customBorderColor}`
                : undefined,
            }
          : undefined
      }
    >
      {!noIndicator && svgName && !iconPrefix && (
        <span className="svg-container">
          <IconSelector className="prefix" svgName={svgName} size={20} />
        </span>
      )}
      {!noIndicator && iconPrefix && !svgName && (
        <IconSelector
          weight={iconWeight}
          className="prefix"
          name={iconPrefix ? (iconPrefix as IconNames) : undefined}
          size={20}
        />
      )}
      {children || <span>{label}</span>}

      {!noIndicator && iconSuffix && (
        <IconSelector
          weight={iconWeight}
          className="suffix"
          name={iconSuffix ? (iconSuffix as IconNames) : undefined}
          size={20}
        />
      )}
    </button>
  ) : type === "submit" ? (
    <button
      className={classNames}
      id={buttonId}
      disabled={disabled}
      type={type}
      role="submit"
      onClick={(e?: any) => {
        if (onClick) {
          onClick(e);
        }
      }}
      style={
        customBgColor || customTextColor || customBorderColor
          ? {
              backgroundColor: customBgColor,
              color: customTextColor,
              boxShadow: customBorderColor
                ? `inset 0 0 0 2px ${customBorderColor}`
                : undefined,
            }
          : undefined
      }
    >
      {!noIndicator && svgName && !iconPrefix && (
        <span className="svg-container">
          <IconSelector className="prefix" svgName={svgName} size={20} />
        </span>
      )}
      {!noIndicator && iconPrefix && !svgName && (
        <IconSelector
          weight={iconWeight}
          className="prefix"
          name={iconPrefix ? (iconPrefix as IconNames) : undefined}
          size={20}
        />
      )}
      {children || <span>{label}</span>}

      {!noIndicator && iconSuffix && (
        <IconSelector
          weight={iconWeight}
          className="suffix"
          name={iconSuffix ? (iconSuffix as IconNames) : undefined}
          size={20}
        />
      )}
    </button>
  ) : (
    <LinkObject
      url={link || "#"}
      className={classNames}
      id={buttonId}
      noIndicator
      role="link"
      onClick={(e?: any) => {
        if (onClick) {
          onClick(e);
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
      {!noIndicator && svgName && !iconPrefix && (
        <span className="svg-container">
          <IconSelector className="prefix" svgName={svgName} size={20} />
        </span>
      )}
      {!noIndicator && iconPrefix && !svgName && (
        <IconSelector
          className="prefix"
          name={iconPrefix ? (iconPrefix as IconNames) : undefined}
          size={20}
        />
      )}
      {children || <span>{label}</span>}
      {!noIndicator && iconSuffix && (
        <IconSelector
          className="suffix"
          name={iconSuffix ? (iconSuffix as IconNames) : undefined}
          size={20}
        />
      )}
    </LinkObject>
  );
};

export { Button };
