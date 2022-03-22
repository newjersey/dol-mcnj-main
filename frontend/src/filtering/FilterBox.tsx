/* eslint-disable @typescript-eslint/ban-types */

import React, { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { FilterContext } from "./FilterContext";
import { SecondaryButton } from "../components/SecondaryButton";
import { Icon, useMediaQuery } from "@material-ui/core";
import { CostFilter } from "./CostFilter";
import { TimeToCompleteFilter } from "./TimeToCompleteFilter";
import { Searchbar } from "../components/Searchbar";
import { navigate } from "@reach/router";
import { ClassFormatFilter } from "./ClassFormatFilter";
import { LocationFilter } from "./LocationFilter";
import { InlineIcon } from "../components/InlineIcon";
import { InDemandOnlyFilter } from "./InDemandOnlyFilter";
import { SearchAndFilterStrings } from "../localizations/SearchAndFilterStrings";

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
  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const previousWasTabletAndUp = usePrevious(isTabletAndUp);
  const isMobile = !isTabletAndUp;

  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const { state } = useContext(FilterContext);

  useEffect(() => {
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
    if (resultCount === 1) {
      return SearchAndFilterStrings.singularResultCountString.replace(
        "{count}",
        resultCount.toString()
      );
    } else {
      return SearchAndFilterStrings.pluralResultCountString.replace(
        "{count}",
        resultCount.toString()
      );
    }
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
    navigate(`/search/${encodeURIComponent(newQuery)}`);
  };

  const MobileFilterDropdown = (): ReactElement => {
    return (
      <div className={`fdr mbd ${filterIsOpen && "phl"}`}>
        <SecondaryButton
          className="filter-dropdown"
          onClick={toggleFilterVisibility}
          endIcon={<Icon>{getArrowIcon()}</Icon>}
        >
          <span className={`fin pls ${blueWhenFilterApplied()}`}>
            <InlineIcon className="mrs">filter_list</InlineIcon>
            {SearchAndFilterStrings.mobileFilterText}
          </span>
        </SecondaryButton>
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
          buttonText={SearchAndFilterStrings.searchButtonDefaultText}
        />
      )}

      <div className="phl" style={{ display: filterIsOpen ? "block" : "none" }}>
        <Searchbar
          onSearch={executeSearch}
          initialValue={searchQuery}
          stacked={true}
          buttonText={
            !searchQuery
              ? SearchAndFilterStrings.searchButtonDefaultText
              : SearchAndFilterStrings.searchButtonUpdateResultsText
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
      </div>
    </div>
  );
};
