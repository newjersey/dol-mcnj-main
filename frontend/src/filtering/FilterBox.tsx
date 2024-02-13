/* eslint-disable @typescript-eslint/ban-types */

import React, { ReactElement, useContext, useEffect, useRef, useState } from "react";
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

interface Props {
  searchQuery?: string;
  resultCount: number;
  setShowTrainings: (shouldShowTrainings: boolean) => void;
  resetStateForReload: () => void;
  children: ReactElement;
  fixedContainer?: boolean;
}

const usePrevious = <T extends {}>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const FilterBox = ({
  searchQuery,
  resultCount,
  setShowTrainings,
  resetStateForReload,
  children,
  fixedContainer,
}: Props): ReactElement => {
  const { t } = useTranslation();

  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const previousWasTabletAndUp = usePrevious(isTabletAndUp);
  const isMobile = !isTabletAndUp;

  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const [pagePath, setPagePath] = useState<string>("");
  const { state } = useContext(FilterContext);

  // current page path

  useEffect(() => {
    // check if window exists (for SSR)
    if (typeof window !== "undefined") {
      setPagePath(window.location.pathname);
    }

    if (isTabletAndUp) {
      setFilterIsOpen(true);
    }

    if (!isTabletAndUp && previousWasTabletAndUp) {
      setFilterIsOpen(false);
    }

    if (searchQuery) {
      setShowTrainings(true);
    }
  }, [isTabletAndUp, previousWasTabletAndUp, searchQuery, setShowTrainings]);

  const toggleFilterVisibility = (): void => {
    const newFilterIsOpen = !filterIsOpen;
    setFilterIsOpen(newFilterIsOpen);
  };

  const blueWhenFilterApplied = (): string => {
    return state.filters.length > 0 ? "blue" : "";
  };

  const isFullscreen = (): string => {
    const mobileClass = filterIsOpen ? "full bg-light-green pvd" : "bg-white pvd";
    return isMobile ? mobileClass : "bg-light-green pvd";
  };

  const isFixedContainer = (): string => {
    const mobileFixed = isMobile && !filterIsOpen;
    return fixedContainer && (!isMobile || mobileFixed) ? "is-fixed" : "";
  };

  const getArrowIcon = (): string => {
    return filterIsOpen && isMobile ? "keyboard_arrow_up" : "keyboard_arrow_down";
  };

  const getResultCountText = (): string => {
    return t("SearchAndFilter.resultCountString", { count: resultCount });
  };

  const executeSearch = (newQuery: string): void => {
    if (isMobile) {
      setFilterIsOpen(false);
    }

    if (newQuery === searchQuery) {
      return;
    } else if (newQuery) {
      setShowTrainings(true);
    }

    resetStateForReload();
    navigate(`/training/search?=${encodeURIComponent(newQuery)}`);
  };

  const MobileFilterDropdown = (): ReactElement => {
    return (
      <div className={`fdr mbd ${filterIsOpen && "phl"}`}>
        <Button variant="outline" className="filter-dropdown" onClick={toggleFilterVisibility}>
          <span className={`fin pls ${blueWhenFilterApplied()}`}>
            <InlineIcon className="mrs">filter_list</InlineIcon>
            {t("SearchAndFilter.mobileFilterText")}
            <InlineIcon className="mls">{getArrowIcon()}</InlineIcon>
          </span>
        </Button>
      </div>
    );
  };

  return (
    <div className={`filterbox ${isFullscreen()} ${isFixedContainer()}`}>
      {isMobile && searchQuery && <MobileFilterDropdown />}

      {isMobile && !searchQuery && (
        <Searchbar
          onSearch={executeSearch}
          initialValue={searchQuery}
          stacked={true}
          isLandingPage={pagePath === "/training/search"}
          buttonText={t("SearchAndFilter.searchButtonDefaultText")}
        />
      )}

      <div className="phl" style={{ display: filterIsOpen ? "block" : "none" }}>
        <Searchbar
          onSearch={executeSearch}
          initialValue={searchQuery}
          stacked={true}
          buttonText={
            !searchQuery
              ? t("SearchAndFilter.searchButtonDefaultText")
              : t("SearchAndFilter.searchButtonUpdateResultsText")
          }
        />

        {isMobile && (
          <>
            <div className="mtd mbs grey-line" />
            <div className="fdr fac mvm">
              <div className="flex-half bold">{getResultCountText()}</div>
              <div className="flex-half">{children}</div>
            </div>
            <div className="mvs grey-line" />
          </>
        )}

        <div className="mtd">
          <LocationFilter />
        </div>

        <div className="mtd">
          <CountyFilter />
        </div>

        <div className="mtd">
          <InDemandOnlyFilter />
        </div>

        <div className="mtd">
          <CostFilter />
        </div>

        <div className="mtd">
          <ClassFormatFilter />
        </div>

        <div className="mtd">
          <TimeToCompleteFilter />
        </div>

        <div className="mtd">
          <ProgramServicesFilter />
        </div>

        <div className="mtd">
          <LanguagesFilter />
        </div>

        <div className="mtl">
          <CipCodeFilter />
        </div>

        <div className="mtd">
          <SocCodeFilter />
        </div>
      </div>
    </div>
  );
};
