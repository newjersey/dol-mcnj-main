import React, { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { FilterContext } from "../App";
import { SecondaryButton } from "../components/SecondaryButton";
import { Icon, useMediaQuery } from "@material-ui/core";
import { CostFilter } from "./CostFilter";
import { TimeToCompleteFilter } from "./TimeToCompleteFilter";
import { Searchbar } from "../components/Searchbar";
import { navigate } from "@reach/router";
import { ClassFormatFilter } from "./ClassFormatFilter";
import { LocationFilter } from "./LocationFilter";
import { Client } from "../domain/Client";
import njLogo from "../njlogo.svg";
import { InlineIcon } from "../components/InlineIcon";
import { FundingEligibleFilter } from "./FundingEligibleFilter";

interface Props {
  searchQuery?: string;
  resultCount: number;
  setShowTrainings: (shouldShowTrainings: boolean) => void;
  setToReloadState: () => void;
  children: ReactElement;
  client: Client;
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
  client,
}: Props): ReactElement => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const previousWasTabletAndUp = usePrevious(isTabletAndUp);
  const isMobile = !isTabletAndUp;

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
    return filterIsOpen && isMobile ? "full" : "";
  };

  const getArrowIcon = (): string => {
    return filterIsOpen && isMobile ? "keyboard_arrow_up" : "keyboard_arrow_down";
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

    if (isMobile) {
      setFilterIsOpen(false);
    }

    if (newQuery === searchQuery) {
      return;
    }

    setToReloadState();
    navigate(`/search/${encodeURIComponent(newQuery)}`);
  };

  const MobileFilterButtonHeader = (): ReactElement => {
    return (
      <header className="fdr mbm" role="banner">
        <a href="/">
          <img className="nj-logo-header mrd" src={njLogo} alt="" />
        </a>
        <SecondaryButton
          className=""
          onClick={toggleFilterVisibility}
          endIcon={<Icon>{getArrowIcon()}</Icon>}
        >
          <span className={`fin pls ${blueWhenFilterApplied()}`}>
            <InlineIcon className="mrs">filter_list</InlineIcon>
            Edit Search or Filter
          </span>
        </SecondaryButton>
      </header>
    );
  };

  return (
    <div className={`bg-light-green pad filterbox ${isFullscreen()}`}>
      {isMobile && <MobileFilterButtonHeader />}

      <div className="phd" style={{ display: filterIsOpen ? "block" : "none" }}>
        <Searchbar onSearch={executeSearch} initialValue={searchQuery} stacked={true} />

        {isMobile && (
          <>
            <div className="mtd mbs grey-line" />
            <div className="fdr fac mvd">
              <div className="flex-half">{getResultCountText()}</div>
              <div className="flex-half">{children}</div>
            </div>
            <div className="mvs grey-line" />
          </>
        )}

        <div className="mtd">
          <FundingEligibleFilter />
        </div>

        <div className="mtd">
          <LocationFilter client={client} />
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
