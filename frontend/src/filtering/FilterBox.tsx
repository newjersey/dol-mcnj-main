/* eslint-disable @typescript-eslint/ban-types */

import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { FilterContext } from "./FilterContext";
import { useMediaQuery } from "@material-ui/core";
import { CostFilter } from "./CostFilter";
import { TimeToCompleteFilter } from "./TimeToCompleteFilter";
import { Searchbar } from "../components/Searchbar";
import { navigate } from "@reach/router";
import { ClassFormatFilter } from "./ClassFormatFilter";
import { LocationFilter } from "./LocationFilter";
import { InlineIcon } from "../components/InlineIcon";
import { InDemandOnlyFilter } from "./InDemandOnlyFilter";
import { CountyFilter } from "./CountyFilter";
import { SocCodeFilter } from "./SocCodeFilter";
import { CipCodeFilter } from "./CipCodeFilter";
import { ProgramServicesFilter } from "./ProgramServicesFilter";
import { LanguagesFilter } from "./LanguagesFilter";
import { Button } from "../components/Button";
import { useTranslation } from "react-i18next";

import { FunnelSimple } from "@phosphor-icons/react";

interface Props {
  searchQuery?: string;
}

const usePrevious = <T extends {}>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const FilterBox = ({
}: Props): ReactElement => {
  const { t } = useTranslation();

  const toggleDrawer = () => {}

  return (
    <>
      <div className="filter-button-container">
        <button
          onClick={toggleDrawer}
        >
          {t("SearchResultsPage.filtersButton")} <FunnelSimple />
        </button>
      </div>
    </>
  )
};
