import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { InDemandOccupation } from "../domain/Occupation";
import { MajorGroup } from "./MajorGroup";
import { Typeahead } from "./Typeahead";
import { useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";
import { usePageTitle } from "../utils/usePageTitle";
import pageImage from "../images/ogImages/inDemand.jpg";

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
    props.client.getInDemandOccupations({
      onSuccess: (data) => setOccupationLookup(groupOccupations(data)),
      onError: () => {},
    });
  }, [props.client]);

  const groupOccupations = (
    occupations: InDemandOccupation[],
  ): Record<MajorGroupName, InDemandOccupation[]> => {
    return occupations.reduce(
      (result: Record<MajorGroupName, InDemandOccupation[]>, item: InDemandOccupation) => ({
        ...result,
        [item.majorGroup]: [...(result[item.majorGroup] || []), item],
      }),
      {},
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

  usePageTitle(`In-Demand Occupations | ${process.env.REACT_APP_SITE_NAME}`);

  return (
    <Layout
      client={props.client}
      seo={{
        title: `In-Demand Occupations | ${process.env.REACT_APP_SITE_NAME}`,
        pageDescription:
          "Discover high-demand jobs and career opportunities in New Jersey. Explore careers with the NJ Department of Labor's In-Demand Occupations list.",
        url: props.location?.pathname || "/in-demand-occupations",
        image: pageImage,
      }}
    >
      <div className="container">
        <h2 className="text-xl ptd weight-500">{t("InDemandPage.header")}</h2>

        <p>{t("InDemandPage.description")}</p>
        <div className="pbm search-bar">
          <Typeahead occupations={Object.values(occupationLookup).flat()} />
        </div>

        <div className="fdc pbm">{displayMajorGroups()}</div>
      </div>
    </Layout>
  );
};
