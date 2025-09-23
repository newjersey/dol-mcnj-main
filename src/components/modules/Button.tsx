"use client";
import { ButtonProps } from "@utils/types";
import { IconSelector } from "./IconSelector";
import { LinkObject } from "./LinkObject";
import { Flex } from "@components/utility/Flex";

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
  ariaLabel,
  iconWeight,
  info,
  label,
  link,
  noIndicator,
  onClick,
  newTab,
  outlined,
  svgFill,
  svgName,
  style,
  tag,
  type,
  unstyled,
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
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
      aria-label={ariaLabel}
      role="button"
      onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
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
          : style
          ? style
          : undefined
      }
      {...rest}
    >
      {!noIndicator && svgName && !iconPrefix && (
        <span className="svg-container">
          <IconSelector className="prefix" svgName={svgName} size={30} />
        </span>
      )}
      {!noIndicator && iconPrefix && !svgName && (
        <IconSelector
          weight={iconWeight}
          className="prefix"
          name={iconPrefix}
          size={30}
        />
      )}
      {children || <span>{label}</span>}

      {!noIndicator && iconSuffix && (
        <IconSelector
          weight={iconWeight}
          className="suffix"
          name={iconSuffix}
          size={25}
        />
      )}
    </button>
  ) : type === "submit" ? (
    <button
      className={classNames}
      id={buttonId}
      disabled={disabled}
      type={type}
      onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
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
          : style
          ? style
          : undefined
      }
      {...rest}
    >
      {!noIndicator && svgName && !iconPrefix && (
        <span className="svg-container">
          <IconSelector className="prefix" svgName={svgName} size={30} />
        </span>
      )}
      {!noIndicator && iconPrefix && !svgName && (
        <IconSelector
          weight={iconWeight}
          className="prefix"
          name={iconPrefix}
          size={30}
        />
      )}
      {children || <span>{label}</span>}

      {!noIndicator && iconSuffix && (
        <IconSelector
          weight={iconWeight}
          className="suffix"
          name={iconSuffix}
          size={25}
        />
      )}
    </button>
  ) : (
    <LinkObject
      url={link || "#"}
      className={classNames}
      id={buttonId}
      noIndicator
      target={newTab ? "_blank" : undefined}
      role="link"
      onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
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
          : style
          ? style
          : undefined
      }
      {...rest}
    >
      <Flex
        className="grouping"
        gap="xxs"
        elementTag="span"
        columnBreak="none"
        alignItems="center"
      >
        {!noIndicator && svgName && !iconPrefix && (
          <span className="svg-container">
            <IconSelector className="prefix" svgName={svgName} size={30} />
          </span>
        )}
        {!noIndicator && iconPrefix && !svgName && (
          <IconSelector className="prefix" name={iconPrefix} size={30} />
        )}
        {children || <span>{label}</span>}
      </Flex>
      {!noIndicator && iconSuffix && (
        <IconSelector className="suffix" name={iconSuffix} size={25} />
      )}
    </LinkObject>
  );
};

export { Button };
