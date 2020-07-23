import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Client } from "../domain/Client";
import { TrainingResult } from "../domain/Training";
import { RouteComponentProps } from "@reach/router";
import { Header } from "./Header";
import { TrainingResultCard } from "./TrainingResultCard";
import { useMediaQuery } from "@material-ui/core";
import { FilterContext } from "../App";
import { FilterBox } from "../filtering/FilterBox";

interface Props extends RouteComponentProps {
  client: Client;
  searchQuery?: string;
}

export const SearchResultsPage = (props: Props): ReactElement<Props> => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");

  const [trainings, setTrainings] = useState<TrainingResult[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingResult[]>([]);

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
      onSuccess: setTrainings,
      onError: () => {},
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

  return (
    <>
      <Header />

      {isTabletAndUp && (
        <div className="container results-count-container">
          <div className="row">
            <div className="col-md-12">
              <div className="ptd fixed-wrapper">{getResultCount()}</div>
            </div>
          </div>
        </div>
      )}

      <div className="container search-container">
        <div className="row">
          <div className="col-sm-4">
            <FilterBox searchQuery={props.searchQuery} />
          </div>
          <div className="col-sm-8 space-for-filterbox">
            {!isTabletAndUp && getResultCount()}
            {filteredTrainings.map((training) => (
              <TrainingResultCard key={training.id} trainingResult={training} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
