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
import { CountyProps, LanguageProps } from "../filtering/filterLists";

import { getSearchQuery, filterChips, getTrainingData } from "./searchFunctions";
import { SkeletonCard } from "./SkeletonCard";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

const computeCompleteInArrayFrontend = (completeInStrings: string[]): number[] => {
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
  // Track whether the full dataset has been fetched (used to stop polling)
  const [isFull, setIsFull] = useState<boolean>(false);
  const searchQuery = getSearchQuery(location?.search);
  const [filters, setFilters] = useState({
    itemsPerPage: 10,
    pageNumber: 1,
    sortBy: "best_match" as "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match",
    searchQuery: searchQuery || "",
    cipCode: undefined as string | undefined,
    classFormat: [] as string[],
    completeIn: [] as string[],
    county: undefined as CountyProps | undefined,
    inDemand: false,
    languages: [] as LanguageProps[],
    maxCost: undefined as number | undefined,
    miles: undefined as number | undefined,
    services: [] as string[],
    socCode: undefined as string | undefined,
    zipcode: undefined as string | undefined,
  });

  const comparisonState = useContext(ComparisonContext).state;
  const { t } = useTranslation();

  // --- Update filters from URL (only the ones used) ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const updatedFilters = {
      pageNumber: parseInt(urlParams.get("p") || "1", 10),
      itemsPerPage: parseInt(urlParams.get("limit") || "10", 10),
      sortBy: (urlParams.get("sort") as "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match") || "best_match",
      cipCode: urlParams.get("cip") || undefined,
      classFormat: urlParams.get("format") ? urlParams.get("format")!.split(",") : [],
      completeIn: urlParams.get("completeIn") ? urlParams.get("completeIn")!.split(",") : [],
      county: urlParams.get("county") ? ({ name: urlParams.get("county")! } as unknown as CountyProps) : undefined,
      inDemand: urlParams.get("inDemand") === "true",
      languages: urlParams.get("languages") ? (urlParams.get("languages")!.split(",") as LanguageProps[]) : [],
      maxCost: urlParams.get("maxCost") ? parseInt(urlParams.get("maxCost")!) : undefined,
      miles: urlParams.get("miles") ? parseInt(urlParams.get("miles")!) : undefined,
      services: urlParams.get("services") ? urlParams.get("services")!.split(",") : [],
      socCode: urlParams.get("soc") || undefined,
      zipcode: urlParams.get("zipcode") || undefined,
      searchQuery: getSearchQuery(window.location.search) || ""
    };
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
  }, [window.location.search]);

  // --- Initial fetch ---
  useEffect(() => {
    setIsLoading(true);
    // NOTE: getTrainingData now expects 20 arguments; the extra callback for isFull has been removed.
    getTrainingData(
      client,
      searchQuery || "",
      setIsError,
      setIsLoading,
      setMetaData,
      setTrainings,
      filters.cipCode,
      filters.classFormat,
      computeCompleteInArrayFrontend(filters.completeIn),
      filters.county,
      filters.inDemand,
      filters.itemsPerPage,
      filters.languages,
      filters.maxCost,
      filters.miles,
      filters.pageNumber,
      filters.services,
      filters.socCode,
      filters.sortBy,
      filters.zipcode
    );
  }, [client, searchQuery, JSON.stringify(filters)]);

  // --- Set "isFull" when full data is available ---
  useEffect(() => {
    if (metaData && trainings && metaData.totalItems === trainings.length) {
      setIsFull(true);
    }
  }, [metaData, trainings]);

  // --- Polling for Updates (for the current page only) ---
  // Only poll if not loading, a query exists, and full data has NOT yet been fetched.
  const stableCountRef = useRef(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
        computeCompleteInArrayFrontend(filters.completeIn),
        filters.county,
        filters.inDemand,
        filters.itemsPerPage,
        filters.languages,
        filters.maxCost,
        filters.miles,
        filters.pageNumber,
        filters.services,
        filters.socCode,
        filters.sortBy,
        filters.zipcode
      );
    });
  };

  useEffect(() => {
    if (!isLoading && searchQuery && !isFull) {
      const intervalMs = 5000;
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
              if (stableCountRef.current >= 3 && pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
                console.log("Polling stopped – data is stable for page", filters.pageNumber);
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
  }, [isLoading, searchQuery, filters.pageNumber, filters.itemsPerPage, trainings, client, filters, isFull]);

  // --- Handlers ---
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

  const appliedFilters = Object.fromEntries(
    Object.entries(filters).filter(
      ([key, value]) =>
        value !== undefined &&
        value !== false &&
        (!(Array.isArray(value) && value.length === 0)) &&
        !["itemsPerPage", "pageNumber", "sortBy"].includes(key)
    )
  );

  type FilterFields = {
    [key: string]: string | number | boolean | string[] | number[] | boolean[];
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
                chips={filterChips(appliedFilters as FilterFields) as ChipProps[]}
                {...appliedFilters}
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
