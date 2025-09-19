import { ResultProps } from "./types";

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
      if (a.percentEmployed && b.percentEmployed) {
        return b.percentEmployed - a.percentEmployed;
      }
      return 0;
    });
  }

  return copyArray;
};
