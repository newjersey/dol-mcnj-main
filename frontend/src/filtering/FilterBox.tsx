import React, { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { FilterContext } from "../App";
import { SecondaryButton } from "../components/SecondaryButton";
import { Icon, useMediaQuery } from "@material-ui/core";
import { CostFilter } from "./CostFilter";
import { EmploymentRateFilter } from "./EmploymentRateFilter";
import { TimeToCompleteFilter } from "./TimeToCompleteFilter";
import { Searchbar } from "../components/Searchbar";
import { navigate } from "@reach/router";
import { ClassFormatFilter } from "./ClassFormatFilter";

interface Props {
  searchQuery?: string;
  resultCount: number;
  setShowTrainings: (shouldShowTrainings: boolean) => void;
  setToReloadState: () => void;
  children: ReactElement;
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
  setToReloadState,
  children,
}: Props): ReactElement => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const previousWasTabletAndUp = usePrevious(isTabletAndUp);

  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const { state } = useContext(FilterContext);

  useEffect(() => {
    if (isTabletAndUp) {
      setFilterIsOpen(true);
      setShowTrainings(true);
    }

    if (!isTabletAndUp && previousWasTabletAndUp) {
      setFilterIsOpen(false);
      setShowTrainings(true);
    }
  }, [isTabletAndUp, previousWasTabletAndUp, setShowTrainings]);

  const toggleFilterVisibility = (): void => {
    const newFilterIsOpen = !filterIsOpen;
    setShowTrainings(!newFilterIsOpen);
    setFilterIsOpen(newFilterIsOpen);
  };

  const blueWhenFilterApplied = (): string => {
    return state.filters.length > 0 ? "blue" : "";
  };

  const isFullscreen = (): string => {
    return filterIsOpen && !isTabletAndUp ? "full" : "";
  };

  const getArrowIcon = (): string => {
    return filterIsOpen && !isTabletAndUp ? "keyboard_arrow_up" : "keyboard_arrow_down";
  };

  const getResultCountText = (): string => {
    if (resultCount === 1) {
      return `${resultCount} result`;
    } else {
      return `${resultCount} results`;
    }
  };

  const executeSearch = (newQuery: string): void => {
    setShowTrainings(true);

    if (!isTabletAndUp) {
      setFilterIsOpen(false);
    }

    if (newQuery === searchQuery) {
      return;
    }

    setToReloadState();
    navigate(`/search/${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className={`bg-light-green pam filterbox ${isFullscreen()}`}>
      <Searchbar onSearch={executeSearch} initialValue={searchQuery} stacked={true} />
      <div className="ptm fdr" style={{ display: isTabletAndUp ? "none" : "flex" }}>
        <SecondaryButton
          className="fin flex-half"
          onClick={toggleFilterVisibility}
          endIcon={<Icon>{getArrowIcon()}</Icon>}
        >
          <span style={{ marginRight: "auto" }} className={`pls ${blueWhenFilterApplied()}`}>
            Filters
          </span>
        </SecondaryButton>
        <div className="fin mla">{children}</div>
      </div>
      <div className="ptd" style={{ display: filterIsOpen ? "block" : "none" }}>
        <div style={{ display: isTabletAndUp ? "none" : "block" }}>
          <div className="mbs grey-line" />
          <div>{getResultCountText()}</div>
          <div className="mvs grey-line" />
        </div>

        <CostFilter />

        <div className="mtd">
          <EmploymentRateFilter />
        </div>

        <div className="mtd">
          <TimeToCompleteFilter />
        </div>

        <div className="mtd">
          <ClassFormatFilter />
        </div>
      </div>
    </div>
  );
};
