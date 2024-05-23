import { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { Drawer } from "@material-ui/core";

import { CurrencyDollar, FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";

import { CountyProps } from "./newJerseyCounties";

import { FilterFormInput } from "./FilterFormInput";
import { FilterFormSwitch } from "./FilterFormSwitch";
import { FilterFormAutocomplete } from "./FilterFormAutocomplete";

import { COUNTIES } from "./newJerseyCounties";
import { FilterFormMulti } from "./FilterFormMulti";
import {
  classFormatList,
  ClassFormatProps,
  completeInList,
  CompleteInProps,
  languageList,
  LanguageProps,
  serviceList,
  ServiceProps
} from "./filterLists";
import { FilterFormChecks } from "./FilterFormChecks";

interface Props {
  searchQuery?: string;
  classFormat?: ClassFormatProps[];
  completeIn?: CompleteInProps[];
  county?: CountyProps | "";
  inDemand?: boolean;
  languages?: LanguageProps[];
  maxCost?: string | undefined;
  miles?: string | undefined;
  services?: ServiceProps[];
  zip?: string;
  cipCode?: string;
  socCode?: string;
}

export const FilterDrawer = ({
  searchQuery = "",
  classFormat = [],
  completeIn = [],
  county = "",
  inDemand = false,
  languages = [],
  maxCost = "",
  miles,
  services = [],
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
      classFormat,
      completeIn,
      county,
      inDemand,
      languages,
      maxCost,
      miles,
      services,
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
                <div id="form-fields">
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
                    inputType="text"
                    hasIcon={true}
                    icon={<CurrencyDollar />}
                  />
                  <FilterFormAutocomplete
                    inputLabel="Filter by County"
                    inputName="county"
                    options={COUNTIES}
                  />
                  <FilterFormChecks
                    defaultValues={classFormat}
                    inputLabel="Class Format"
                    inputName="classFormat"
                    options={classFormatList}
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
                        inputName="zip"
                      />
                    </div>
                  </div>
                  <FilterFormMulti
                    defaultValues={completeIn}
                    inputLabel="Time to Complete"
                    inputName="completeIn"
                    options={completeInList}
                  />
                  <FilterFormMulti
                    defaultValues={languages}
                    inputLabel="Languages"
                    inputName="languages"
                    options={languageList}
                  />
                  <FilterFormMulti
                    defaultValues={services}
                    inputLabel="Provider Services"
                    inputName="services"
                    options={serviceList}
                  />
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
                </div>
                <div id="drawer-btn-container" className="row">
                  <button type="submit" id="submit-button">Apply Filters</button>
                  <button type="reset" id="reset-button">Clear Filters</button>
                </div>
              </FormProvider>
            </div>
          </form>
        </div>
      </Drawer>
    </>
  )
};