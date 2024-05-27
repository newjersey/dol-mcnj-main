import { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { WindowLocation } from "@reach/router";
import { Client } from "../domain/Client";
import { TrainingResult, TrainingData } from "../domain/Training";
import { RouteComponentProps, Link } from "@reach/router";
import { TrainingResultCard } from "./TrainingResultCard";
import { CircularProgress, useMediaQuery, Icon } from "@material-ui/core";
import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";
import { SortOrder } from "../sorting/SortOrder";
import { SortContext } from "../sorting/SortContext";
import { FilterContext } from "../filtering/FilterContext";
import { TrainingComparison } from "./TrainingComparison";
import { ComparisonContext } from "../comparison/ComparisonContext";
import { useTranslation } from "react-i18next";
import { logEvent } from "../analytics";
import { Layout } from "../components/Layout";
import { usePageTitle } from "../utils/usePageTitle";
import { ArrowLeft } from "@phosphor-icons/react";
import { Pagination } from "./Pagination";
import pageImage from "../images/ogImages/searchResults.png";

import { Breadcrumbs } from "./Breadcrumbs";
import { FilterBox } from "../filtering/FilterBox";
import { ResultsCount } from "./ResultsCount";
import { SearchSelects } from "./SearchSelects";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = (props: Props): ReactElement<Props> => {
  const isTabletAndBelow = useMediaQuery("(max-width:767px)");
  const { t } = useTranslation();

  const [trainings, setTrainings] = useState<TrainingResult[]>([]);
  const [metaData, setMetaData] = useState<TrainingData["meta"]>();
  const [metaCount, setMetaCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>();
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingResult[]>([]);
  const [shouldShowTrainings, setShouldShowTrainings] = useState<boolean>(false);
  const [showSearchTips, setShowSearchTips] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string>(
    `Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
  );

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match" | undefined>();

  const filterState = useContext(FilterContext).state;
  const comparisonState = useContext(ComparisonContext).state;
  const sortContextValue = useContext(SortContext);
  const sortState = sortContextValue.state;

  const searchString = props.location?.search;
  const regex = /\?q=([^&]*)/;
  const matches = searchString?.match(regex);
  const searchQuery = matches ? decodeURIComponent(matches[1]) : null;

  usePageTitle(pageTitle);

  useEffect(() => {
    let newFilteredTrainings = trainings;

    filterState.filters.forEach((filter) => {
      newFilteredTrainings = filter.func(newFilteredTrainings);
    });

    const sortedResults = newFilteredTrainings?.sort((a: TrainingResult, b: TrainingResult) => {
      switch (sortState.sortOrder) {
        case SortOrder.BEST_MATCH:
          return b.rank - a.rank;
        case SortOrder.COST_LOW_TO_HIGH:
          return a.totalCost - b.totalCost;
        case SortOrder.COST_HIGH_TO_LOW:
          return b.totalCost - a.totalCost;
        case SortOrder.EMPLOYMENT_RATE:
          return (
            (b.percentEmployed ? b.percentEmployed : 0) -
            (a.percentEmployed ? a.percentEmployed : 0)
          );
        default:
          return 0;
      }
    });

    sortedResults ? setFilteredTrainings([...sortedResults]) : setFilteredTrainings([]);

    setShowSearchTips(pageNumber === 1 && newFilteredTrainings?.length < 5);

    if (newFilteredTrainings?.length > 0 && searchQuery !== "null") {
      setShouldShowTrainings(true);
    }
  }, [trainings, filterState.filters, sortState.sortOrder, showSearchTips, searchQuery]);

  if (isError) {
    return <SomethingWentWrongPage client={props.client} />;
  }

  const getPageTitle = (): void => {
    if (!searchQuery || searchQuery === "null") {
      setPageTitle(`Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`);
    } else {
      const query = decodeURIComponent(searchQuery.replace(/\+/g, " ")).toLocaleLowerCase();
      setPageTitle(
        `${query} | Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
      );
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("p");
    const limit = urlParams.get("limit");
    setIsLoading(true);

    if (limit) {
      setItemsPerPage(parseInt(limit));
    } else {
      setItemsPerPage(10);
    }

    if (page) {
      setPageNumber(parseInt(page));
    } else {
      setPageNumber(1);
    }

    if (pageNumber) {
      const queryToSearch = searchQuery ? searchQuery : "";

      if (queryToSearch && queryToSearch !== "null") {
        props.client.getTrainingsByQuery(
          queryToSearch,
          {
            onSuccess: ({ data, meta }: TrainingData) => {
              setTrainings(data);
              setMetaData(meta);
              setMetaCount(meta.totalItems);
              getPageTitle();
              setIsLoading(false);
            },
            onError: () => {
              setIsError(true);
            },
          },
          pageNumber,
          itemsPerPage,
          sortBy,
        );
      }
    }
  }, [searchQuery, props.client, itemsPerPage, pageNumber, sortBy]);

  const handleSortChange = (event: ChangeEvent<{ value: unknown }>): void => {
    const newSortOrder = event.target.value as "asc" | "desc" | "price_asc"  | "price_desc" | "EMPLOYMENT_RATE" | "best_match";
    setSortBy(newSortOrder);
    logEvent("Search", "Updated sort", newSortOrder);
  };

  const handleLimitChange = (event: ChangeEvent<{ value: string }>): void => {
    setIsLoading(true);
    setItemsPerPage(
      event.target.value as unknown as number,
    );
  };

  return (
    <Layout
      noFooter
      client={props.client}
      seo={{
        title: pageTitle || `Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
        url: props.location?.pathname || "/training/search",
        image: pageImage,
      }}
    >
      <div id="search-results-page" className="container">
        <Breadcrumbs />
        <div className="results-heading">
          <div id="results-selects-container">
            <div className="result-count-container">
              {!isLoading && (
                <ResultsCount
                  searchQuery={searchQuery}
                  metaCount={metaCount}
                />
              )}
            </div>
            <SearchSelects
              handleSortChange={handleSortChange}
              handleLimitChange={handleLimitChange}
              itemsPerPage={itemsPerPage}
              sortBy={sortBy}
            />
          </div>
          <FilterBox
          />
        </div>
        <div>
          {isLoading ? (
            <div className="fdr fjc ptl">
              <CircularProgress color="secondary" />
            </div>
          ) : (
            <div>
              {filteredTrainings.map((training) => (
                <TrainingResultCard
                  key={training.id}
                  trainingResult={training}
                  comparisonItems={comparisonState.comparison}
                />
              ))}
            </div>
          )}
        </div>
        <Pagination
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          currentPage={pageNumber || 1}
          totalPages={metaData?.totalPages || 0}
          hasPreviousPage={metaData?.hasPreviousPage || false}
          hasNextPage={metaData?.hasNextPage || false}
          setPageNumber={setPageNumber}
        />
        <TrainingComparison comparisonItems={comparisonState.comparison} />
      </div>
    </Layout>
  )
};
