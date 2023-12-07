import { useMediaQuery } from "@material-ui/core";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { formatCountiesArrayToString } from "../utils/formatCountiesArrayToString";

interface Props {
  counties?: string[];
}

export const InDemandBlock = (props: Props): ReactElement => {
  const { t } = useTranslation();

  const isTabletAndUp = useMediaQuery("(min-width:768px)");

  const countiesStr = props.counties ? formatCountiesArrayToString(props.counties) : null;

  return (
    <div className="bg-light-yellow countyBlock">
      <div>
        {!countiesStr
          ? t("InDemandBlock.inDemandTitle")
          : t("InDemandBlock.localInDemandTitle", { countiesList: countiesStr })}
      </div>
      {props.counties && isTabletAndUp}
    </div>
  );
};
