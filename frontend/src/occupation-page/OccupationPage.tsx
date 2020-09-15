import React, { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { OccupationDetail } from "../domain/Occupation";
import { Header } from "../search-results/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Grouping } from "../components/Grouping";
import { InlineIcon } from "../components/InlineIcon";
import { InDemandTag } from "../components/InDemandTag";
import { Error } from "../domain/Error";
import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";
import { NotFoundPage } from "../error/NotFoundPage";

interface Props extends RouteComponentProps {
  soc?: string;
  client: Client;
}

export const OccupationPage = (props: Props): ReactElement => {
  const DATA_UNAVAILABLE_TEXT = "This data is not yet available for this occupation.";

  const [occupationDetail, setOccupationDetail] = useState<OccupationDetail | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const socCode = props.soc ? props.soc : "";

    props.client.getOccupationDetailBySoc(socCode, {
      onSuccess: (result: OccupationDetail) => {
        setError(null);
        setOccupationDetail(result);
      },
      onError: (error: Error) => setError(error),
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
      return <p>{DATA_UNAVAILABLE_TEXT}</p>;
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
        <div className="fdc page">
          <main className="container below-banners" role="main">
            <div className="ptm weight-500 fin all-caps border-bottom-dark">Occupation</div>
            <h2 className="text-xl ptd pbs weight-500">{occupationDetail.title}</h2>
            {occupationDetail.inDemand ? <InDemandTag /> : <></>}
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

              <div className="col-md-4">
                <div className="container-fluid">
                  <div className="row">
                    <Grouping title="Education" backgroundColorClass="bg-purple">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: occupationDetail.education
                            ? occupationDetail.education
                            : DATA_UNAVAILABLE_TEXT,
                        }}
                      />
                    </Grouping>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className="container footer ptxl pbm">
            <p>
              Source: O*NET OnLine by the U.S. Department of Labor, Employment and Training
              Administration (USDOL/ETA). Used under the CC BY 4.0 license. O*NET® is a trademark of
              USDOL/ETA.
            </p>
            <p>
              Source: Bureau of Labor Statistics, U.S. Department of Labor, Occupational Outlook
              Handbook
            </p>
          </footer>
        </div>
      </>
    );
  } else if (error === Error.SYSTEM_ERROR) {
    return <SomethingWentWrongPage />;
  } else if (error === Error.NOT_FOUND) {
    return <NotFoundPage />;
  } else {
    return <></>;
  }
};
