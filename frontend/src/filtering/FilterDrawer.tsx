import { ReactElement, useState, StrictMode } from "react";
import { navigate } from "@reach/router";
import { FormProvider, useForm } from "react-hook-form";
import { Drawer, useMediaQuery } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { CurrencyDollar, MagnifyingGlass, X } from "@phosphor-icons/react";

import { FilterButton } from "./FilterButton";
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
  const [open, setOpen] = useState(false);

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

  const { handleSubmit, setValue } = methods;

  const onSubmit = (data: Props) => {
    console.log(data);
    
    const {
      searchQuery,
      inDemand,
      maxCost,
      county,
      classFormat,
      miles,
      zipcode,
      completeIn,
      languages,
      services,
      cipCode,
      socCode
     } = data;

    const urlParams = new URLSearchParams(window.location.search);
    searchQuery ? urlParams.set("q", searchQuery) : urlParams.delete("q");
    inDemand ? urlParams.set("inDemand", inDemand.toString()) : urlParams.delete("inDemand");
    maxCost ? urlParams.set("maxCost", maxCost) : urlParams.delete("maxCost");
    county ? urlParams.set("county", county) : urlParams.delete("county");
    classFormat && classFormat.length > 0 ? urlParams.set("format", classFormat.join(",")) : urlParams.delete("format");
    miles ? urlParams.set("miles", miles) : urlParams.delete("miles");
    zipcode ? urlParams.set("zipcode", zipcode) : urlParams.delete("zipcode");
    completeIn && completeIn.length > 0 ? urlParams.set("completeIn", completeIn.join(",")) : urlParams.delete("completeIn");
    languages && languages.length > 0 ? urlParams.set("languages", languages.join(",")) : urlParams.delete("languages");
    services && services.length > 0 ? urlParams.set("services", services.join(",")) : urlParams.delete("services");
    cipCode ? urlParams.set("cip", cipCode) : urlParams.delete("cip");
    socCode ? urlParams.set("soc", socCode) : urlParams.delete("soc");

    const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    navigate(newUrl);
    window.location.reload();

    toggleDrawer();
  }

  const onReset = () => {
    setValue("inDemand", false);
    setValue("maxCost", "");
    setValue("county", "");
    setValue("classFormat", []);
    setValue("miles", "");
    setValue("zipcode", "");
    setValue("completeIn", []);
    setValue("languages", []);
    setValue("services", []);
    setValue("cipCode", "");
    setValue("socCode", "");
    setClearSelected(true);
    setTimeout(() => {
      setClearSelected(false);
    }, 50);
  }

  return (
    <StrictMode>
      <FilterButton toggleDrawer={toggleDrawer} />
      <Drawer
        anchor={mobile ? "bottom" : "left"}
        open={open}
        onClose={toggleDrawer}
      >
        <div id="drawer-container" role="form">
          <div id="drawer-header">
            <h2>Add Filters</h2>
            <button
              className="close-button"
              onClick={toggleDrawer}
            >
              <X aria-label="close form" />
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
                  placeholder={t("SearchResultsPage.searchQueryPlaceholder")}
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
                  placeholder={t("SearchResultsPage.maxCostPlaceholder")}
                />
                <FilterFormSingleDD
                  clearSelected={clearSelected}
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