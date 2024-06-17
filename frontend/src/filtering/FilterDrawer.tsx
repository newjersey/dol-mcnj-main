import { ReactElement, useState } from "react";
import { navigate } from "@reach/router";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { CurrencyDollar, FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";
import { Drawer, useMediaQuery } from "@material-ui/core";

import { FilterFormInput } from "./FilterFormInput";
import { FilterFormMultiDD } from "./FilterFormMultiDD";
import { FilterFormSingleDD } from "./FilterFormSingleDD";
import { FilterFormSwitch } from "./FilterFormSwitch";

import {
  completeInList,
  languageList
} from "./filterLists";
import { COUNTIES } from "./newJerseyCounties";

interface Props {
  searchQuery: string;
  cipCode?: string;
  completeIn?: string[];
  county?: string;
  inDemand?: boolean;
  languages?: string[];
  maxCost?: number;
  miles?: number;
  socCode?: string;
  zipcode?: string;
}

interface ObjProps {
  id: string;
  label: string;
  values?: number[];
}
interface FormProps {
  searchQuery: string;
  cipCode?: string;
  completeIn?: (string | ObjProps)[];
  county?: string;
  inDemand?: boolean;
  languages?: (string | ObjProps)[];
  maxCost?: number;
  miles?: number;
  socCode?: string;
  zipcode?: string;
}

export const FilterDrawer = ({
  searchQuery,
  cipCode,
  completeIn,
  county,
  inDemand,
  languages,
  maxCost,
  miles,
  socCode,
  zipcode
}: Props): ReactElement => {
  const { t } = useTranslation();
  const mobile = useMediaQuery("(max-width:767px)");
  const [open, setOpen] = useState<boolean>(false);

  const cipDeci = cipCode?.replace(/(\d{2})/, "$1.")

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const methods = useForm<FormProps>({
    defaultValues: {
      searchQuery,
      cipCode: cipDeci,
      completeIn,
      county,
      inDemand,
      languages,
      maxCost,
      miles,
      socCode,
      zipcode
    }
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: FormProps) => {
    console.log({data})
    const {
      searchQuery,
      cipCode,
      completeIn,
      county,
      inDemand,
      languages,
      maxCost,
      miles,
      socCode,
      zipcode
    } = data;

    console.log(completeIn)

    let completeInArr: string[] = [];
    let langArr: string[] = [];

    if (completeIn && completeIn.length > 0 && typeof completeIn !== "string") {
      completeInArr = completeIn.map((item: ObjProps | string) => typeof item !== "string" ? item.id : item);

      console.log(completeInArr)
    }

    if (languages && languages.length > 0) {
      langArr = languages.map((item: ObjProps | string) => typeof item !== "string" ? item.id : item);

      console.log(langArr)
    }

    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams)
    urlParams.set("q", searchQuery);
    cipCode ? urlParams.set("cip", cipCode) : urlParams.delete("cip");
    completeInArr.length > 0 ? urlParams.set("completeIn", completeInArr.join(",")) : urlParams.delete("completeIn");
    county && county.length > 0 ? urlParams.set("county", county) : urlParams.delete("county");
    inDemand ? urlParams.set("inDemand", inDemand.toString()) : urlParams.delete("inDemand");
    langArr.length > 0 ? urlParams.set("languages", langArr.join(",")) : urlParams.delete("languages");
    maxCost ? urlParams.set("maxCost", maxCost.toString()) : urlParams.delete("maxCost");
    miles ? urlParams.set("miles", miles.toString()) : urlParams.delete("miles");
    socCode ? urlParams.set("soc", socCode) : urlParams.delete("soc");
    zipcode ? urlParams.set("zipcode", zipcode) : urlParams.delete("zipcode");

    const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    console.log(newUrl)
    navigate(newUrl);
    window.location.reload();
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
        anchor={mobile ? "bottom" : "left"}
        open={open}
        onClose={toggleDrawer}
      >
        <div id="filter-drawer-container">
          <div className="drawer-header">
            <h2>Add Filters</h2>
            <button
              className="close-button"
              onClick={toggleDrawer}
            >
              <X />
            </button>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onReset={() => reset()}
          >
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
                    inputType="number"
                    hasIcon={true}
                    icon={<CurrencyDollar />}
                    placeholder="max cost"
                  />
                  <FilterFormSingleDD
                    inputLabel="County"
                    inputName="county"
                    options={COUNTIES}
                    placeholder="Choose a county"
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
                    inputLabel="Time to Complete"
                    inputName="completeIn"
                    options={completeInList}
                    defaultValues={completeIn}
                    placeholder="Time to Complete"
                  />
                  <FilterFormMultiDD
                    inputLabel="Languages"
                    inputName="languages"
                    options={languageList}
                    defaultValues={languages}
                    placeholder="Languages"
                  />
                  <FilterFormInput
                    inputLabel="Filter by CIP Code"
                    inputName="cipCode"
                    placeholder="##.####"
                    subLabel="CIP codes are 6-digit codes that identify programs of study."
                  />
                  <FilterFormInput
                    inputLabel="Filter by SOC Code"
                    inputName="socCode"
                    placeholder="##-####"
                    subLabel="SOC codes are 6-digit codes that identify occupations."
                  />
                </div>
                <div id="drawer-btn-container" className="row">
                  <button type="submit" id="submit-button">Apply</button>
                  <button type="reset" id="reset-button">Clear Filters</button>
                </div>
              </FormProvider>
            </div>
          </form>
        </div>
      </Drawer>
    </>
  )
}