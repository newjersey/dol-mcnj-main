import { ChangeEvent, ReactElement, useContext, useEffect, useRef, useState } from "react";
import { navigate } from "@reach/router";
import { RouteComponentProps, WindowLocation } from "@reach/router";

import { logEvent } from "../analytics";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingData, TrainingResult } from "../domain/Training";
import pageImage from "../images/ogImages/searchResults.png";

import { Breadcrumbs } from "./Breadcrumbs";
import { Pagination } from "./Pagination";
import { ResultsHeader } from "./ResultsHeader";
import { TrainingComparison } from "./TrainingComparison";
import { TrainingResultCard } from "./TrainingResultCard";
import { SearchFilters } from "./SearchFilters";
import { SearchTips } from "./SearchTips";
import { useTranslation } from "react-i18next";

import { ComparisonContext } from "../comparison/ComparisonContext";
import { ChipProps, FilterDrawer } from "../filtering/FilterDrawer";


import { getSearchQuery, filterChips, getTrainingData } from "./searchFunctions";
import { SkeletonCard } from "./SkeletonCard";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

// Helper to convert completeIn filter strings to numbers
const computeCompleteInArray = (completeInStrings: string[]): number[] => {
  const result: number[] = [];
  for (const value of completeInStrings) {
    switch (value) {
      case "days":
        result.push(1, 2, 3);
        break;
      case "weeks":
        result.push(4, 5);
        break;
      case "months":
        result.push(6, 7);
        break;
      case "years":
        result.push(8, 9, 10);
        break;
      default:
        break;
    }
  }
  return result;
};

