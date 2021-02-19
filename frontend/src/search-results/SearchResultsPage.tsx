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

  const sortContextValue = useContext(SortContext);
  const sortState = sortContextValue.state;
  const sortDispatch = sortContextValue.dispatch;

  useEffect(() => {
    document.title = props.searchQuery
      ? `${props.searchQuery} - Search Results`
      : "Search for Training";
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
      message = "Getting Started - Search For Training";
    } else {
      const query = decodeURIComponent(props.searchQuery);

      if (filteredTrainings.length === 1) {
        message = `${filteredTrainings.length} result found for "${query}"`;
      } else {
        message = `${filteredTrainings.length} results found for "${query}"`;
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
          <InputLabel htmlFor="sortby">Sort by</InputLabel>
          <WhiteSelect
            native={true}
            value={sortState.sortOrder}
            onChange={handleSortChange}
            label="Sort by"
            id="sortby"
          >
            <option value={SortOrder.BEST_MATCH}>Best Match</option>
            <option value={SortOrder.COST_LOW_TO_HIGH}>Cost: Low to High</option>
            <option value={SortOrder.COST_HIGH_TO_LOW}>Cost: High to Low</option>
            <option value={SortOrder.EMPLOYMENT_RATE}>Employment Rate</option>
          </WhiteSelect>
        </FormControl>
      )}
    </>
  );

  const getSearchTips = (): ReactElement => (
    <div className="mbm" data-testid="searchTips">
      <p>
        Are you not seeing the results you were looking for? We recommend that you try these search
        tips to enhance your results:
      </p>
      <p>
        Are your search results too small? Your search may be too specific. Try searching with less
        words.
      </p>
      <p>
        Are your search results too long? Your search results may be too broad, so try using more
        terms that describe what you are searching for.
      </p>
      <button className="fin fac paz link-format-blue" onClick={toggleIsOpen}>
        {isOpen ? "See less" : "See more examples"}
        <Icon>{isOpen ? "keyboard_arrow_up" : "keyboard_arrow_right"}</Icon>
      </button>

      {isOpen && (
        <div>
          <p>Here are some examples that may improve your search results:</p>
          <p>
            <span className="bold">Training Providers: </span>
            If you're searching for a training provider, try using only the provider's name and
            exclude words like "university" or "college".
          </p>
          <p>
            <span className="bold">Occupations: </span>
            If you're looking for training for a job, you can type the job title directly into the
            search box.
          </p>
          <p>
            <span className="bold">License: </span>
            If you know the name of the license you're training for, use the acronym to see more
            results. For example, for the commercial driving license, you can search for CDL.
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
          <div className="container pbm">
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
                  <TrainingResultCard key={training.id} trainingResult={training} />
                ))}
              </div>
            </div>
          </div>
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
                {!isTabletAndUp && <h3 className="text-l mts">Getting Started</h3>}
                {isTabletAndUp && <h3 className="text-l mts">What is the Training Explorer?</h3>}

                <p className="mbl">
                  The Training Explorer is a comprehensive listing of all schools and organizations
                  offering education and job training that may be eligible to receive&nbsp;
                  <Link className="link-format-blue" to="/funding">
                    funding assistance
                  </Link>
                  .
                </p>
                <h3 className="text-l">What Can I Search for?</h3>
                <p>Here are some examples that may improve your search results:</p>
                <p>
                  <span className="bold">Training Providers: </span>
                  If you're searching for a training provider, try using only the provider's name
                  and exclude words like "university" or "college".
                </p>
                <p>
                  <span className="bold">Occupations: </span>
                  If you're looking for training for a job, you can type the job directly into the
                  search box.
                </p>
                <p>
                  <span className="bold">License: </span>
                  If you know the name of the license you're training for, use the acronym to see
                  more results. For example, for the commercial driving license, try searching for
                  "CDL".
                </p>
                {!isTabletAndUp && (
                  <div className="mtl mbd">
                    <h3 className="text-l">Search for Training</h3>
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
