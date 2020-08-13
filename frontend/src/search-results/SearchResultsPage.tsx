import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { Client } from "../domain/Client";
import { TrainingResult } from "../domain/Training";
import { RouteComponentProps } from "@reach/router";
import { Header } from "./Header";
import { TrainingResultCard } from "./TrainingResultCard";
import { CircularProgress, FormControl, InputLabel, useMediaQuery } from "@material-ui/core";
import { FilterContext } from "../App";
import { FilterBox } from "../filtering/FilterBox";
import { BetaBanner } from "../components/BetaBanner";
import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";
import { WhiteSelect } from "../components/WhiteSelect";

interface Props extends RouteComponentProps {
  client: Client;
  searchQuery?: string;
}

export enum SortOrder {
  RELEVANCE = "RELEVANCE",
  PRICE_LOW_TO_HIGH = "PRICE_LOW_TO_HIGH",
  PRICE_HIGH_TO_LOW = "PRICE_HIGH_TO_LOW",
}

export const SearchResultsPage = (props: Props): ReactElement<Props> => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");

  const [trainings, setTrainings] = useState<TrainingResult[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingResult[]>([]);
  const [shouldShowTrainings, setShouldShowTrainings] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.RELEVANCE);

  const { state } = useContext(FilterContext);

  useEffect(() => {
    let newFilteredTrainings = trainings;
    state.filters.forEach((filter) => {
      newFilteredTrainings = filter.func(newFilteredTrainings);
    });
    setFilteredTrainings(newFilteredTrainings);
  }, [trainings, state.filters]);

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

  const setToReloadState = (): void => {
    setIsLoading(true);
    setTrainings([]);
  };

  if (isError) {
    return <SomethingWentWrongPage />;
  }

  const handleSortChange = (event: ChangeEvent<{ value: unknown }>): void => {
    const newSortOrder = event.target.value as SortOrder;
    setSortOrder(newSortOrder);

    const sortedResults = filteredTrainings.sort((a: TrainingResult, b: TrainingResult) => {
      switch (newSortOrder) {
        case SortOrder.RELEVANCE:
          return b.rank - a.rank;
        case SortOrder.PRICE_LOW_TO_HIGH:
          return a.totalCost - b.totalCost;
        case SortOrder.PRICE_HIGH_TO_LOW:
          return b.totalCost - a.totalCost;
        default:
          return 0;
      }
    });

    setFilteredTrainings(sortedResults);
  };

  const getSortDropdown = (): ReactElement => (
    <FormControl variant="outlined" className="mla">
      <InputLabel htmlFor="sortby">Sort by</InputLabel>
      <WhiteSelect
        native={true}
        value={sortOrder}
        onChange={handleSortChange}
        label="Sort by"
        id="sortby"
      >
        <option value={SortOrder.RELEVANCE}>Relevance</option>
        <option value={SortOrder.PRICE_LOW_TO_HIGH}>Price: Low to High</option>
        <option value={SortOrder.PRICE_HIGH_TO_LOW}>Price: High to Low</option>
      </WhiteSelect>
    </FormControl>
  );

  return (
    <>
      <Header />
      <BetaBanner />

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

        <div className="container search-container">
          <div className="row">
            <div className="col-sm-4">
              <FilterBox
                searchQuery={props.searchQuery ? decodeURIComponent(props.searchQuery) : undefined}
                resultCount={filteredTrainings.length}
                setShowTrainings={setShouldShowTrainings}
                setToReloadState={setToReloadState}
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
