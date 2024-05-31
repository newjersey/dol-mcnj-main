import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps, WindowLocation } from "@reach/router";
import { CircularProgress } from "@material-ui/core";

import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingResult, TrainingData } from "../domain/Training";
import pageImage from "../images/ogImages/searchResults.png";
import { usePageTitle } from "../utils/usePageTitle";

import { FilterDrawer } from "../filtering/FilterDrawer";

import { Breadcrumbs } from "./Breadcrumbs";
import { ResultsHeader } from "./ResultsHeader";
import { SearchTips } from "./SearchTips";
import { SearchSelects } from "./SearchSelects";

import { getPageTitle, getSearchQuery } from "./searchResultFunctions";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = ({ client, location }: Props): ReactElement<Props> => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metaData, setMetaData] = useState<TrainingData["meta"]>();
  const [pageTitle, setPageTitle] = useState<string>(
    `Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
  );
  const [trainings, setTrainings] = useState<TrainingResult[]>([]);

  const searchQuery = getSearchQuery(location?.search);

  usePageTitle(pageTitle);

  useEffect(() => {
    setIsLoading(true)
    const queryToSearch = searchQuery ? searchQuery : "";

    if (queryToSearch && queryToSearch !== "null") {
      client.getTrainingsByQuery(
        queryToSearch,
        {
          onSuccess: ({ data, meta }: TrainingData) => {
            setTrainings(data);
            setMetaData(meta);
            getPageTitle(setPageTitle, searchQuery);
            setIsLoading(false);
          },
          onError: () => {
            setIsError(true);
          },
        }
      );
    }
    // setIsLoading(false);
  }, [searchQuery, client]);

  return (
    <Layout
      noFooter
      client={client}
      seo={{
        title: pageTitle,
        url: location?.pathname || "/training/search",
        image: pageImage,
      }}
    >
      <div id="search-results-page" className="container">
        <Breadcrumbs />
        <div id="search-results-filters">
          <div id="results-heading">
            <div className="results-count">
              {!isLoading && (
                <ResultsHeader
                  searchQuery={searchQuery || ""}
                  metaCount={metaData?.totalItems || 0}
                />
              )}
            </div>
            <div>
              {!isLoading
                && !isError
                && trainings.length > 0
                && (
                  <SearchSelects
                    handleSortChange={() => {}}
                    handleLimitChange={() => {}}
                    itemsPerPage={10}
                    sortBy={undefined}
                  />
              )}
            </div>
          </div>
          {!isLoading
            && trainings.length > 0
            && (
            <FilterDrawer />
          )}
        </div>
        <div id="results-container">
          {isLoading && (
            <div className="fdr fjc ptl">
              <CircularProgress color="secondary" />
            </div>
          )}
          {!isLoading
            && !isError
            && trainings.length <= 5
            && (
              <SearchTips />
          )}
        </div>
      </div>
  </Layout>
  );
};