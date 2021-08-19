import React, { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BetaBanner } from "../components/BetaBanner";
import { Client } from "../domain/Client";
import { InDemandOccupation } from "../domain/Occupation";
import { MajorGroup } from "./MajorGroup";
import { Typeahead } from "./Typeahead";
import { InDemandPageStrings } from "../localizations/InDemandPageStrings";

interface Props extends RouteComponentProps {
  client: Client;
}

type MajorGroupName = string;

export const InDemandOccupationsPage = (props: Props): ReactElement => {
  const [occupationLookup, setOccupationLookup] = useState<
    Record<MajorGroupName, InDemandOccupation[]>
  >({});

  useEffect(() => {
    document.title = InDemandPageStrings.pageTitle;
  }, []);

  useEffect(() => {
    props.client.getInDemandOccupations({
      onSuccess: (data) => setOccupationLookup(groupOccupations(data)),
      onError: () => {},
    });
  }, [props.client]);

  const groupOccupations = (
    occupations: InDemandOccupation[]
  ): Record<MajorGroupName, InDemandOccupation[]> => {
    return occupations.reduce(
      (result: Record<MajorGroupName, InDemandOccupation[]>, item: InDemandOccupation) => ({
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
        <h2 className="text-xl ptd weight-500">{InDemandPageStrings.header}</h2>
        <p>{InDemandPageStrings.description}</p>

        <div className="pbm search-bar">
          <Typeahead occupations={Object.values(occupationLookup).flat()} />
        </div>

        <div className="fdc pbm">{displayMajorGroups()}</div>
      </main>

      <Footer />
    </>
  );
};
