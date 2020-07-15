import React, { ReactElement, useEffect, useState } from "react";
import { Client } from "../domain/Client";
import { TrainingResult } from "../domain/Training";
import { Searchbar } from "../components/Searchbar";
import { navigate, RouteComponentProps } from "@reach/router";
import { Header } from "./Header";
import { TrainingResultCard } from "./TrainingResultCard";
import { useMediaQuery } from "@material-ui/core";

interface Props extends RouteComponentProps {
  client: Client;
  searchQuery?: string;
}

export const SearchResultsPage = (props: Props): ReactElement<Props> => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");

  const [trainings, setTrainings] = useState<TrainingResult[]>([]);

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
    if (trainings.length === 1) {
      message = `${trainings.length} result found for "${query}"`;
    } else {
      message = `${trainings.length} results found for "${query}"`;
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
            <div className="bg-light-green pam searchbox">
              <Searchbar
                onSearch={(searchQuery: string): Promise<void> =>
                  navigate(`/search/${searchQuery}`)
                }
                initialValue={props.searchQuery}
                stacked={true}
              />
            </div>
          </div>
          <div className="col-sm-8 space-for-searchbox">
            {!isTabletAndUp && getResultCount()}
            {trainings.map((training) => (
              <TrainingResultCard key={training.id} trainingResult={training} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
