import { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { Drawer } from "@material-ui/core";

import { FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";

import { FilterFormInput } from "./FilterFormInput";
import { FilterFormDropDown } from "./FilterFormDropDown";

interface Props {
  searchQuery?: string;
  miles?: string;
  zip?: string;
}

const MILES_VALUES = [5, 10, 25, 50];

export const FilterDrawer = ({
  searchQuery,
  miles,
  zip
}: Props): ReactElement => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  }

  const methods = useForm<Props>({
    defaultValues: {
      searchQuery,
      miles,
      zip
    }
  });
  
  const { handleSubmit } = methods;

  const onSubmit = (data: Props) => {
    console.log(data);
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
          <div id="form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormProvider {...methods}>
                <FilterFormInput
                  inputLabel="Search by training, provider, certifcation, SOC code, or keyword"
                  inputName="searchQuery"
                  hasIcon={true}
                  icon={<MagnifyingGlass />}
                />
                <div className="field-group zip-miles-group">
                  <FilterFormDropDown
                    dropdownLabel="Miles"
                    dropdownName="miles"
                    options_values={MILES_VALUES}
                  />
                  <div className="conjunction-container">
                    from
                  </div>
                  <FilterFormInput
                    inputLabel="Zip Code"
                    inputName="zip"
                  />
                </div>
              </FormProvider>
            </form>
          </div>
        </div>
      </Drawer>
    </>
  )
};