export const SearchResultsPage = ({ client, location }: Props): ReactElement<Props> => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<TrainingData["meta"]>();
  const [trainings, setTrainings] = useState<TrainingResult[]>([]);
  const searchQuery = getSearchQuery(location?.search);
  const [filters, setFilters] = useState({
    itemsPerPage: 10,
    pageNumber: 1,
    sortBy: "best_match" as "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match",
    searchQuery: searchQuery || "",
    cipCode: "" as string, // Provide a default value
    classFormat: [] as string[], // Default as an empty array
    completeIn: [] as string[], // Default as an empty array
    county: "" as string, // Provide a default value
    inDemand: false, // Default as false
    languages: [] as string[], // Default as an empty array
    maxCost: "" as string, // Default as an empty string, will be converted to number
    miles: "" as string, // Default as an empty string
    services: [] as string[], // Default as an empty array
    socCode: "" as string, // Provide a default value
    zipcode: "" as string, // Provide a default value
  });

  const comparisonState = useContext(ComparisonContext).state;
  const { t } = useTranslation();

  // --- Update filters from URL ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const updatedFilters = {
      pageNumber: parseInt(urlParams.get("p") || "1", 10),
      itemsPerPage: parseInt(urlParams.get("limit") || "10", 10),
      sortBy: (urlParams.get("sort") as "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match") || "best_match",
      cipCode: urlParams.get("cip") || "", // Default to empty string
      classFormat: urlParams.get("format") ? urlParams.get("format")!.split(",") : [],
      completeIn: urlParams.get("completeIn") ? urlParams.get("completeIn")!.split(",") : [],
      county: urlParams.get("county") || "", // Default to empty string
      inDemand: urlParams.get("inDemand") === "true",
      languages: urlParams.get("languages") ? (urlParams.get("languages")!.split(",") as string[]) : [],
      maxCost: urlParams.get("maxCost") || "", // Default to empty string
      miles: urlParams.get("miles") || "", // Default to empty string
      services: urlParams.get("services") ? urlParams.get("services")!.split(",") : [],
      socCode: urlParams.get("soc") || "", // Default to empty string
      zipcode: urlParams.get("zipcode") || "", // Default to empty string
      searchQuery: getSearchQuery(window.location.search) || ""
    };
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
  }, [window.location.search]);

  // --- Initial fetch ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("p");
    const limit = urlParams.get("limit");
    const sortByValue = urlParams.get("sort");
    const cipCodeValue = urlParams.get("cip");
    const classFormatValue = urlParams.get("format");
    const completeInValue = urlParams.get("completeIn");
    const countyValue = urlParams.get("county");
    const inDemandValue = urlParams.get("inDemand");
    const languagesValue = urlParams.get("languages");
    const maxCostValue = urlParams.get("maxCost");
    const milesValue = urlParams.get("miles");
    const servicesValue = urlParams.get("services");
    const socCodeValue = urlParams.get("soc");
    const zipcodeValue = urlParams.get("zipcode");

    const limitValue = limit ? parseInt(limit) : 10;
    const pageNumberValue = page ? parseInt(page) : 1;

    setIsLoading(true);

    const completeInStringArray =
      completeInValue && (completeInValue.includes(",") || completeInValue.includes("%2C"))
        ? completeInValue.split(",")
        : (completeInValue ? [completeInValue] : []);

    setFilters((prev) => ({
      ...prev,
      pageNumber: pageNumberValue,
      itemsPerPage: limitValue,
      sortBy: sortByValue
        ? (sortByValue as "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match")
        : "best_match",
      cipCode: cipCodeValue || "",
      classFormat: classFormatValue ? classFormatValue.split(",") : [],
      completeIn: completeInStringArray,
      county: countyValue || "",
      inDemand: inDemandValue === "true",
      languages: languagesValue ? (languagesValue.split(",") as string[]) : [],
      maxCost: maxCostValue || "", // Default to empty string, will be converted to number
      miles: milesValue || "",
      services: servicesValue ? servicesValue.split(",") : [],
      socCode: socCodeValue || "",
      zipcode: zipcodeValue || "",
    }));

    getTrainingData(
      client,
      searchQuery || "",
      setIsError,
      setIsLoading,
      setMetaData,
      setTrainings,
      filters.cipCode,
      filters.classFormat,
      computeCompleteInArray(filters.completeIn),
      filters.county,
      filters.inDemand,
      filters.itemsPerPage,
      filters.languages,

      Number(filters.maxCost) || undefined,
      Number(filters.miles) || undefined,
      filters.pageNumber,
      filters.services,
      filters.socCode,
      filters.sortBy,
      filters.zipcode
    );
  }, [client, searchQuery, JSON.stringify(filters)]);

  // --- Polling for Updates (for the current page only) ---
  const stableCountRef = useRef(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (filters.pageNumber === 1 && metaData?.totalPages === 1) {
      const intervalMs = 5000;

      // Helper that wraps the getTrainingData call into a Promise
      const fetchTrainingData = (): Promise<TrainingData> => {
        return new Promise((resolve, reject) => {
          client.getTrainingsByQuery(
            searchQuery || "",
            {
              onSuccess: (data: TrainingData) => resolve(data),
              onError: () => reject(new Error("Error fetching training data")),
            },
            filters.cipCode,
            filters.classFormat,
            computeCompleteInArray(filters.completeIn),
            filters.county,
            filters.inDemand,
            filters.itemsPerPage,
            filters.languages,
            Number(filters.maxCost),
            Number(filters.miles),
            filters.pageNumber,
            filters.services,
            filters.socCode,
            filters.sortBy,
            filters.zipcode
          );
        });
      };

      pollIntervalRef.current = setInterval(async () => {
        try {
          const newData = await fetchTrainingData();
          if (newData.data && newData.data.length > 0) {
            const start = (filters.pageNumber - 1) * filters.itemsPerPage;
            const newPageResults = newData.data.slice(start, start + filters.itemsPerPage);
            const newCTIDs = newPageResults.map((t) => t.ctid).join(",");
            const currentCTIDs = trainings.map((t) => t.ctid).join(",");
            if (newCTIDs !== currentCTIDs) {
              console.log("Polled updated data for page", filters.pageNumber);
              setMetaData(newData.meta);
              setTrainings(newPageResults);
              stableCountRef.current = 0;
            } else {
              stableCountRef.current += 1;
              if (stableCountRef.current >= 3) {
                if (pollIntervalRef.current) {
                  clearInterval(pollIntervalRef.current);
                  pollIntervalRef.current = null;
                  console.log("Polling stopped – data is stable for page", filters.pageNumber);
                }
              }
            }
          }
        } catch (error) {
          console.error("Error during polling:", error);
        }
      }, intervalMs);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [filters.pageNumber, metaData?.totalPages, trainings, searchQuery, filters]);

  const handleLimitChange = (event: ChangeEvent<{ value: string }>): void => {
    const newNumber = parseInt(event.target.value);
    setFilters((prev) => ({ ...prev, itemsPerPage: newNumber }));
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("limit", newNumber.toString());
    navigate(`?${urlParams.toString()}`, { replace: true });
  };

  const handleSortChange = (event: ChangeEvent<{ value: unknown }>): void => {
    const newSortOrder = event.target.value as
      | "asc"
      | "desc"
      | "price_asc"
      | "price_desc"
      | "EMPLOYMENT_RATE"
      | "best_match";
    logEvent("Search", "Updated sort", newSortOrder);
    setFilters((prev) => ({ ...prev, sortBy: newSortOrder }));
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("sort", newSortOrder);
    navigate(`?${urlParams.toString()}`, { replace: true });
  };

  return (
    <Layout
      noFooter
      client={client}
      seo={{
        title: `Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
        url: location?.pathname || "/training/search",
        image: pageImage,
      }}
    >
      <div id="search-results-page" className="container">
        <Breadcrumbs />
        <div>
          <div>
            <ResultsHeader
              loading={isLoading}
              searchQuery={searchQuery || ""}
              metaCount={metaData?.totalItems || 0}
            />
            {isLoading && <p>{t("SearchResultsPage.loadingHeaderMessage")}</p>}
          </div>
          {!isLoading && (
            <div id="search-filters-container">
              <FilterDrawer
                chips={filterChips(filters) as ChipProps[]}
                {...filters}
                maxCost={filters.maxCost ? String(filters.maxCost) : undefined}
                miles={filters.miles ? String(filters.miles) : undefined}
              />
              <SearchFilters
                handleSortChange={handleSortChange}
                handleLimitChange={handleLimitChange}
                itemsPerPage={filters.itemsPerPage}
                sortBy={filters.sortBy}
              />
            </div>
          )}
        </div>
        <div id="results-container">
          {isLoading && (
            <div>
              {Array.from({ length: filters.itemsPerPage }, (_, index) => (
                <SkeletonCard key={`skel-${index}`} />
              ))}
            </div>
          )}
          {!isLoading && !isError && trainings.length <= 5 && filters.pageNumber === 1 && <SearchTips />}
          {!isLoading && !isError && trainings.length > 0 && (
            <div id="results-list">
              {trainings.map((training) => (
                <TrainingResultCard
                  key={training.ctid}
                  trainingResult={training}
                  comparisonItems={comparisonState.comparison}
                />
              ))}
              {filters.pageNumber && (
                <Pagination
                  isLoading={isLoading}
                  currentPage={filters.pageNumber || 1}
                  totalPages={metaData?.totalPages || 0}
                  hasPreviousPage={metaData?.hasPreviousPage || false}
                  hasNextPage={metaData?.hasNextPage || false}
                  setPageNumber={(newPage) => setFilters((prev) => ({ ...prev, pageNumber: newPage }))}
                />
              )}
            </div>
          )}
          {!isLoading && <TrainingComparison comparisonItems={comparisonState.comparison} />}
        </div>
      </div>
    </Layout>
  );
};
