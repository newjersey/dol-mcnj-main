import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Drawer, useMediaQuery } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";

import { FilterFormInput } from "./FilterInput";

interface Props {
  searchQuery?: string;
}

export const FilterDrawer = ({
  searchQuery
}: Props) => {
  const mobile = useMediaQuery("(max-width:640px)");
  const { t } = useTranslation();

  const [open, setOpen] = useState(true);

  const toggleDrawer = () => setOpen(!open);

  const methods = useForm<Props>({
    defaultValues: {
      searchQuery: searchQuery || ""
    }
  })

  const { handleSubmit } = methods;

  const onSubmit = (data: Props) => {
    console.log(data);
  }

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
        // onClose={toggleDrawer}
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormProvider {...methods}>
                <div className="field-group">
                  <FilterFormInput
                    inputLabel={t("SearchResultsPage.searchQueryLabel")}
                    inputName="searchQuery"
                    hasIcon={true}
                    icon={<MagnifyingGlass />}
                  />
                </div>
                <div id="drawer-btn-container" className="row">
                  <button type="submit" id="submit-button">Apply</button>
                  <button type="reset" id="reset-button">Clear Filters</button>
                </div>
              </FormProvider>
            </form>
          </div>
        </div>
      </Drawer>
    </>
  )
}