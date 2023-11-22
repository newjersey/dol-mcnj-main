import { OccupationNodeProps } from "../types/contentful";

export const groupObjectsByLevel = (array: OccupationNodeProps[]): OccupationNodeProps[][] => {
  const result: OccupationNodeProps[][] = [];
  const levels: number[] = [];

  for (const obj of array) {
    if (!levels.includes(obj.level)) {
      levels.push(obj.level);
    }
  }

  for (const level of levels) {
    const groupedObjects = array.filter((obj) => obj.level === level);
    result.push(groupedObjects);
  }

  return result;
};
