import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { Client } from "../domain/Client";
import { TrainingResult } from "../domain/Training";
import { RouteComponentProps, Link } from "@reach/router";
import { Header } from "../components/Header";
import { TrainingResultCard } from "./TrainingResultCard";
import { CircularProgress, FormControl, InputLabel, useMediaQuery, Icon } from "@material-ui/core";
import { FilterBox } from "../filtering/FilterBox";
import { BetaBanner } from "../components/BetaBanner";
import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";
import { WhiteSelect } from "../components/WhiteSelect";
import { SortOrder } from "../sorting/SortOrder";
import { SortContext } from "../sorting/SortContext";
import { FilterContext } from "../filtering/FilterContext";
import { TrainingComparison } from "./TrainingComparison";
import { ComparisonContext } from "../comparison/ComparisonContext";
import { useTranslation } from "react-i18next";
import { logEvent } from "../analytics";

interface Props extends RouteComponentProps {
  client: Client;
  searchQuery?: string;
}

export const SearchResultsPage = (props: Props): ReactElement<Props> => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const { t } = useTranslation();

  const [trainings, setTrainings] = useState<TrainingResult[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingResult[]>([]);
  const [shouldShowTrainings, setShouldShowTrainings] = useState<boolean>(false);
  const [showSearchTips, setShowSearchTips] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const filterState = useContext(FilterContext).state;
  const comparisonState = useContext(ComparisonContext).state;
  const sortContextValue = useContext(SortContext);
  const sortState = sortContextValue.state;
  const sortDispatch = sortContextValue.dispatch;

  useEffect(() => {
    document.title = props.searchQuery
      ? t("SearchResultsPage.pageTitle", { query: props.searchQuery })
      : t("SearchResultsPage.noSearchTermPageTitle");
  }, [props.searchQuery, t]);

  useEffect(() => {
    let newFilteredTrainings = trainings;

    filterState.filters.forEach((filter) => {
      newFilteredTrainings = filter.func(newFilteredTrainings);
    });

    const sortedResults = newFilteredTrainings.sort((a: TrainingResult, b: TrainingResult) => {
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

    setFilteredTrainings([...sortedResults]);
    setShowSearchTips(newFilteredTrainings.length < 5);

    if (newFilteredTrainings.length > 0) {
      setShouldShowTrainings(true);
    }
  }, [trainings, filterState.filters, sortState.sortOrder, showSearchTips, props.searchQuery]);

  useEffect(() => {
    const queryToSearch = props.searchQuery ? props.searchQuery : "";

    props.client.getTrainingsByQuery(queryToSearch, {
      onSuccess: (data: TrainingResult[]) => {
        setTrainings(data);
        setIsLoading(false);
      },
      onError: () => {
        setIsError(true);
      },
    });
  }, [props.searchQuery, props.client]);

  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };

  const getResultCount = (): ReactElement => {
    let message;

    if (!props.searchQuery) {
      message = t("SearchResultsPage.noSearchTermHeader");
    } else {
      const query = decodeURIComponent(props.searchQuery);
      message = t("SearchResultsPage.resultsString", {
        count: filteredTrainings.length,
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
    return <SomethingWentWrongPage />;
  }

  const handleSortChange = (event: ChangeEvent<{ value: unknown }>): void => {
    const newSortOrder = event.target.value as SortOrder;
    sortDispatch(newSortOrder);
    logEvent("Search", "Updated sort", newSortOrder);
  };

  const getSortDropdown = (): ReactElement => (
    <>
      {filteredTrainings.length > 0 && (
        <FormControl variant="outlined" className="mla width-100">
          <InputLabel htmlFor="sortby">{t("SearchAndFilter.sortByLabel")}</InputLabel>
          <WhiteSelect
            native={true}
            value={sortState.sortOrder}
            onChange={handleSortChange}
            label={t("SearchAndFilter.sortByLabel")}
            id="sortby"
          >
            <option value={SortOrder.BEST_MATCH}>{t("SearchAndFilter.sortByBestMatch")}</option>
            <option value={SortOrder.COST_LOW_TO_HIGH}>
              {t("SearchAndFilter.sortByCostLowToHigh")}
            </option>
            <option value={SortOrder.COST_HIGH_TO_LOW}>
              {t("SearchAndFilter.sortByCostHighToLow")}
            </option>
            <option value={SortOrder.EMPLOYMENT_RATE}>
              {t("SearchAndFilter.sortByEmploymentRate")}
            </option>
          </WhiteSelect>
        </FormControl>
      )}
    </>
  );

  const getSearchTips = (): ReactElement => (
    <div className="mbm" data-testid="searchTips">
      <p>{t("SearchResultsPage.searchTips1")}</p>
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
    <>
      <Header />
      <BetaBanner />

      <main className="below-banners no-footer" role="main">
        {isTabletAndUp && (
          <div className="container results-count-container">
            <div className="row ptd fixed-wrapper">
              <div className="col-md-12 fdr fac">
                <div className="result-count-text">{!isLoading && getResultCount()}</div>
                {shouldShowTrainings && <div className="mla">{getSortDropdown()}</div>}
              </div>
            </div>
          </div>
        )}

        {shouldShowTrainings && (
          <>
            <div
              className={`container ${
                comparisonState.comparison.length > 0 ? "space-for-comparison" : "pbm"
              }`}
            >
              <div className="row">
                <div className="col-sm-4">
                  {
                    <FilterBox
                      searchQuery={props.searchQuery ? decodeURIComponent(props.searchQuery) : ""}
                      resultCount={filteredTrainings.length}
                      setShowTrainings={setShouldShowTrainings}
                      resetStateForReload={resetState}
                      fixedContainer={true}
                    >
                      {getSortDropdown()}
                    </FilterBox>
                  }
                </div>
                <div className="col-sm-8 space-for-filterbox">
                  {isLoading && (
                    <div className="fdr fjc ptl">
                      <CircularProgress color="secondary" />
                    </div>
                  )}

                  {!isLoading && !isTabletAndUp && getResultCount()}
                  {!isLoading && showSearchTips && getSearchTips()}

                  {filteredTrainings.map((training) => (
                    <TrainingResultCard
                      key={training.id}
                      trainingResult={training}
                      comparisonItems={comparisonState.comparison}
                    />
                  ))}
                </div>
              </div>
            </div>
            <TrainingComparison comparisonItems={comparisonState.comparison} />
          </>
        )}

        {!shouldShowTrainings && (
          <div className="container" data-testid="gettingStarted">
            <div className="row">
              {isTabletAndUp && (
                <div className="col-sm-4">
                  {
                    <FilterBox
                      searchQuery={props.searchQuery ? decodeURIComponent(props.searchQuery) : ""}
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
                {!isTabletAndUp && (
                  <h3 className="text-l mts">
                    {t("SearchResultsPage.sectionOneHeaderSmallScreen")}
                  </h3>
                )}
                {isTabletAndUp && (
                  <h3 className="text-l mts">{t("SearchResultsPage.sectionOneHeader")}</h3>
                )}

                <p className="mbl">
                  {t("SearchResultsPage.introText")}
                  &nbsp;
                  <Link className="link-format-blue" to="/funding">
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
                {!isTabletAndUp && (
                  <div className="mtl mbd">
                    <h3 className="text-l">{t("SearchResultsPage.smallScreenSearchHeader")}</h3>
                    <FilterBox
                      searchQuery={props.searchQuery ? decodeURIComponent(props.searchQuery) : ""}
                      resultCount={filteredTrainings.length}
                      setShowTrainings={setShouldShowTrainings}
                      resetStateForReload={resetState}
                    >
                      {getSortDropdown()}
                    </FilterBox>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
