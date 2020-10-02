import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { Client } from "../domain/Client";
import { TrainingResult } from "../domain/Training";
import { RouteComponentProps } from "@reach/router";
import { Header } from "./Header";
import { TrainingResultCard } from "./TrainingResultCard";
import { CircularProgress, FormControl, InputLabel, useMediaQuery } from "@material-ui/core";
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
  const [shouldShowTrainings, setShouldShowTrainings] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const filterState = useContext(FilterContext).state;

  const sortContextValue = useContext(SortContext);
  const sortState = sortContextValue.state;
  const sortDispatch = sortContextValue.dispatch;

  useEffect(() => {
    document.title = `${props.searchQuery} - Search Results`;
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
  }, [trainings, filterState.filters, sortState.sortOrder]);

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

  const getResultCount = (): ReactElement => {
    let message;
    const query = props.searchQuery ? decodeURIComponent(props.searchQuery) : "";
    if (filteredTrainings.length === 1) {
      message = `${filteredTrainings.length} result found for "${query}"`;
    } else {
      message = `${filteredTrainings.length} results found for "${query}"`;
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
  );

  return (
    <>
      {isTabletAndUp && (
        <>
          <Header />
          <BetaBanner />
        </>
      )}

      <main role="main">
        {isTabletAndUp && (
          <div className="container results-count-container">
            <div className="row ptd fixed-wrapper">
              <div className="col-md-12 fdr fac">
                <div className="result-count-text">{!isLoading && getResultCount()}</div>
                <div className="mla">{getSortDropdown()}</div>
              </div>
            </div>
          </div>
        )}

        <div className="container">
          <div className="row">
            <div className="col-sm-4">
              <FilterBox
                searchQuery={props.searchQuery ? decodeURIComponent(props.searchQuery) : undefined}
                resultCount={filteredTrainings.length}
                setShowTrainings={setShouldShowTrainings}
                resetStateForReload={resetState}
                client={props.client}
              >
                {getSortDropdown()}
              </FilterBox>
            </div>
            {shouldShowTrainings && (
              <div className="col-sm-8 space-for-filterbox">
                {isLoading && (
                  <div className="fdr fjc ptl">
                    <CircularProgress color="secondary" />
                  </div>
                )}

                {!isLoading && !isTabletAndUp && getResultCount()}

                {filteredTrainings.map((training) => (
                  <TrainingResultCard key={training.id} trainingResult={training} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
