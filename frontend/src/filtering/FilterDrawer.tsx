import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@reach/router";
import { FormProvider, useForm } from "react-hook-form";
import { Drawer } from "@material-ui/core";

import { FunnelSimple, X } from "@phosphor-icons/react";

import { FilterInput } from "./FilterInput";

interface Props {
  setLoading: Dispatch<SetStateAction<boolean>>;
  searchQuery?: string;
  inDemand?: boolean;
  miles?: string | undefined;
  zipCode?: string;
  cipCode?: string;
  socCode?: string;
}

export const FilterDrawer = ({
  setLoading,
  searchQuery = "",
  miles,
  zipCode = "",
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
      miles,
      zipCode,
    }
  });
  
  const { handleSubmit, getValues } = methods;

  const onSubmit = () => {
    const {
      searchQuery,
      miles,
      zipCode
    } = getValues();
    setLoading(true);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("q", searchQuery || "");
    newUrl.searchParams.set("p", "1");
    newUrl.searchParams.set("miles", miles || "");
    newUrl.searchParams.set("zipCode", zipCode || "");
    const newSearchParams = newUrl.toString();
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
        <div>
          <div>
            <h2>Add Filters</h2>
            <button
              onClick={toggleDrawer}
            >
              <X />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div id="filter-drawer">
              <FormProvider {...methods}>
                <div>
                  <FilterInput
                    inputLabel="Search Query"
                    inputName="searchQuery"
                    placeholder="Search Query"
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