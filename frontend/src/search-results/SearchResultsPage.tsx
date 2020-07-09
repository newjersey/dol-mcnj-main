import React, { ReactElement, useEffect, useState } from "react";
import { Client } from "../domain/Client";
import { Training } from "../domain/Training";
import { Searchbar } from "../components/Searchbar";
import { navigate, RouteComponentProps } from "@reach/router";
import { Header } from "./Header";
import { TrainingCard } from "./TrainingCard";
import { useMediaQuery } from "@material-ui/core";

interface Props extends RouteComponentProps {
  client: Client;
  searchQuery?: string;
}

export const SearchResultsPage = (props: Props): ReactElement<Props> => {
  const isMediumOrLarge = useMediaQuery("(min-width:992px)");
  const isMobile = useMediaQuery("(max-width:768px)");
  const shouldStackSearchButton = isMobile || isMediumOrLarge;

  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
    const queryToSearch = props.searchQuery ? props.searchQuery : "";
    props.client.getTrainingsByQuery(queryToSearch, {
      onSuccess: setTrainings,
      onError: () => {},
    });
  }, [props.searchQuery, props.client]);

  const getResultCount = (): ReactElement => {
    let message;
    if (trainings.length === 1) {
      message = `${trainings.length} result found for "${props.searchQuery}"`;
    } else {
      message = `${trainings.length} results found for "${props.searchQuery}"`;
    }

    return <h2 className="text-xl weight-500 pvs">{message}</h2>;
  };

  return (
    <>
      <Header />

      {isMediumOrLarge && (
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
          <div className="col-md-4">
            <div className="bg-light-green sidebar pam">
              <div className="search-wrapper">
                <Searchbar
                  onSearch={(searchQuery: string): Promise<void> =>
                    navigate(`/search/${searchQuery}`)
                  }
                  initialValue={props.searchQuery}
                  stacked={shouldStackSearchButton}
                />
              </div>
            </div>
          </div>
          <div className="col-md-8 col-md-offset-4 offset-col">
            {!isMediumOrLarge && getResultCount()}
            {trainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
