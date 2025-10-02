import { ResultProps } from "./types";
import { getPercentEmployed } from "./outcomeHelpers";

export const arraySorting = ({
  array,
  sortBy,
}: {
  array: ResultProps[];
  sortBy: "match" | "low" | "high" | "rate";
}) => {
  const copyArray = [...array]; // Create a copy to avoid modifying the original array

  if (sortBy === "match") {
    return copyArray;
  }

  if (sortBy === "low") {
    return copyArray.sort((a, b) => {
      if (a.totalCost && b.totalCost) {
        return a.totalCost - b.totalCost;
      }
      return 0;
    });
  }

  if (sortBy === "high") {
    return copyArray.sort((a, b) => {
      if (a.totalCost && b.totalCost) {
        return b.totalCost - a.totalCost;
      }
      return 0;
    });
  }

  if (sortBy === "rate") {
    return copyArray.sort((a, b) => {
      const aRate = getPercentEmployed(a.outcomes);
      const bRate = getPercentEmployed(b.outcomes);
      if (aRate && bRate) {
        return bRate - aRate;
      }
      return 0;
    });
  }

  return copyArray;
};
