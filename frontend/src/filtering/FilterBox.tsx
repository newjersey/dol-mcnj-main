/* eslint-disable @typescript-eslint/ban-types */

import {
  ReactElement,
  useEffect,
  useState
} from "react";
import { CostFilter } from "./CostFilter";
import { TimeToCompleteFilter } from "./TimeToCompleteFilter";
import { Searchbar } from "../components/Searchbar";
import { navigate } from "@reach/router";
import { ClassFormatFilter } from "./ClassFormatFilter";
import { LocationFilter } from "./LocationFilter";
import { InDemandOnlyFilter } from "./InDemandOnlyFilter";
import { CountyFilter } from "./CountyFilter";
import { SocCodeFilter } from "./SocCodeFilter";
import { CipCodeFilter } from "./CipCodeFilter";
import { ProgramServicesFilter } from "./ProgramServicesFilter";
import { LanguagesFilter } from "./LanguagesFilter";
import { useTranslation } from "react-i18next";

import { Drawer } from "@material-ui/core";

import { FunnelSimple, X } from "@phosphor-icons/react";

interface Props {
  resetStateForReload: () => void;
  searchQuery: string | null;
  isMobile?: boolean;
}

export const FilterBox = ({
  resetStateForReload,
  searchQuery,
  isMobile,
}: Props): ReactElement => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pagePath, setPagePath] = useState<string>("");

  useEffect(() => {
    // check if window exists (for SSR)
    if (typeof window !== "undefined") {
      setPagePath(window.location.pathname);
    }
  }, [searchQuery]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  }

  const executeSearch = (newQuery: string): void => {
    if (isMobile) {
      setIsOpen(false);
    }

    if (newQuery === searchQuery) {
      return;
    }

    resetStateForReload();
    navigate(`/training/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <>
      <div id="filter-button-container">
        <button
          onClick={toggleDrawer}
        >
          {t("SearchResultsPage.filtersButton")} <FunnelSimple />
        </button>
      </div>
      <Drawer
        anchor={isMobile ? "bottom" : "left"}
        open={isOpen}
      >
        <div id="filter-content">
          <div id="filter-heading">
            <h2>Add Filters</h2>
            <button
              className="close-button"
              onClick={toggleDrawer}
            >
              <X />
            </button>
          </div>
          <div className="filter-fields">
            <div>
              <Searchbar
                onSearch={executeSearch}
                initialValue={searchQuery !== "null" ? searchQuery?.replace(/\+/g, " ") : undefined}
                stacked={true}
                isLandingPage={pagePath === "/training/search"}
                buttonText={t("SearchAndFilter.searchButtonDefaultText")}
              />
            </div>
            
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
          <div className="filter-button-container">
            <button
              onClick={toggleDrawer}
              className="filter-apply-button"
            >
              Apply Filters
            </button>
            <button
              className="filter-clear-button"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </Drawer>
    </>
  )
};
