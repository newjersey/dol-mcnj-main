import { createButtonObject } from "./createButtonObject";
import { LinkProps, ButtonProps, ThemeColors } from "./types";
import * as Svg from "../components/svgs";

describe("createButtonObject", () => {
  const link: LinkProps = {
    copy: "Click me",
    url: "https://example.com",
    icon: "icon-name",
    systemIcon: "jobs",
  };

  it("creates a button object with default values", () => {
    const buttonObject = createButtonObject(link);
    expect(buttonObject).toEqual({
      iconPrefix: link.icon,
      className: undefined,
      link: link.url,
      label: link.copy,
      svgName: "Jobs",
      type: "link",
      highlight: undefined,
      iconSuffix: undefined,
      customBgColor: undefined,
      customBorderColor: undefined,
      customTextColor: undefined,
      fontColor: undefined,
      iconWeight: undefined,
      info: undefined,
    });
  });

  it("creates a button object with provided button values", () => {
    const buttonProps = {
      className: "custom-class",
      customBgColor: "#fff",
      customBorderColor: "#000",
      customTextColor: "#333",
      fontColor: "#666",
      highlight: "blue" as ThemeColors,
      iconPrefix: "custom-icon-prefix",
      iconSuffix: "custom-icon-suffix",
      iconWeight: "bold",
      svgName: "Down" as keyof typeof Svg,
      info: true,
      type: "button" as "button",
    };
    const buttonObject = createButtonObject(link, buttonProps);
    expect(buttonObject).toEqual({
      iconPrefix: buttonProps.iconPrefix,
      className: buttonProps.className,
      link: link.url,
      label: link.copy,
      svgName: buttonProps.svgName,
      type: buttonProps.type,
      highlight: buttonProps.highlight,
      iconSuffix: buttonProps.iconSuffix,
      customBgColor: buttonProps.customBgColor,
      customBorderColor: buttonProps.customBorderColor,
      customTextColor: buttonProps.customTextColor,
      fontColor: buttonProps.fontColor,
      iconWeight: buttonProps.iconWeight,
      info: buttonProps.info,
    });
  });

  it("falls back to link values if button values are not provided", () => {
    const buttonProps = {
      className: "custom-class",
      type: "button" as "button",
    };
    const buttonObject = createButtonObject(link, buttonProps);
    expect(buttonObject).toEqual({
      iconPrefix: link.icon,
      className: buttonProps.className,
      link: link.url,
      label: link.copy,
      svgName: "Jobs",
      type: buttonProps.type,
      highlight: undefined,
      iconSuffix: undefined,
      customBgColor: undefined,
      customBorderColor: undefined,
      customTextColor: undefined,
      fontColor: undefined,
      iconWeight: undefined,
      info: undefined,
    });
  });

  it("handles missing link and button values", () => {
    const incompleteLink: Partial<LinkProps> = {
      copy: "Click me",
    };
    const buttonObject = createButtonObject(incompleteLink as LinkProps);
    expect(buttonObject).toEqual({
      iconPrefix: undefined,
      className: undefined,
      link: undefined,
      label: incompleteLink.copy,
      svgName: undefined,
      type: "link",
      highlight: undefined,
      iconSuffix: undefined,
      customBgColor: undefined,
      customBorderColor: undefined,
      customTextColor: undefined,
      fontColor: undefined,
      iconWeight: undefined,
      info: undefined,
    });
  });
});
