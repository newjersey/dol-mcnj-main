import React, { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { OccupationDetail } from "../domain/Occupation";
import { Header } from "../search-results/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Grouping } from "../components/Grouping";

interface Props extends RouteComponentProps {
  soc?: string;
  client: Client;
}

export const OccupationPage = (props: Props): ReactElement => {
  const [occupationDetail, setOccupationDetail] = useState<OccupationDetail | undefined>(undefined);

  useEffect(() => {
    const socCode = props.soc ? props.soc : "";

    props.client.getOccupationDetailBySoc(socCode, {
      onSuccess: (result: OccupationDetail) => {
        setOccupationDetail(result);
      },
      onError: () => {},
    });
  }, [props.soc, props.client]);

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
