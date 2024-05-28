/* eslint-disable @typescript-eslint/ban-types */

import {
  ReactElement,
  useState
} from "react";
// import { CostFilter } from "./CostFilter";
// import { TimeToCompleteFilter } from "./TimeToCompleteFilter";
// import { Searchbar } from "../components/Searchbar";
// import { navigate } from "@reach/router";
// import { ClassFormatFilter } from "./ClassFormatFilter";
// import { LocationFilter } from "./LocationFilter";
// import { InDemandOnlyFilter } from "./InDemandOnlyFilter";
// import { CountyFilter } from "./CountyFilter";
// import { SocCodeFilter } from "./SocCodeFilter";
// import { CipCodeFilter } from "./CipCodeFilter";
// import { ProgramServicesFilter } from "./ProgramServicesFilter";
// import { LanguagesFilter } from "./LanguagesFilter";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";

import { Drawer } from "@material-ui/core";
import { FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";

import { FilterFormInput } from "./FilterFormInput";

import { CountyProps } from "./newJerseyCounties";

interface Props {
  resetStateForReload: () => void;
  searchQuery: string | null;
  isMobile?: boolean;
}

interface FormProps {
  searchQuery: string;
  county: CountyProps | "";
}

export const FilterBox = ({
  resetStateForReload,
  searchQuery,
  isMobile,
}: Props): ReactElement => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  }

  const methods = useForm<FormProps>({
    defaultValues: {
      searchQuery: searchQuery || ""
    }
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FormProps) => {
    console.log(data);
  };

  const handleApplyFilters = () => {
    // toggleDrawer();
    handleSubmit(onSubmit)();
  }

  // const executeSearch = (newQuery: string): void => {
  //   if (isMobile) {
  //     setIsOpen(false);
  //   }

  //   if (newQuery === searchQuery) {
  //     return;
  //   }

  //   resetStateForReload();
  //   navigate(`/training/search?q=${encodeURIComponent(newQuery)}`);
  // };

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
          <FormProvider {...methods}>
            <div className="filter-fields">
              <FilterFormInput
                inputLabel="Search by training, provider, certifcation, SOC code, or keyword"
                inputName="searchQuery"
                hasIcon={true}
                icon={<MagnifyingGlass />}
              />
            </div>
          </FormProvider>
          <div className="filter-button-container">
            <button
              onClick={handleApplyFilters}
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
