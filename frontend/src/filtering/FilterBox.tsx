import React, { ReactElement, useContext, useEffect, useState } from "react";
import { FilterContext } from "../App";
import { SecondaryButton } from "../components/SecondaryButton";
import { useMediaQuery } from "@material-ui/core";
import { CostFilter } from "./CostFilter";
import { EmploymentRateFilter } from "./EmploymentRateFilter";
import { TimeToCompleteFilter } from "./TimeToCompleteFilter";
import { navigate } from "@reach/router";
import { Searchbar } from "../components/Searchbar";

interface Props {
  searchQuery?: string;
}

export const FilterBox = (props: Props): ReactElement => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");

  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const { state } = useContext(FilterContext);

  useEffect(() => {
    if (isTabletAndUp) {
      setFilterIsOpen(true);
    }
  }, [isTabletAndUp]);

  const toggleFilterVisibility = (): void => {
    setFilterIsOpen(!filterIsOpen);
  };

  const blueWhenFilterApplied = (): string => {
    return state.filters.length > 0 ? "blue" : "";
  };

  const isFullscreen = (): string => {
    return filterIsOpen && !isTabletAndUp ? "full" : "";
  };

  return (
    <div className={`bg-light-green pam filterbox ${isFullscreen()}`}>
      <Searchbar
        onSearch={(searchQuery: string): Promise<void> => {
          toggleFilterVisibility();
          return navigate(`/search/${searchQuery}`);
        }}
        initialValue={props.searchQuery}
        stacked={true}
      />
      <div className="ptm fdr" style={{ display: isTabletAndUp ? "none" : "flex" }}>
        <SecondaryButton className="fin flex-half" onClick={toggleFilterVisibility}>
          <i className={`material-icons ${blueWhenFilterApplied()}`}>filter_list</i>
          <span className={`mls ${blueWhenFilterApplied()}`}>Filters</span>
        </SecondaryButton>
      </div>
      <div className="ptd" style={{ display: filterIsOpen ? "block" : "none" }}>
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
