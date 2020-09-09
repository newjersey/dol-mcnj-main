import React, { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { OccupationDetail } from "../domain/Occupation";
import { Header } from "../search-results/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Grouping } from "../components/Grouping";
import { InlineIcon } from "../components/InlineIcon";

interface Props extends RouteComponentProps {
  soc?: string;
  client: Client;
}

export const OccupationPage = (props: Props): ReactElement => {
  const [occupationDetail, setOccupationDetail] = useState<OccupationDetail | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const socCode = props.soc ? props.soc : "";

    props.client.getOccupationDetailBySoc(socCode, {
      onSuccess: (result: OccupationDetail) => {
        setOccupationDetail(result);
      },
      onError: () => {},
    });
  }, [props.soc, props.client]);

  const seeMore = (tasks: string[]): ReactElement => {
    if (tasks.length > 5 && !isOpen) {
      return (
        <button className="weight-500 blue fin" onClick={(): void => setIsOpen(true)}>
          See More
          <InlineIcon>keyboard_arrow_down</InlineIcon>
        </button>
      );
    } else if (tasks.length > 5 && isOpen) {
      return (
        <button className="weight-500 blue fin" onClick={(): void => setIsOpen(false)}>
          See Less
          <InlineIcon>keyboard_arrow_up</InlineIcon>
        </button>
      );
    } else {
      return <></>;
    }
  };

  const getTasksList = (tasks: string[]): ReactElement => {
    let tasksToShow = tasks;
    if (tasks.length > 5 && !isOpen) {
      tasksToShow = tasks.slice(0, 5);
    }

    if (tasks.length === 0) {
      return <p>This data is not yet available for this occupation.</p>;
    } else {
      return (
        <ul>
          {tasksToShow.map((task, key) => (
            <li key={key}>{task}</li>
          ))}
        </ul>
      );
    }
  };

  if (occupationDetail) {
    return (
      <>
        <Header />
        <BetaBanner />
        <main className="container below-banners" role="main">
          <div className="ptm weight-500 fin all-caps border-bottom-dark">Occupation</div>
          <h2 className="text-xl ptd pbs weight-500">{occupationDetail.title}</h2>

          <div className="row">
            <div className="col-md-8">
              <div className="container-fluid">
                <div className="row">
                  <Grouping title="Description" backgroundColorClass="bg-purple">
                    <p>{occupationDetail.description}</p>
                  </Grouping>

                  <Grouping title="A Day in the Life" backgroundColorClass="bg-purple">
                    <>
                      {getTasksList(occupationDetail.tasks)}
                      {seeMore(occupationDetail.tasks)}
                    </>
                  </Grouping>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  } else {
    return <></>;
  }
};
