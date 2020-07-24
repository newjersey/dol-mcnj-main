import React, { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Training } from "../domain/Training";
import { Header } from "../search-results/Header";
import { CalendarLengthLookup } from "../localizations/CalendarLengthLookup";
import { NotFoundPage } from "../not-found-page/NotFoundPage";
import { InlineIcon } from "../components/InlineIcon";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const TrainingPage = (props: Props): ReactElement => {
  const [training, setTraining] = useState<Training | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const idToFetch = props.id ? props.id : "";
    props.client.getTrainingById(idToFetch, {
      onSuccess: setTraining,
      onError: () => setError(true),
    });
  }, [props.id, props.client]);

  const getHttpUrl = (url: string): string => {
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      return "http://" + url;
    }

    return url;
  };

  const getProviderUrl = (): ReactElement => {
    if (!training?.provider?.url) {
      return <>--</>;
    }

    return (
      <a target="_blank" rel="noopener noreferrer" href={getHttpUrl(training.provider.url)}>
        {training.provider.url}
      </a>
    );
  };

  const getCareerTrackList = (): string => {
    if (!training || training.occupations.length === 0) {
      return "--";
    }

    return training.occupations.join(", ");
  };

  const getProviderAddress = (): ReactElement => {
    if (!training || !training.provider.address.city) {
      return <>--</>;
    }

    const address = training.provider.address;

    return (
      <div className="inline">
        <span>{address.street1}</span>
        <div>{address.street2}</div>
        <div>
          {address.city}, {address.state} {address.zipCode}
        </div>
      </div>
    );
  };

  if (training) {
    return (
      <>
        <Header />
        <div className="container below-header">
          <h2 className="text-xl ptm pbs weight-500">{training.name}</h2>
          <div className="row">
            <div className="col-md-8">
              <div className="mvm grouping">
                <div className="bg-light-green pvs bar">
                  <h2 className="text-m weight-500">Description</h2>
                </div>
                <p className="pts group-padding">{training.description}</p>
              </div>

              <div className="mvm grouping">
                <div className="bg-light-green pvs bar">
                  <h2 className="text-m weight-500">Quick Stats</h2>
                </div>
                <div className="pts group-padding">
                  <p>
                    <span className="fin">
                      <InlineIcon className="mrxs">work_outline</InlineIcon>
                      Career Track: {getCareerTrackList()}
                    </span>
                  </p>
                  <p>
                    <span className="fin">
                      <InlineIcon className="mrxs">av_timer</InlineIcon>
                      {CalendarLengthLookup[training.calendarLength]}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mvm grouping">
                <div className="bg-light-green pvs bar">
                  <h2 className="text-m weight-500">Provider Details</h2>
                </div>
                <div className="pts group-padding">
                  <div className="mvd">
                    <span className="fin">
                      <InlineIcon className="mrxs">location_on</InlineIcon>
                      {getProviderAddress()}
                    </span>
                  </div>
                  <p>
                    <span className="fin">
                      <InlineIcon className="mrxs">link</InlineIcon>
                      {getProviderUrl()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (error) {
    return <NotFoundPage />;
  } else {
    return <></>;
  }
};
