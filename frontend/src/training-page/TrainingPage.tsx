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

  return training ? (
    <>
      <Header />
      <div className="container below-header">
        <h2 className="text-xl ptm pbs weight-500">{training.name}</h2>
        <div className="row">
          <div className="col-md-8">
            <div className="card pam">
              <i className="material-icons mrxs">link</i>
              {getProviderUrl()}

              <p className="mtxs mbz">
                <i className="material-icons mrxs">av_timer</i>
                {CalendarLengthLookup[training.calendarLength]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};
