import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@reach/router";
import { FormProvider, useForm } from "react-hook-form";
import { Drawer } from "@material-ui/core";

import { CurrencyDollar, FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";

import { FilterInput } from "./FilterInput";

interface Props {
  setLoading: Dispatch<SetStateAction<boolean>>;
  searchQuery?: string;
  inDemand?: boolean;
  maxCost?: string;
  miles?: string;
  zipCode?: string;
  cipCode?: string;
  socCode?: string;
}

export const FilterDrawer = ({
  setLoading,
  searchQuery,
  maxCost,
  miles,
  zipCode,
}: Props): ReactElement => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  }

  const methods = useForm<Props>({
    defaultValues: {
      searchQuery,
      maxCost,
      miles,
      zipCode,
    }
  });
  
  const { handleSubmit, getValues } = methods;

  const onSubmit = () => {
    const {
      searchQuery,
      maxCost,
      miles,
      zipCode
    } = getValues();
    setLoading(true);
    const newUrl = new URL(window.location.href);
    if (searchQuery) newUrl.searchParams.set("q", searchQuery);
    if (maxCost) newUrl.searchParams.set("maxCost", maxCost);
    if (miles) newUrl.searchParams.set("miles", miles);
    if (zipCode) newUrl.searchParams.set("zipCode", zipCode);
    const newSearchParams = newUrl.toString();
    console.log(newSearchParams)
    navigate(newSearchParams);
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
        <div id="filter-drawer">
          <div id="filter-drawer-heading">
            <h2>Add Filters</h2>
            <button
              onClick={toggleDrawer}
            >
              <X />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div id="filter-drawer-content">
              <FormProvider {...methods}>
                <div>
                  <FilterInput
                    inputLabel="Search by training, provider, certification, SOC code, or keyword"
                    inputName="searchQuery"
                    placeholder="Search Query"
                    hasIcon={true}
                    icon={<MagnifyingGlass />}
                  />
                  <FilterInput
                    inputLabel="Max Cost"
                    inputName="maxCost"
                    hasIcon={true}
                    icon={<CurrencyDollar />}
                  />
                  <div className="field-group">
                    <div className="label-container">
                      <label>
                        Distance from ZIP code
                      </label>
                    </div>
                    <div className="zip-miles-group">
                      <FilterInput
                        inputName="miles"
                        inputType="text"
                      />
                      <div className="conjunction-container">
                        from
                      </div>
                      <FilterInput
                        inputName="zipCode"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <button type="submit">Apply Filters</button>
                  <button type="reset">Clear Filters</button>
                </div>
              </FormProvider>
            </div>
          </form>
        </div>
      </Drawer>
    </>
  )
};