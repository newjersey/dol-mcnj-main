"use client";
import { ButtonProps } from "@utils/types";
import { IconSelector } from "./IconSelector";
import { LinkObject } from "./LinkObject";
import { Flex } from "@components/utility/Flex";

/**
 * Versatile button component supporting multiple types and extensive styling options.
 * 
 * Can render as button, submit button, or link styled as button. Supports icons, custom colors,
 * outlined variants, and various preset styles. Based on USWDS Button with extensions.
 * One of the most-used interactive components in the application.
 * 
 * @param props.type - Button type: "button" | "submit" | "link" (determines rendered element)
 * @param props.label - Button text label (alternative to children)
 * @param props.children - React children (alternative to label)
 * @param props.onClick - Click handler function
 * @param props.link - URL to navigate to (when type="link")
 * @param props.defaultStyle - Preset style: "primary" | "secondary" | "accent" | etc.
 * @param props.outlined - Whether to use outline variant
 * @param props.disabled - Whether button is disabled
 * @param props.unstyled - Whether to remove all default styling
 * @param props.iconPrefix - Icon to display before label (Phosphor icon name)
 * @param props.iconSuffix - Icon to display after label
 * @param props.svgName - SVG icon name (alternative to Phosphor icons)
 * @param props.iconWeight - Icon weight for Phosphor icons
 * @param props.customBgColor - Custom background color (hex or CSS color)
 * @param props.customTextColor - Custom text color
 * @param props.customBorderColor - Custom border color
 * @param props.newTab - Whether link opens in new tab (when type="link")
 * @param props.ariaLabel - Accessibility label
 * @param props.className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * // Primary action button
 * <Button type="button" label="Save" onClick={handleSave} />
 * 
 * // Outlined secondary button with icon
 * <Button type="button" defaultStyle="secondary" outlined 
 *         iconPrefix="Plus" label="Add Item" />
 * 
 * // Link styled as button
 * <Button type="link" link="/training/search" 
 *         label="Browse Programs" iconSuffix="ArrowRight" />
 * 
 * // Submit button with custom colors
 * <Button type="submit" label="Submit Application" 
 *         customBgColor="#1e3a8a" customTextColor="#ffffff" />
 * ```
 */
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
