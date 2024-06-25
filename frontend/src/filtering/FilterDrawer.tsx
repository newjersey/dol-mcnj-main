import { ReactElement, useState, StrictMode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Drawer, useMediaQuery } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { CurrencyDollar, FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";

import { FilterFormCheckGroup } from "./FilterCheckBoxGroup";
import { FilterFormInput } from "./FilterInput";
import { FilterFormMultiDD } from "./FilterMultiDD";
import { FilterFormSingleDD } from "./FilterSingleDD";
import { FilterFormSwitch } from "./FilterSwitch";

import {
  classFormatList,
  completeInList,
  COUNTIES,
  languageList,
  serviceList
} from "./filterLists";

interface Props {
  searchQuery?: string;
  cipCode?: string;
  classFormat?: string[];
  county?: string;
  completeIn?: string[];
  inDemand?: boolean;
  languages?: string[];
  maxCost?: string;
  miles?: string;
  services?: string[];
  socCode?: string;
  zipcode?: string;
}

export const FilterDrawer = ({
  searchQuery = "",
  cipCode = "",
  classFormat,
  completeIn,
  county,
  inDemand,
  languages,
  maxCost = "",
  miles = "",
  services,
  socCode = "",
  zipcode = ""
}: Props): ReactElement<Props> => {
  const mobile = useMediaQuery("(max-width:640px)");
  const { t } = useTranslation();

  const [clearSelected, setClearSelected] = useState(false);
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => setOpen(!open);

  const methods = useForm<Props>({
    defaultValues: {
      searchQuery,
      cipCode,
      classFormat,
      completeIn,
      county,
      inDemand,
      languages,
      maxCost,
      miles,
      services,
      socCode,
      zipcode
    }
  })

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: Props) => {
    console.log(data);
  }

  const onReset = () => {
    setClearSelected(true);
    reset();

    setTimeout(() => {
      setClearSelected(false);
    }, 50);
  }

  return (
    <StrictMode>
      <div id="filter-button-container">
        <button
          onClick={toggleDrawer}
        >
          {t("SearchResultsPage.filtersButton")} <FunnelSimple />
        </button>
      </div>
      <Drawer
        anchor={mobile ? "bottom" : "left"}
        open={open}
        onClose={toggleDrawer}
      >
        <div id="drawer-container">
          <div id="drawer-header">
            <h2>Add Filters</h2>
            <button
              className="close-button"
              onClick={toggleDrawer}
            >
              <X />
            </button>
          </div>
          <div id="filter-form-container">
            <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
              <FormProvider {...methods}>
                <FilterFormInput
                  inputLabel={t("SearchResultsPage.searchQueryLabel")}
                  inputName="searchQuery"
                  hasIcon={true}
                  icon={<MagnifyingGlass />}
                />
                <FilterFormSwitch
                  clearSelected={clearSelected}
                  inputLabel={t("SearchResultsPage.inDemandLabel")}
                  inputName="inDemand"
                  inputChecked={inDemand}
                />
                <FilterFormInput
                  inputLabel={t("SearchResultsPage.maxCostLabel")}
                  inputName="maxCost"
                  hasIcon={true}
                  icon={<CurrencyDollar />}
                />
                <FilterFormSingleDD
                  inputName="county"
                  inputLabel={t("SearchResultsPage.countyLabel")}
                  options={COUNTIES}
                  placeholder="Choose a county"
                />
                <FilterFormCheckGroup
                  clearSelected={clearSelected}
                  inputName="classFormat"
                  inputLabel={t("SearchResultsPage.classFormatLabel")}
                  options={classFormatList}
                  defaultValues={classFormat}
                />
                <div className="field-group">
                  <div className="label-container zip-label">
                    <label>
                      Distance from ZIP code
                    </label>
                  </div>
                  <div className="zip-miles-group">
                    <FilterFormInput
                      inputName="miles"
                      inputType="number"
                      placeholder="miles"
                    />
                    <div className="conjunction-container">
                      from
                    </div>
                    <FilterFormInput
                      inputName="zipcode"
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
                <FilterFormMultiDD
                  clearSelected={clearSelected}
                  inputLabel={t("SearchResultsPage.completeInLabel")}
                  inputName="completeIn"
                  options={completeInList}
                  defaultValues={completeIn}
                  placeholder="Time to Complete"
                />
                <FilterFormMultiDD
                  clearSelected={clearSelected}
                  inputLabel={t("SearchResultsPage.languagesLabel")}
                  inputName="languages"
                  options={languageList}
                  defaultValues={languages}
                  placeholder="Languages"
                />
                <FilterFormMultiDD
                  clearSelected={clearSelected}
                  inputLabel={t("SearchResultsPage.servicesLabel")}
                  inputName="services"
                  options={serviceList}
                  defaultValues={services}
                  placeholder="Languages"
                />
                <FilterFormInput
                  inputLabel={t("SearchResultsPage.cidCodeLabel")}
                  inputName="cipCode"
                  placeholder="##.####"
                  subLabel={t("SearchResultsPage.cipCodeSubLabel")}
                />
                <FilterFormInput
                  inputLabel={t("SearchResultsPage.socCodeLabel")}
                  inputName="socCode"
                  placeholder="##-####"
                  subLabel={t("SearchResultsPage.socCodeSubLabel")}
                />
                <div id="drawer-btn-container" className="row">
                  <button type="submit" id="submit-button">Apply</button>
                  <button type="reset" id="reset-button">Clear Filters</button>
                </div>
              </FormProvider>
            </form>
          </div>
        </div>
      </Drawer>
    </StrictMode>
  )
}