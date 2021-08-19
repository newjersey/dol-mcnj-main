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
import { SearchResultsPageStrings } from "../localizations/SearchResultsPageStrings";
import { SearchAndFilterStrings } from "../localizations/SearchAndFilterStrings";

interface Props extends RouteComponentProps {
  client: Client;
  searchQuery?: string;
}

export const SearchResultsPage = (props: Props): ReactElement<Props> => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");

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
      ? SearchResultsPageStrings.pageTitle.replace("{query}", props.searchQuery)
      : SearchResultsPageStrings.noSearchTermPageTitle;
  }, [props.searchQuery]);

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
      message = SearchResultsPageStrings.noSearchTermHeader;
    } else {
      const query = decodeURIComponent(props.searchQuery);

      if (filteredTrainings.length === 1) {
        message = SearchResultsPageStrings.singularResultsString
          .replace("{count}", filteredTrainings.length.toString())
          .replace("{query}", query);
      } else {
        message = SearchResultsPageStrings.pluralResultsString
          .replace("{count}", filteredTrainings.length.toString())
          .replace("{query}", query);
      }
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
  };

  const getSortDropdown = (): ReactElement => (
    <>
      {filteredTrainings.length > 0 && (
        <FormControl variant="outlined" className="mla width-100">
          <InputLabel htmlFor="sortby">{SearchAndFilterStrings.sortByLabel}</InputLabel>
          <WhiteSelect
            native={true}
            value={sortState.sortOrder}
            onChange={handleSortChange}
            label={SearchAndFilterStrings.sortByLabel}
            id="sortby"
          >
            <option value={SortOrder.BEST_MATCH}>{SearchAndFilterStrings.sortByBestMatch}</option>
            <option value={SortOrder.COST_LOW_TO_HIGH}>
              {SearchAndFilterStrings.sortByCostLowToHigh}
            </option>
            <option value={SortOrder.COST_HIGH_TO_LOW}>
              {SearchAndFilterStrings.sortByCostHighToLow}
            </option>
            <option value={SortOrder.EMPLOYMENT_RATE}>
              {SearchAndFilterStrings.sortByEmploymentRate}
            </option>
          </WhiteSelect>
        </FormControl>
      )}
    </>
  );

  const getSearchTips = (): ReactElement => (
    <div className="mbm" data-testid="searchTips">
      <p>{SearchResultsPageStrings.searchTips1}</p>
      <p>{SearchResultsPageStrings.searchTips2}</p>
      <p>{SearchResultsPageStrings.searchTips3}</p>
      <button className="fin fac paz link-format-blue" onClick={toggleIsOpen}>
        {isOpen ? SearchResultsPageStrings.seeLessText : SearchResultsPageStrings.seeMoreText}
        <Icon>{isOpen ? "keyboard_arrow_up" : "keyboard_arrow_right"}</Icon>
      </button>

      {isOpen && (
        <div>
          <p>{SearchResultsPageStrings.searchHelperText}</p>
          <p>
            <span className="bold">{SearchResultsPageStrings.boldText1}&nbsp;</span>
            {SearchResultsPageStrings.helperText1}
          </p>
          <p>
            <span className="bold">{SearchResultsPageStrings.boldText2}&nbsp;</span>
            {SearchResultsPageStrings.helperText2}
          </p>
          <p>
            <span className="bold">{SearchResultsPageStrings.boldText3}&nbsp;</span>
            {SearchResultsPageStrings.helperText3}
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
                      client={props.client}
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
                      client={props.client}
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
                    {SearchResultsPageStrings.sectionOneHeaderSmallScreen}
                  </h3>
                )}
                {isTabletAndUp && (
                  <h3 className="text-l mts">{SearchResultsPageStrings.sectionOneHeader}</h3>
                )}

                <p className="mbl">
                  {SearchResultsPageStrings.introText}
                  &nbsp;
                  <Link className="link-format-blue" to="/funding">
                    {SearchResultsPageStrings.introTextLink}
                  </Link>
                  .
                </p>
                <h3 className="text-l">{SearchResultsPageStrings.searchHelperHeader}</h3>
                <p>{SearchResultsPageStrings.searchHelperText}</p>
                <p>
                  <span className="bold">{SearchResultsPageStrings.boldText1}&nbsp;</span>
                  {SearchResultsPageStrings.helperText1}
                </p>
                <p>
                  <span className="bold">{SearchResultsPageStrings.boldText2}&nbsp;</span>
                  {SearchResultsPageStrings.helperText2}
                </p>
                <p>
                  <span className="bold">{SearchResultsPageStrings.boldText3}&nbsp;</span>
                  {SearchResultsPageStrings.helperText3}
                </p>
                {!isTabletAndUp && (
                  <div className="mtl mbd">
                    <h3 className="text-l">{SearchResultsPageStrings.smallScreenSearchHeader}</h3>
                    <FilterBox
                      searchQuery={props.searchQuery ? decodeURIComponent(props.searchQuery) : ""}
                      resultCount={filteredTrainings.length}
                      setShowTrainings={setShouldShowTrainings}
                      resetStateForReload={resetState}
                      client={props.client}
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
