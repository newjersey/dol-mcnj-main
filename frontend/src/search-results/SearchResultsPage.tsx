import { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { WindowLocation } from "@reach/router";
import { Client } from "../domain/Client";
import { TrainingResult, TrainingData } from "../domain/Training";
import { RouteComponentProps, Link } from "@reach/router";
import { TrainingResultCard } from "./TrainingResultCard";
import { CircularProgress, useMediaQuery, Icon } from "@material-ui/core";
import { FilterBox } from "../filtering/FilterBox";
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

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = (props: Props): ReactElement<Props> => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const isTabletAndBelow = useMediaQuery("(max-width:767px)");
  const { t } = useTranslation();

  const [trainings, setTrainings] = useState<TrainingResult[]>([]);
  const [sorting, setSorting] = useState<"asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match">("best_match");
  const [itemsPerPage, setItemsPerPage] = useState<number>();
  const [metaData, setMetaData] = useState<TrainingData["meta"]>();
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
              getPageTitle();
              setIsLoading(false);
            },
            onError: () => {
              setIsError(true);
            },
          },
          pageNumber,
          itemsPerPage,
          sorting,
        );
      }
    }
  }, [searchQuery, props.client, itemsPerPage, pageNumber, sorting]);

  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };

  const getResultCount = (): ReactElement => {
    let message;

    if (!searchQuery || searchQuery === "null") {
      message = t("SearchResultsPage.noSearchTermHeader");
    } else {
      const query = decodeURIComponent(searchQuery.replace(/\+/g, " "));
      message = t("SearchResultsPage.resultsString", {
        count: metaData?.totalItems,
        query,
      });
    }

    return <h2 className="text-xl weight-500 pts mbs cutoff-text">{message}</h2>;
  };

  const resetState = (): void => {
    setIsLoading(true);
    setTrainings([]);
  };

  if (isError) {
    return <SomethingWentWrongPage client={props.client} />;
  }

  const handleSortChange = (event: ChangeEvent<{ value: unknown }>): void => {
    const newSortOrder = event.target.value as "asc" | "desc" | "price_asc"  | "price_desc" | "EMPLOYMENT_RATE" | "best_match";
    setSorting(newSortOrder);
    logEvent("Search", "Updated sort", newSortOrder);
  };

  const getSortDropdown = (): ReactElement => (
    <>
      {filteredTrainings.length > 0 && (
        <div className="input-wrapper sorting-wrapper">
          <label className="usa-label" htmlFor="per-page">
            {t("SearchAndFilter.sortByLabel")}
          </label>

          <select className="usa-select" name="per-page" id="per-page" onChange={handleSortChange}>
            <option value="best_match">{t("SearchAndFilter.sortByBestMatch")}</option>
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
            <option value="price_asc">{t("SearchAndFilter.sortByCostLowToHigh")}</option>
            <option value="price_desc">{t("SearchAndFilter.sortByCostHighToLow")}</option>
            <option value="EMPLOYMENT_RATE">{t("SearchAndFilter.sortByEmploymentRate")}</option>
          </select>
        </div>
      )}
    </>
  );

  const getPerPage = () => {
    return (
      <>
      {filteredTrainings.length > 0 && (
          <div className="input-wrapper per-page-wrapper">
            <label className="usa-label" htmlFor="per-page">
              Results per page
            </label>

            <select
              className="usa-select"
              name="per-page"
              defaultValue={itemsPerPage}
              id="per-page"
              onChange={(e) => {
                setIsLoading(true);
                setItemsPerPage(
                  e.target.options[e.target.selectedIndex].value as unknown as number,
                );
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set("p", "1");
                newUrl.searchParams.set("limit", e.target.value);
                window.history.pushState({}, "", newUrl.toString());
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        )}
      </>
    );
  };

  const getSearchTips = (): ReactElement => (
    <div className="mbm" data-testid="searchTips">
      <p>{t("SearchResultsPage.searchTips1")}</p>
      <p>Check your spelling to ensure it is correct.</p>
      <p>Verify and adjust any filters that you might have applied to your search.</p>
      <p>{t("SearchResultsPage.searchTips2")}</p>
      <p>{t("SearchResultsPage.searchTips3")}</p>

      <button className="fin fac paz link-format-blue" onClick={toggleIsOpen}>
        {isOpen ? t("SearchResultsPage.seeLessText") : t("SearchResultsPage.seeMoreText")}
        <Icon>{isOpen ? "keyboard_arrow_up" : "keyboard_arrow_right"}</Icon>
      </button>

      {isOpen && (
        <div>
          <p>{t("SearchResultsPage.searchHelperText")}</p>
          <p>
            <span className="bold">{t("SearchResultsPage.boldText1")}&nbsp;</span>
            {t("SearchResultsPage.helperText1")}
          </p>
          <p>
            <span className="bold">{t("SearchResultsPage.boldText2")}&nbsp;</span>
            {t("SearchResultsPage.helperText2")}
          </p>
          <p>
            <span className="bold">{t("SearchResultsPage.boldText3")}&nbsp;</span>
            {t("SearchResultsPage.helperText3")}
          </p>
        </div>
      )}
    </div>
  );

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
      {isTabletAndUp && (
        <div className="container results-count-container">
          <nav className="usa-breadcrumb " aria-label="Breadcrumbs">
            <ol className="usa-breadcrumb__list">
              <li className="usa-breadcrumb__list-item">
                <a className="usa-breadcrumb__link" href="/">
                  Home
                </a>
              </li>
              <li className="usa-breadcrumb__list-item">
                <a className="usa-breadcrumb__link" href="/training">
                  Training Explorer
                </a>
              </li>
              <li className="usa-breadcrumb__list-item use-current" aria-current="page">
                <span data-testid="title">Search</span>
              </li>
            </ol>
          </nav>

          <div className="row fixed-wrapper">
            <div className="col-md-12 fdr fac">
              <div className="result-count-text">{!isLoading && getResultCount()}</div>
              <div className="sorting-controls">
                {shouldShowTrainings && searchQuery !== "null" && (
                  <>
                    {getSortDropdown()}
                    {getPerPage()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isTabletAndBelow && (
        <>
          <div className="container results-count-container">
            <a className="back-link" href="/training">
              <ArrowLeft size={24} />
              Back
            </a>
          </div>
        </>
      )}
      {shouldShowTrainings && searchQuery !== "null" && (
        <>
          <div
            className={`container ${
              comparisonState.comparison.length > 0 ? "space-for-comparison" : "pbm"
            }`}
          >
            <div className="row">
              <div className="col-sm-4">
                <FilterBox
                  searchQuery={searchQuery ? decodeURIComponent(searchQuery) : ""}
                  resultCount={filteredTrainings.length}
                  setShowTrainings={setShouldShowTrainings}
                  resetStateForReload={resetState}
                  fixedContainer={true}
                />
                <div className="sorting-controls">
                  {getSortDropdown()}
                  {getPerPage()}
                </div>
              </div>
              <div className="col-sm-8 space-for-filterbox">
                {isLoading && (
                  <div className="fdr fjc ptl">
                    <CircularProgress color="secondary" />
                  </div>
                )}

                {!isLoading && !isTabletAndUp && getResultCount()}
                {!isLoading && showSearchTips && getSearchTips()}

                {!isLoading &&
                  filteredTrainings.map((training) => (
                    <TrainingResultCard
                      key={training.id}
                      trainingResult={training}
                      comparisonItems={comparisonState.comparison}
                    />
                  ))}
                <Pagination
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  currentPage={pageNumber || 1}
                  totalPages={metaData?.totalPages || 0}
                  hasPreviousPage={metaData?.hasPreviousPage || false}
                  hasNextPage={metaData?.hasNextPage || false}
                  setPageNumber={setPageNumber}
                />
              </div>
            </div>
          </div>
          <TrainingComparison comparisonItems={comparisonState.comparison} />
        </>
      )}
      {(!shouldShowTrainings || searchQuery === "null") && (
        <div className="container" data-testid="gettingStarted">
          <div className="row">
            {isTabletAndUp && (
              <div className="col-sm-4">
                {
                  <FilterBox
                    searchQuery={searchQuery ? decodeURIComponent(searchQuery) : ""}
                    resultCount={filteredTrainings.length}
                    setShowTrainings={setShouldShowTrainings}
                    resetStateForReload={resetState}
                    fixedContainer={true}
                  >
                    {getSortDropdown()}
                  </FilterBox>
                }
              </div>
            )}
            <div className={`col-sm-7 ${!isTabletAndUp ? "ptm" : ""}`}>
              {isTabletAndUp && (
                <h3 className="text-l mts">{t("SearchResultsPage.sectionOneHeader")}</h3>
              )}
              {isTabletAndUp && (
                <>
                  <p className="mbl">
                    {t("SearchResultsPage.introText")}
                    &nbsp;
                    <Link className="link-format-blue" to="/support-resources/tuition-assistance">
                      {t("SearchResultsPage.introTextLink")}
                    </Link>
                    .
                  </p>
                  <h3 className="text-l">{t("SearchResultsPage.searchHelperHeader")}</h3>
                  <p>{t("SearchResultsPage.searchHelperText")}</p>
                  <p>
                    <span className="bold">{t("SearchResultsPage.boldText1")}&nbsp;</span>
                    {t("SearchResultsPage.helperText1")}
                  </p>
                  <p>
                    <span className="bold">{t("SearchResultsPage.boldText2")}&nbsp;</span>
                    {t("SearchResultsPage.helperText2")}
                  </p>
                  <p>
                    <span className="bold">{t("SearchResultsPage.boldText3")}&nbsp;</span>
                    {t("SearchResultsPage.helperText3")}
                  </p>
                </>
              )}
              {!isTabletAndUp && (
                <div className="mtl mbd">
                  <h3 className="text-l">{t("SearchResultsPage.smallScreenSearchHeader")}</h3>
                  <FilterBox
                    searchQuery={searchQuery ? decodeURIComponent(searchQuery) : ""}
                    resultCount={filteredTrainings.length}
                    setShowTrainings={setShouldShowTrainings}
                    resetStateForReload={resetState}
                  >
                    {getSortDropdown()}
                  </FilterBox>
                </div>
              )}
              {!isTabletAndUp && (
                <>
                  <h3 className="text-l mts">
                    {t("SearchResultsPage.sectionOneHeaderSmallScreen")}
                  </h3>
                  <p className="mbl">
                    {t("SearchResultsPage.introText")}
                    &nbsp;
                    <Link className="link-format-blue" to="/support-resources/tuition-assistance">
                      {t("SearchResultsPage.introTextLink")}
                    </Link>
                    .
                  </p>
                  <h3 className="text-l">{t("SearchResultsPage.searchHelperHeader")}</h3>
                  <p>{t("SearchResultsPage.searchHelperText")}</p>
                  <p>
                    <span className="bold">{t("SearchResultsPage.boldText1")}&nbsp;</span>
                    {t("SearchResultsPage.helperText1")}
                  </p>
                  <p>
                    <span className="bold">{t("SearchResultsPage.boldText2")}&nbsp;</span>
                    {t("SearchResultsPage.helperText2")}
                  </p>
                  <p>
                    <span className="bold">{t("SearchResultsPage.boldText3")}&nbsp;</span>
                    {t("SearchResultsPage.helperText3")}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
