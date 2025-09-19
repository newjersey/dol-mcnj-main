import { capitalizeFirstLetter } from "./capitalizeFirstLetter";
import { LinkProps } from "./types";
import * as Svg from "@components/svgs";

export const convertToCardObjects = (linkObjects: LinkProps[]) => {
  return linkObjects.map((linkObject) => {
    return {
      sys: {
        id: linkObject.sys?.id || linkObject.copy,
      },
      title: linkObject.copy || "",
      url: linkObject.url,
      svg: linkObject.icon
        ? (`${capitalizeFirstLetter(linkObject.icon)}Bold` as keyof typeof Svg)
        : (linkObject.systemIcon as keyof typeof Svg),
      description: linkObject.message,
      icon: linkObject.icon,
    };
  });
};
