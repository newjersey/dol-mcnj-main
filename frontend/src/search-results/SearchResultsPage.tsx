import { ChangeEvent, ReactElement, useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingData, TrainingResult } from "../domain/Training";
import { Breadcrumbs } from "./Breadcrumbs";
import { Pagination } from "./Pagination";
import { ResultsHeader } from "./ResultsHeader";
import { TrainingComparison } from "./TrainingComparison";
import { TrainingResultCard } from "./TrainingResultCard";
import { SearchFilters } from "./SearchFilters";
import { SearchTips } from "./SearchTips";
import { getSearchQuery, getTrainingData } from "./searchFunctions";
import { SkeletonCard } from "./SkeletonCard";
import {WindowLocation} from "@reach/router";

interface Props {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
  path: string;
}

export const SearchResultsPage = ({ client, location, path }: Props): ReactElement<Props> => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<TrainingData["meta"] | undefined>(undefined);
  const [trainings, setTrainings] = useState<TrainingResult[]>([]);
  const searchQuery = getSearchQuery(location?.search);
  const [filters, setFilters] = useState({
    itemsPerPage: 10,
    pageNumber: 1,
    sortBy: "best_match" as "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match",
    searchQuery: searchQuery || "",
    cipCode: undefined as string | undefined,
    classFormat: undefined as string[] | undefined,
    completeIn: undefined as number[] | undefined,
    county: undefined as string | undefined,
    inDemand: undefined as boolean | undefined,
    languages: undefined as string[] | undefined,
    maxCost: undefined as number | undefined,
    miles: undefined as number | undefined,
  });

  // Fetch the first page of results
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await getTrainingData(
        client,
        filters.searchQuery,
        setIsError,
        setIsLoading,
        setMetaData,
        setTrainings,
        filters.cipCode,
        filters.classFormat,
        filters.completeIn,
        filters.county,
        filters.inDemand,
        filters.itemsPerPage,
        filters.languages,
        filters.maxCost,
        filters.miles,
        filters.pageNumber
      );
    };
    fetchInitialData();
  }, [client, filters.searchQuery, filters.pageNumber]);

  // Fetch the next page only when needed
  useEffect(() => {
    const loadNextPage = async () => {
      if (metaData && metaData.hasNextPage && filters.pageNumber > 1) {
        setIsLoading(true);
        await getTrainingData(
          client,
          filters.searchQuery,
          setIsError,
          setIsLoading,
          setMetaData,
          (newTrainings) => {
            if (Array.isArray(newTrainings)) {
              setTrainings((prevTrainings) => [...prevTrainings, ...newTrainings]); // Append new results
            }
          },
          filters.cipCode,
          filters.classFormat,
          filters.completeIn,
          filters.county,
          filters.inDemand,
          filters.itemsPerPage,
          filters.languages,
          filters.maxCost,
          filters.miles,
          filters.pageNumber
        );
      }
    };

    loadNextPage();
  }, [filters.pageNumber, client, filters.searchQuery]);

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "best_match" | "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE";
    setFilters((prevFilters) => ({ ...prevFilters, sortBy: value }));
  };

  const handleLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setFilters((prevFilters) => ({ ...prevFilters, itemsPerPage: value }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prevFilters) => ({ ...prevFilters, pageNumber: newPage }));
  };

  return (
    <Layout client={client}>
      <div>
        <Breadcrumbs />
        <ResultsHeader searchQuery={filters.searchQuery} loading={isLoading} metaCount={metaData?.totalItems || 0} />
        <div id="filters-container">
          <SearchFilters
            handleSortChange={handleSortChange}
            handleLimitChange={handleLimitChange}
            itemsPerPage={filters.itemsPerPage}
            sortBy={filters.sortBy}
          />
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
                <TrainingResultCard key={training.ctid} trainingResult={training} />
              ))}
              {metaData?.totalPages && (
                <Pagination
                  isLoading={isLoading}
                  currentPage={filters.pageNumber || 1}
                  totalPages={metaData.totalPages || 0}
                  hasPreviousPage={metaData.hasPreviousPage || false}
                  hasNextPage={metaData.hasNextPage || false}
                  setPageNumber={handlePageChange}
                />
              )}
            </div>
          )}
          {!isLoading && <TrainingComparison comparisonItems={[]} />}
        </div>
      </div>
    </Layout>
  );
};
