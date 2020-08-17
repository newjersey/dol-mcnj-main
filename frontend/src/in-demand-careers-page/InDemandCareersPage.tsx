import React, { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Header } from "../search-results/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Client } from "../domain/Client";
import { Occupation } from "../domain/Occupation";

interface Props extends RouteComponentProps {
  client: Client;
}

export const InDemandCareersPage = (props: Props): ReactElement => {
  const [occupations, setOccupations] = useState<Occupation[]>([]);

  useEffect(() => {
    props.client.getOccupations({
      onSuccess: setOccupations,
      onError: () => {},
    });
  }, [props.client]);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners">
        <h2 className="text-xl ptd weight-500">In-Demand Careers</h2>
        <p>
          This is a list of occupations expected to have the most openings in the future in the
          state of New Jersey. Trainings related to careers on this list can be eligible for funding
          by the State.
        </p>

        {occupations.map((occupation) => (
          <p key={occupation.soc}>{occupation.title}</p>
        ))}
      </main>
    </>
  );
};
