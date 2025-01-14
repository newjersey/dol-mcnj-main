"use client";
import { Tag } from "@components/modules/Tag";
import { Flex } from "@components/utility/Flex";
import { allLanguages } from "@utils/languages";
import React, { useContext } from "react";
import {
  extractParam,
  updateSearchParamsNavigate,
} from "../utils/filterFunctions";
import { getSearchData } from "../utils/getSearchData";
import { ResultsContext } from "./Results";

interface ParamTagProps {
  queryString: string;
}

const formatKey = (key: string) => {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
};

const categorizeTag = (key: string): string => {
  if (key === "online" || key === "inPerson") return "Format";
  if (["days", "weeks", "months", "years"].includes(key))
    return "Time to complete";
  if (allLanguages.includes(formatKey(key))) return "Language";
  if (key === "maxCost") return "Miles";
  if (
    key === "isWheelchairAccessible" ||
    key === "hasChildcareAssistance" ||
    key === "hasEveningCourses" ||
    key === "hasJobPlacementAssistance"
  )
    return "Services";
  if (key === "zipCode") return "ZIP code";
  return formatKey(key);
};

const formatValue = (key: string, value: string): string => {
  if (value === "true") return formatKey(key);
  return value;
};

export const ParamTags = () => {
  const { results, setResults } = useContext(ResultsContext);

  const params = new URLSearchParams(results.searchParams);

  const paramArray = Array.from(params.entries()).filter(
    ([key]) =>
      key !== "q" &&
      key !== "toggle" &&
      key !== "p" &&
      key !== "limit" &&
      key !== "sort"
  );

  const renderTags = () => {
    return Array.from(params.entries())
      .filter(
        ([key]) =>
          key !== "q" &&
          key !== "toggle" &&
          key !== "p" &&
          key !== "limit" &&
          key !== "sort"
      )
      .map(([key, value]) => (
        <button
          key={key}
          onClick={() => {
            updateSearchParamsNavigate(
              [
                { key, value: "" },
                { key: "p", value: "1" },
              ],
              getSearchData,
              setResults
            );
            window.location.reload();
          }}
        >
          <Tag
            small
            suffixIcon="X"
            color="blue"
            className="param-tag"
            title={`${categorizeTag(key)}: **${formatValue(key, value)}**`}
            markdown
          />
        </button>
      ));
  };

  return (
    <Flex flexWrap="wrap" gap="xxs" alignItems="center" className="param-tags">
      {renderTags()}
      {paramArray.length > 0 && (
        <a href={`/training/search?q=${extractParam("q", results)}`}>
          Clear filters
        </a>
      )}
    </Flex>
  );
};
