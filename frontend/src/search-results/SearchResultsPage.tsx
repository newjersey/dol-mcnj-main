import {
  ChangeEvent,
  ReactElement,
  useContext,
  useEffect,
  useState
} from "react";
import { RouteComponentProps, WindowLocation } from "@reach/router";
import { CircularProgress } from "@material-ui/core";

import { logEvent } from "../analytics";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingData, TrainingResult } from "../domain/Training";
import pageImage from "../images/ogImages/searchResults.png";

import { Breadcrumbs } from "./Breadcrumbs";
import { Pagination } from "./Pagination";
import { ResultsHeader } from "./ResultsHeader";
import { TrainingResultCard } from "./TrainingResultCard";
import { SearchSelects } from "./SearchSelects";
import { SearchTips } from "./SearchTips";

import { ComparisonContext } from "../comparison/ComparisonContext";
import { FilterDrawer } from "../filtering/FilterDrawer";

import { getTrainingData, getSearchQuery } from "./searchResultFunctions";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = ({
  client,
  location
}: Props): ReactElement<Props> => {
  const [isError, setIsError] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<TrainingData["meta"]>();
  const [pageNumber, setPageNumber] = useState<number>();
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match">("best_match");
  const [trainings, setTrainings] = useState<TrainingResult[]>([]);
  
  const comparisonState = useContext(ComparisonContext).state;
  const searchQuery = getSearchQuery(location?.search);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("p");
    const pageNumberValue = page ? parseInt(page) : 1;
    setLoading(true);
    setPageNumber(pageNumberValue);
    const queryToSearch = searchQuery ? searchQuery : "";
    getTrainingData(client,
                    queryToSearch,
                    setIsError,
                    setLoading,
                    setMetaData,
                    setTrainings);
  }, [client, searchQuery]);
  
  const handleLimitChange = (event: ChangeEvent<{ value: string }>): void => {
    setLoading(true);
    setItemsPerPage(
      event.target.value as unknown as number,
    );
  };
  
  const handleSortChange = (event: ChangeEvent<{ value: unknown }>): void => {
    const newSortOrder = event.target.value as "asc" | "desc" | "price_asc"  | "price_desc" | "EMPLOYMENT_RATE" | "best_match";
    setSortBy(newSortOrder);
    logEvent("Search", "Updated sort", newSortOrder);
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
          <div id="search-results-heading">
            <ResultsHeader
              loading={loading}
              searchQuery={searchQuery || ""}
              metaCount={metaData?.totalItems || 0}
            />
            {!loading && trainings.length > 0 && (
              <SearchSelects
                handleSortChange={handleSortChange}
                handleLimitChange={handleLimitChange}
                itemsPerPage={itemsPerPage}
                sortBy={sortBy}
              />
            )}
          </div>
          {!loading && (
            <FilterDrawer />
          )}
        </div>
        <div id="results-container">
          {loading && (
            <div className="fdr fjc ptl">
              <CircularProgress color="secondary" />
            </div>
          )}
          {!loading
            && !isError
            && trainings.length <= 5
            && (
              <SearchTips />
          )}
          {!loading
            && !isError
            && trainings.length > 0
            && (
            <div id="results-list">
              {trainings.map((training) => (
                <TrainingResultCard
                  key={training.id}
                  trainingResult={training}
                  comparisonItems={comparisonState.comparison}
                />
              ))}
              {pageNumber
                && (
                <Pagination
                  isLoading={loading}
                  setIsLoading={setLoading}
                  currentPage={pageNumber || 1}
                  totalPages={metaData?.totalPages || 0}
                  hasPreviousPage={metaData?.hasPreviousPage || false}
                  hasNextPage={metaData?.hasNextPage || false}
                  setPageNumber={setPageNumber}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};