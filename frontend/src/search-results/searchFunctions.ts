import { Dispatch, SetStateAction } from "react";
import { classFormatList, languageList, serviceList } from "../filtering/filterLists";
import { Client } from "../domain/Client";
import { TrainingData, TrainingResult } from "../domain/Training";

export const getPageTitle = (
  setPageTitle: Dispatch<SetStateAction<string>>,
  searchQuery?: string | null,
): void => {
  if (!searchQuery || searchQuery === "null") {
    setPageTitle(`Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`);
  } else {
    const query = decodeURIComponent(searchQuery.replace(/\+/g, " ")).toLocaleLowerCase();
    setPageTitle(
      `${query} | Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
    );
  }
};

export const getTrainingData = (
  client: Client,
  queryToSearch: string,
  setIsError: Dispatch<SetStateAction<boolean>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setMetaData: Dispatch<SetStateAction<TrainingData["meta"] | undefined>>,
  setTrainings: Dispatch<SetStateAction<TrainingResult[]>>,
  cipCode?: string,
  classFormat?: string[],
  completeIn?: number[],
  county?: string,
  inDemand?: boolean,
  itemsPerPage?: number,
  languages?: string[],
  maxCost?: number,
  miles?: number,
  pageNum?: number,
  services?: string[],
  socCode?: string,
  sortBy?: "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match",
  zipCode?: string,
): void => {
  if (queryToSearch && queryToSearch !== "" && queryToSearch !== "null") {
    // Generate a cache key based on the query and parameters
    const cacheKey = `${queryToSearch}-${cipCode}-${classFormat}-${completeIn}-${county}-${inDemand}-${itemsPerPage}-${languages}-${maxCost}-${miles}-${pageNum}-${services}-${socCode}-${sortBy}-${zipCode}`;

    // Check if data is cached
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      setLoading(false); // Set loading to false immediately
      const parsedData = JSON.parse(cachedData) as TrainingData;
      setMetaData(parsedData.meta);
      setTrainings(parsedData.data);
      return; // Skip the API call
    }

    // If no cached data, proceed with API call
    client.getTrainingsByQuery(
      queryToSearch,
      {
        onSuccess: (data: TrainingData) => {
          // Cache the data for future use
          sessionStorage.setItem(cacheKey, JSON.stringify(data));

          setMetaData(data.meta);
          setTrainings(data.data);
          setLoading(false);
        },
        onError: () => {
          setIsError(true);
          setLoading(false);
        },
      },
      cipCode,
      classFormat,
      completeIn,
      county,
      inDemand,
      itemsPerPage,
      languages,
      maxCost,
      miles,
      pageNum,
      services,
      socCode,
      sortBy,
      zipCode,
    );
  } else {
    setLoading(false);
  }
};

export const getSearchQuery = (searchString: string | undefined): string | undefined => {
  const regex = /\?q=([^&]*)/;
  const matches = searchString?.match(regex);
  return matches ? decodeURIComponent(matches[1]).replace(/\+/g, ' ') : undefined;
};

type FilterFields = {
  [key: string]: string | number | boolean | string[] | number[] | boolean[];
};

export const filterChips = (filters: FilterFields) => {
  // make array from the object "filters" and convert the items into {name: key, value: value} pairs

  const titleMaker = (string: string) => {
    if (string === "cipCode") {
      return "CIP code";
    }
    if (string === "socCode") {
      return "SOC code";
    }
    if (string === "completeIn") {
      return "Time to complete";
    }
    if (string === "languages") {
      return "Language";
    }
    if (string === "zipcode") {
      return "ZIP code";
    }
    if (string === "classFormat") {
      return "Format";
    }
    if (string === "inDemand") {
      return "In-demand";
    }

    const separatedString = string.replace(/([a-z])([A-Z])/g, "$1 $2");
    return separatedString.charAt(0).toUpperCase() + separatedString.slice(1).toLowerCase();
  };

  const paramMatcher = (param: string) => {
    if (param === "cipCode") {
      return "cip";
    }
    if (param === "socCode") {
      return "soc";
    }
    if (param === "classFormat") {
      return "format";
    }

    return param;
  };

  const labelMaker = (lang: string, key: string) => {
    // if lang matches an id in languageList, return the label
    const language = [...languageList, ...serviceList, ...classFormatList].find(
      (item) => item.id === lang,
    );
    if (language) {
      return language.label;
    }
    return key === "maxCost" ? `$${lang}` : lang;
  };

  const filterArray = Object.entries(filters).map(([key, value]) => {
    if (Array.isArray(value)) {
      // filter out empty strings and false values
      const filteredArray = value.filter((item) => item !== "" && item !== false);
      return filteredArray.map((item) => ({
        id: paramMatcher(key),
        title: titleMaker(key),
        label: labelMaker(item as string, key),
        value: item,
      }));
    } else if (value !== undefined && value !== null && value !== "" && value !== false) {
      return {
        id: paramMatcher(key),
        title: titleMaker(key),
        label: labelMaker(value as string, key),
        value,
      };
    }
    return [];
  });

  const flattenedFilterArray = filterArray.flat();
  const removeQueryArray = flattenedFilterArray.filter(
    (item) => (item as { id?: string }).id !== "searchQuery",
  );

  // flatten the array
  return removeQueryArray.flat();
};

export const handleChipClick = (id: string, value: string) => {
  // Get the current URL and search parameters
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const searchParam = searchParams.get(id);

  if (searchParam) {
    // Split the parameter value by commas to handle multiple values
    const values = searchParam.split(",").filter(Boolean); // filter out any empty strings

    // Check if the value exists in the list and remove it if present
    const updatedValues = values.filter((v) => v !== value);

    if (updatedValues.length > 0) {
      // If there are still values left, set the parameter to the updated list
      searchParams.set(id, updatedValues.join(","));
    } else {
      // If no values remain, delete the parameter
      searchParams.delete(id);
    }

    // Update the URL without reloading the page
    window.history.replaceState({}, "", `${url.pathname}?${searchParams.toString()}`);
  }

  // navigate to the new URL
  window.location.href = `${url.pathname}?${searchParams.toString()}`;
};
