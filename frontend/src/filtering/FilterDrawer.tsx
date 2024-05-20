import { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { Drawer } from "@material-ui/core";

import { FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";

import { CountyProps } from "./newJerseyCounties";

import { FilterFormInput } from "./FilterFormInput";
import { FilterFormDropDown } from "./FilterFormDropDown";
import { FilterFormSwitch } from "./FilterFormSwitch";
import { FilterFormAutocomplete } from "./FilterFormAutocomplete";

interface Props {
  searchQuery?: string;
  county?: CountyProps | "";
  inDemand?: boolean;
  maxCost?: number;
  miles?: string;
  zip?: string;
  cipCode?: string;
  socCode?: string;
}

const MILES_VALUES = [5, 10, 25, 50];

export const FilterDrawer = ({
  searchQuery = "",
  county = "",
  inDemand = false,
  maxCost,
  miles = "10",
  zip = "",
  cipCode = "",
  socCode = "",
}: Props): ReactElement => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  }

  const methods = useForm<Props>({
    defaultValues: {
      searchQuery,
      county,
      inDemand,
      maxCost,
      miles,
      zip,
      cipCode,
      socCode,
    }
  });
  
  const { handleSubmit, getValues } = methods;

  const onSubmit = () => {
    const getValuesData = getValues();
    console.log(getValuesData)
  }

  return (
    <>
      <div className="filter-button-container">
        <button
          onClick={toggleDrawer}
        >
          {t("SearchResultsPage.filtersButton")} <FunnelSimple />
        </button>
      </div>
      <Drawer
        anchor="left"
        open={isOpen}
      >
        <div id="drawer-content-container">
          <div className="drawer-header">
            <h2>Add Filters</h2>
            <button
              className="close-button"
              onClick={toggleDrawer}
            >
              <X />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div id="form-container">
              <FormProvider {...methods}>
                <FilterFormInput
                  inputLabel="Search by training, provider, certifcation, SOC code, or keyword"
                  inputName="searchQuery"
                  hasIcon={true}
                  icon={<MagnifyingGlass />}
                />
                <FilterFormSwitch
                  inputLabel="Show In-Demand trainings only"
                  inputName="inDemand"
                  inputChecked={inDemand}
                />
                <FilterFormInput
                  inputLabel="Max Cost"
                  inputName="maxCost"
                  inputType="number"
                />
                <FilterFormAutocomplete
                  inputLabel="Filter by County"
                  inputName="county"
                />
                <div className="field-group">
                  <div className="label-container">
                    <label>
                      Distance from ZIP code
                    </label>
                  </div>
                  <div className="zip-miles-group">
                    <FilterFormDropDown
                      dropdownName="miles"
                      options_values={MILES_VALUES}
                    />
                    <div className="conjunction-container">
                      from
                    </div>
                    <FilterFormInput
                      inputName="zip"
                    />
                  </div>
                </div>
                <FilterFormInput
                  inputLabel="Filter by CIP Code"
                  inputName="cipCode"
                  placeholder="##.####"
                  subLabel="CIP codes are 6 digits."
                />
                <FilterFormInput
                  inputLabel="Filter by SOC Code"
                  inputName="socCode"
                  placeholder="##-####"
                  subLabel="SOC codes are 6 digits."
                />
                <button type="submit">Apply Filters</button>
              </FormProvider>
            </div>
          </form>
        </div>
      </Drawer>
    </>
  )
};