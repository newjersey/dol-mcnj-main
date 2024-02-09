import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { formatCountiesArrayToString } from "../utils/formatCountiesArrayToString";
import { Fire } from "@phosphor-icons/react";

interface Props {
  className?: string;
  counties?: string[];
}

export const InDemandTag = (props: Props): ReactElement => {
  const { t } = useTranslation();

  // Formatted counties string
  const countiesString = formatCountiesArrayToString(props.counties);

  return (
    <span data-testid="in-demand-badge" className={`fin fas bg-orange-tag tag mrs ${props.className}`}>
      <Fire weight="fill" />
      {countiesString
        ? t("SearchResultsPage.inDemandCountiesTag", { counties: countiesString })
        : t("SearchResultsPage.inDemandTag")}
    </span>
  );
};
