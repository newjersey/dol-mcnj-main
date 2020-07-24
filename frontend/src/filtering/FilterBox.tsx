import React, { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { FilterContext } from "../App";
import { SecondaryButton } from "../components/SecondaryButton";
import { Icon, useMediaQuery } from "@material-ui/core";
import { CostFilter } from "./CostFilter";
import { EmploymentRateFilter } from "./EmploymentRateFilter";
import { TimeToCompleteFilter } from "./TimeToCompleteFilter";
import { navigate } from "@reach/router";
import { Searchbar } from "../components/Searchbar";

interface Props {
  searchQuery?: string;
  resultCount: number;
  setShowTrainings: (shouldShowTrainings: boolean) => void;
}

const usePrevious = <T extends {}>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const FilterBox = (props: Props): ReactElement => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const previousWasTabletAndUp = usePrevious(isTabletAndUp);

  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const { state } = useContext(FilterContext);

  useEffect(() => {
    if (isTabletAndUp) {
      setFilterIsOpen(true);
      props.setShowTrainings(true);
    }

    if (!isTabletAndUp && previousWasTabletAndUp) {
      setFilterIsOpen(false);
      props.setShowTrainings(true);
    }
  }, [isTabletAndUp, previousWasTabletAndUp, props]);

  const toggleFilterVisibility = (): void => {
    const newFilterIsOpen = !filterIsOpen;
    props.setShowTrainings(!newFilterIsOpen);
    setFilterIsOpen(newFilterIsOpen);
  };

  const closeFilters = (): void => {
    props.setShowTrainings(true);
    setFilterIsOpen(false);
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
    if (props.resultCount === 1) {
      return `${props.resultCount} result`;
    } else {
      return `${props.resultCount} results`;
    }
  };

  return (
    <div className={`bg-light-green pam filterbox ${isFullscreen()}`}>
      <Searchbar
        onSearch={(searchQuery: string): Promise<void> => {
          closeFilters();
          return navigate(`/search/${searchQuery}`);
        }}
        initialValue={props.searchQuery}
        stacked={true}
      />
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
      </div>
    </div>
  );
};
