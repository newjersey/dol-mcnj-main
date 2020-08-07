import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Client } from "../domain/Client";
import { TrainingResult } from "../domain/Training";
import { RouteComponentProps } from "@reach/router";
import { Header } from "./Header";
import { TrainingResultCard } from "./TrainingResultCard";
import { CircularProgress, useMediaQuery } from "@material-ui/core";
import { FilterContext } from "../App";
import { FilterBox } from "../filtering/FilterBox";
import { BetaBanner } from "../components/BetaBanner";
import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";

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
    const query = props.searchQuery ? props.searchQuery : "";
    if (filteredTrainings.length === 1) {
      message = `${filteredTrainings.length} result found for "${query}"`;
    } else {
      message = `${filteredTrainings.length} results found for "${query}"`;
    }

    return <h2 className="text-xl weight-500 pvs">{message}</h2>;
  };

  const setToReloadState = (): void => {
    setIsLoading(true);
    setTrainings([]);
  };

  if (isError) {
    return <SomethingWentWrongPage />;
  }

  return (
    <>
      <Header />
      <BetaBanner />

      <main role="main">
        {isTabletAndUp && (
          <div className="container results-count-container">
            <div className="row">
              <div className="col-md-12">
                <div className="ptd fixed-wrapper">{!isLoading && getResultCount()}</div>
              </div>
            </div>
          </div>
        )}

        <div className="container search-container">
          <div className="row">
            <div className="col-sm-4">
              <FilterBox
                searchQuery={props.searchQuery}
                resultCount={filteredTrainings.length}
                setShowTrainings={setShouldShowTrainings}
                setToReloadState={setToReloadState}
              />
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
