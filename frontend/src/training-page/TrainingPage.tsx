import React, { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Training } from "../domain/Training";
import { Header } from "../search-results/Header";
import { CalendarLengthLookup } from "../localizations/CalendarLengthLookup";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const TrainingPage = (props: Props): ReactElement => {
  const [training, setTraining] = useState<Training | undefined>(undefined);

  useEffect(() => {
    const idToFetch = props.id ? props.id : "";
    props.client.getTrainingById(idToFetch, {
      onSuccess: setTraining,
      onError: () => {},
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
      return <div>--</div>;
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

  return training ? (
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
              <div className="ptm group-padding">{training.description}</div>
            </div>

            <div className="mvm grouping">
              <div className="bg-light-green pvs bar">
                <h2 className="text-m weight-500">Quick Stats</h2>
              </div>
              <div className="ptm group-padding">
                <div className="mbd">
                  <i className="material-icons mrxs">work_outline</i>
                  Career Track: {getCareerTrackList()}
                </div>

                <div>
                  <i className="material-icons mrxs">av_timer</i>
                  {CalendarLengthLookup[training.calendarLength]}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mvm grouping">
              <div className="bg-light-green pvs bar">
                <h2 className="text-m weight-500">Provider Details</h2>
              </div>
              <div className="ptm group-padding">
                <div className="mbd">
                  <i className="material-icons mrxs align-top">location_on</i>
                  {getProviderAddress()}
                </div>

                <div>
                  <i className="material-icons mrxs">link</i>
                  {getProviderUrl()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};
