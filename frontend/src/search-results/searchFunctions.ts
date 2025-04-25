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
  const pageNumber = pageNum || 1;  // Default to 1 if pageNum is undefined
  const cacheKey = `${queryToSearch}-${cipCode}-${classFormat}-${completeIn}-${county}-${inDemand}-${itemsPerPage}-${languages}-${maxCost}-${miles}-${pageNumber}-${services}-${socCode}-${sortBy}-${zipCode}`;

  // Log the page number and cache key
  console.log("Fetching page:", pageNumber);
  console.log("Cache Key:", cacheKey);

  // Check if data is cached
  const cachedData = sessionStorage.getItem(cacheKey);
  console.log("Cache hit/miss:", cachedData ? "Hit" : "Miss");
  if (cachedData) {
    setLoading(false); // Set loading to false immediately
    const parsedData = JSON.parse(cachedData) as TrainingData;
    setMetaData(parsedData.meta);
    setTrainings(parsedData.data);
    console.log("Cache hit. Returning cached data.");
    return; // Skip the API call if cached data is available
  }

  // Proceed with API call if no cached data
  client.getTrainingsByQuery(
    queryToSearch,
    {
      onSuccess: (data: TrainingData) => {
        // Cache the data for future use
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        setMetaData(data.meta);
        setTrainings(data.data);
        setLoading(false);
        console.log("Data fetched and cached.");
      },
      onError: () => {
        setIsError(true);
        setLoading(false);
        console.log("Error fetching data.");
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
    pageNumber, // Ensure page number is passed correctly
    services,
    socCode,
    sortBy,
    zipCode,
  );
};




export const getSearchQuery = (searchString: string | undefined): string | undefined => {
  if (!searchString) return undefined;

  const regex = /\?q=([^&]*)/;
  const matches = searchString.match(regex);

  if (matches) {
    const decodedQuery = decodeURIComponent(matches[1]).replace(/\+/g, ' ');
    console.log("Search query extracted:", decodedQuery);  // Log the extracted query
    return decodedQuery;
  }

  console.log("No search query found.");
  return undefined;
};


type FilterFields = {
  [key: string]: string | number | boolean | string[] | number[] | boolean[];
};

export const filterChips = (filters: FilterFields) => {
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

  return removeQueryArray.flat();
};

export const handleChipClick = (id: string, value: string) => {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const searchParam = searchParams.get(id);

  if (searchParam) {
    const values = searchParam.split(",").filter(Boolean);

    const updatedValues = values.filter((v) => v !== value);

    if (updatedValues.length > 0) {
      searchParams.set(id, updatedValues.join(","));
    } else {
      searchParams.delete(id);
    }

    window.history.replaceState({}, "", `${url.pathname}?${searchParams.toString()}`);
  }

  window.location.href = `${url.pathname}?${searchParams.toString()}`;
};
