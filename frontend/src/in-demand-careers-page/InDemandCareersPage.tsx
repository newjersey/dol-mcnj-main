import React, { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Header } from "../search-results/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Client } from "../domain/Client";
import { Occupation } from "../domain/Occupation";
import { MajorGroup } from "./MajorGroup";

interface Props extends RouteComponentProps {
  client: Client;
}

type MajorGroupName = string;

export const InDemandCareersPage = (props: Props): ReactElement => {
  const [occupationLookup, setOccupationLookup] = useState<Record<MajorGroupName, Occupation[]>>(
    {}
  );

  useEffect(() => {
    props.client.getOccupations({
      onSuccess: (data) => setOccupationLookup(groupOccupations(data)),
      onError: () => {},
    });
  }, [props.client]);

  const groupOccupations = (occupations: Occupation[]): Record<MajorGroupName, Occupation[]> => {
    return occupations.reduce(
      (result: Record<MajorGroupName, Occupation[]>, item: Occupation) => ({
        ...result,
        [item.majorGroup]: [...(result[item.majorGroup] || []), item],
      }),
      {}
    );
  };

  const displayMajorGroups = (): ReactElement[] => {
    const sortedMajorGroups = Object.keys(occupationLookup).sort();

    return sortedMajorGroups.map((majorGroupName) => (
      <MajorGroup
        key={majorGroupName}
        majorGroupName={majorGroupName}
        occupations={occupationLookup[majorGroupName]}
      />
    ));
  };

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners">
        <h2 className="text-xl ptd weight-500">In-Demand Careers</h2>
        <p>
          This is a list of careers expected to have the most openings in the future in the state of
          New Jersey. Trainings related to careers on this list can be eligible for funding by the
          State.
        </p>

        <div className="fdc">{displayMajorGroups()}</div>
      </main>
    </>
  );
};
