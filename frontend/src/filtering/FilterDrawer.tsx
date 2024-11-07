import { ReactElement, useState, StrictMode, useEffect } from "react";
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
  serviceList,
} from "./filterLists";
import { Chip } from "./Chip";

interface ArrayProps {
  id: string;
  label: string;
  values?: number[];
}

export interface ChipProps {
  id: string;
  title: string;
  label: string;
  value: string;
}
interface Props {
  searchQuery?: string;
  cipCode?: string;
  classFormat?: string[];
  county?: string;
  completeIn?: string[] | ArrayProps[];
  inDemand?: boolean;
  languages?: string[] | ArrayProps[];
  maxCost?: string;
  miles?: string;
  services?: string[] | ArrayProps[];
  socCode?: string;
  zipcode?: string;
  chips?: {
    id: string;
    title: string;
    label: string;
    value: string;
  }[];
  allFilterFields?: Props;
}

const extractIds = (arr: ArrayProps[]): string[] => arr.map(({ id }) => id);

export const FilterDrawer = (props: Props): ReactElement<Props> => {
  const {
    chips,
    cipCode = "",
    classFormat,
    completeIn,
    county,
    inDemand,
    languages,
    maxCost = "",
    miles = "",
    searchQuery = "",
    services,
    socCode = "",
    zipcode = "",
  } = props;

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
      zipcode,
    },
  });

  const { handleSubmit, setValue } = methods;

  const onSubmit = (data: Props) => {
    console.log({ data });
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
      socCode,
    } = data;

    const urlParams = new URLSearchParams(window.location.search);

    let completeInList, languagesList, servicesList;

    searchQuery ? urlParams.set("q", searchQuery) : urlParams.delete("q");
    inDemand ? urlParams.set("inDemand", inDemand.toString()) : urlParams.delete("inDemand");
    maxCost ? urlParams.set("maxCost", maxCost) : urlParams.delete("maxCost");
    county ? urlParams.set("county", county) : urlParams.delete("county");
    classFormat && classFormat.length > 0
      ? urlParams.set("format", classFormat.join(","))
      : urlParams.delete("format");
    miles ? urlParams.set("miles", miles) : urlParams.delete("miles");
    zipcode ? urlParams.set("zipcode", zipcode) : urlParams.delete("zipcode");

    if (completeIn) {
      completeInList = extractIds(completeIn as ArrayProps[]);
      console.log({ completeInList });

      if (typeof completeIn[0] === "string") {
        urlParams.set("completeIn", completeIn.join(","));
      } else {
        completeInList?.length > 0
          ? urlParams.set("completeIn", completeInList.join(","))
          : urlParams.delete("completeIn");
      }
    }

    if (languages) {
      languagesList = extractIds(languages as ArrayProps[]);
      console.log({ languages, languagesList, typeof: typeof languages[0] });

      if (typeof languages[0] === "string") {
        urlParams.set("languages", languages.join(","));
      } else if (typeof languages[0] === "object") {
        languagesList?.length > 0
          ? urlParams.set("languages", languagesList.join(","))
          : urlParams.delete("languages");
      } else {
        urlParams.delete("languages");
      }
    }

    if (services) {
      servicesList = extractIds(services as ArrayProps[]);

      if (typeof services[0] === "string") {
        urlParams.set("services", services.join(","));
      } else {
        servicesList?.length > 0
          ? urlParams.set("services", servicesList.join(","))
          : urlParams.delete("services");
      }
    }

    cipCode ? urlParams.set("cip", cipCode) : urlParams.delete("cip");
    socCode ? urlParams.set("soc", socCode) : urlParams.delete("soc");

    const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    navigate(newUrl);
    window.location.reload();

    console.log({ newUrl });

    toggleDrawer();
  };

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
  };

  useEffect(() => {
    // convert props to an array of objects,
  }, []);

  return (
    <StrictMode>
      <div className="filter-drawer">
        <div className="filter-button-row">
          <form
            className="usa-search usa-search--small"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const urlParams = new URLSearchParams(window.location.search);
              const filteredParams = new URLSearchParams(
                Array.from(urlParams).filter(([key]) => key !== "q"),
              );
              window.location.href = `${window.location.origin}${window.location.pathname}?q=${form.search.value}&${filteredParams.toString()}`;
            }}
          >
            <input
              className="usa-input"
              type="search"
              placeholder="search"
              defaultValue={searchQuery}
              name="search"
            />
            <button className="usa-button" type="submit">
              <MagnifyingGlass weight="bold" />
            </button>
          </form>
          <FilterButton toggleDrawer={toggleDrawer} count={chips?.length} />
        </div>
        {chips && chips.length > 0 && (
          <div className="chip-container">
            <div className="chips">
              {chips.map((chip, index) => (
                <Chip key={chip.id + index} {...chip} />
              ))}
              <button
                className="clear-filters-button"
                onClick={() => {
                  window.location.href =
                    window.location.origin + window.location.pathname + "?q=" + searchQuery;
                }}
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
      <Drawer
        className="search-drawer"
        anchor={mobile ? "bottom" : "left"}
        open={open}
        onClose={toggleDrawer}
      >
        <div id="drawer-container" role="form">
          <div id="drawer-header">
            <h2>
              <strong>{t("SearchResultsPage.addFiltersLabel")}</strong>
            </h2>
            <button className="close-button" onClick={toggleDrawer}>
              <X aria-label="close form" />
            </button>
          </div>
          <div id="filter-form-container">
            <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
              <FormProvider {...methods}>
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
                    <label>{t("SearchAndFilter.locationFilterLabel")}</label>
                  </div>
                  <div className="zip-miles-group">
                    <FilterFormInput
                      inputName="miles"
                      inputType="number"
                      placeholder={t("SearchAndFilter.locationFilterMilesInputLabel")}
                    />
                    <div className="conjunction-container">from</div>
                    <FilterFormInput
                      inputName="zipcode"
                      placeholder={t("SearchAndFilter.locationFilterZipCodePlaceholder")}
                    />
                  </div>
                </div>
                <FilterFormMultiDD
                  clearSelected={clearSelected}
                  inputLabel={t("SearchResultsPage.completeInLabel")}
                  inputName="completeIn"
                  options={completeInList}
                  defaultValues={completeIn as string[]}
                  placeholder={t("SearchResultsPage.completeInLabel")}
                />
                <FilterFormMultiDD
                  clearSelected={clearSelected}
                  inputLabel={t("SearchResultsPage.languagesLabel")}
                  inputName="languages"
                  options={languageList}
                  defaultValues={languages as string[]}
                  placeholder={t("SearchResultsPage.languagesLabel")}
                />
                <FilterFormMultiDD
                  clearSelected={clearSelected}
                  inputLabel={t("SearchResultsPage.servicesLabel")}
                  inputName="services"
                  options={serviceList}
                  defaultValues={services as string[]}
                  placeholder={t("SearchResultsPage.servicesLabel")}
                />
                <FilterFormInput
                  inputLabel={t("SearchResultsPage.cidCodeLabel")}
                  inputName="cipCode"
                  defaultValue={cipCode}
                  placeholder="##.####"
                  subLabel={t("SearchResultsPage.cipCodeSubLabel")}
                />
                <FilterFormInput
                  inputLabel={t("SearchResultsPage.socCodeLabel")}
                  inputName="socCode"
                  defaultValue={socCode}
                  placeholder="##-####"
                  subLabel={t("SearchResultsPage.socCodeSubLabel")}
                />
                <div id="drawer-btn-container">
                  <button type="submit" id="submit-button">
                    {t("SearchAndFilter.applyFiltersButtontText")}
                  </button>
                  <button type="reset" id="reset-button">
                    {t("SearchAndFilter.clearAllFiltersButtonLabel")}
                  </button>
                </div>
              </FormProvider>
            </form>
          </div>
        </div>
      </Drawer>
    </StrictMode>
  );
};
