import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { InDemandOccupation } from "../domain/Occupation";
import { MajorGroup } from "./MajorGroup";
import { Typeahead } from "./Typeahead";
import { useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";

interface Props extends RouteComponentProps {
  client: Client;
}

type MajorGroupName = string;

export const InDemandOccupationsPage = (props: Props): ReactElement => {
  const { t } = useTranslation();
  const [occupationLookup, setOccupationLookup] = useState<
      Record<MajorGroupName, InDemandOccupation[]>
      >({});

  useEffect(() => {
    document.title = t("InDemandPage.pageTitle");
  }, [t]);

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
      <Layout client={props.client}>
        <div className="container">
          <h2 className="text-xl ptd weight-500">{t("InDemandPage.header")}</h2>

          <p>
            {t("InDemandPage.description")}
            &nbsp;
            <a className="link-format-blue" href="https://www.nj.gov/labor/career-services/tools-support/demand-occupations/waivers.shtml" target="_blank" rel="noreferrer">
              {t("InDemandPage.descriptionTextLink")}
            </a>
            .
          </p>
          <div className="pbm search-bar">
            <Typeahead occupations={Object.values(occupationLookup).flat()} />
          </div>

          <div className="fdc pbm">{displayMajorGroups()}</div>
        </div>
      </Layout>
  );
};