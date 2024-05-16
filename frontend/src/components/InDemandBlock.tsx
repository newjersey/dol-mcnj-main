import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { formatCountiesArrayToString } from "../utils/formatCountiesArrayToString";

interface Props {
  counties?: string[];
}

export const InDemandBlock = (props: Props): ReactElement => {
  const { t } = useTranslation();

  const countiesStr = props.counties ? formatCountiesArrayToString(props.counties) : null;

  return (
    <div className="bg-light-orange countyBlock">
      <h2>
        {!countiesStr
          ? t("InDemandBlock.inDemandTitle")
          : t("InDemandBlock.localInDemandTitle", { countiesList: countiesStr })}
      </h2>
      <div>
        {t("InDemandBlock.inDemandText")}{" "}
        <a
          href="https://www.nj.gov/labor/career-services/contact-us/one-stops/"
          target="_blank"
          rel="noreferrer"
        >
          {t("InDemandBlock.inDemandLinkText")}
        </a>
        .
      </div>
    </div>
  );
};
