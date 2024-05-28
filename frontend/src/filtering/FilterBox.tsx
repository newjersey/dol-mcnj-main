/* eslint-disable @typescript-eslint/ban-types */

import {
  ReactElement,
  useState
} from "react";
import { navigate } from "@reach/router";
// import { CostFilter } from "./CostFilter";
// import { TimeToCompleteFilter } from "./TimeToCompleteFilter";
// import { Searchbar } from "../components/Searchbar";
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

import { CountyProps, COUNTIES } from "./newJerseyCounties";
import { FilterFormDropDown } from "./FilterFormDropDown";

interface Props {
  resetStateForReload: () => void;
  searchQuery: string;
  county?: CountyProps | "";
  isMobile?: boolean;
  miles?: string;
  zipcode?: string;
}

interface FormProps {
  searchQuery: string;
  county: CountyProps | "";
  miles?: string;
  zipcode?: string;
}

export const FilterBox = ({
  resetStateForReload,
  searchQuery,
  county,
  isMobile,
  miles,
  zipcode
}: Props): ReactElement => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  }

  const methods = useForm<FormProps>({
    defaultValues: {
      searchQuery,
      county: county || "",
      miles: miles || "",
      zipcode: zipcode || ""
    }
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: FormProps) => {
    console.log(data);
    const { searchQuery, county, miles, zipcode } = data;

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("q", searchQuery);
    if (county) {
      urlParams.set("county", county);
    } else {
      urlParams.delete("county");
    }
    if (miles) {
      urlParams.set("miles", miles);
    } else {
      urlParams.delete("miles");
    }
    if (zipcode) {
      urlParams.set("zipcode", zipcode);
    } else {
      urlParams.delete("zipcode");
    }
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    navigate(newUrl);
  };

  const handleApplyFilters = () => {
    toggleDrawer();
    handleSubmit(onSubmit)();
  }

  const handleClearFilters = () => {
    reset({
      county: "",
      miles: undefined,
      zipcode: undefined
    });
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
              <FilterFormDropDown
                inputName="county"
                options={COUNTIES}
                inputLabel="County"
              />
              <div className="field-group">
                <div className="label-container">
                  <label>
                    Distance from ZIP code
                  </label>
                </div>
                <div className="zip-miles-group">
                  <FilterFormInput
                    inputName="miles"
                    inputType="number"
                  />
                  <div className="conjunction-container">
                    from
                  </div>
                  <FilterFormInput
                    inputName="zipcode"
                  />
                </div>
              </div>
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
              onClick={handleClearFilters}
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
