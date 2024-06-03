import { ReactElement, useState } from "react";
import { navigate } from "@reach/router";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";
import { Drawer, useMediaQuery } from "@material-ui/core";

import { FilterFormInput } from "./FilterFormInput";

interface Props {
  searchQuery: string;
  miles?: number;
  zipcode?: string;
}

interface FormProps {
  searchQuery: string;
  miles?: number;
  zipcode?: string;
}

export const FilterDrawer = ({
  searchQuery,
  miles = 0,
  zipcode = ""
}: Props): ReactElement => {
  const { t } = useTranslation();
  const mobile = useMediaQuery("(max-width:767px)");
  const [open, setOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const methods = useForm<Props>({
    defaultValues: {
      searchQuery,
      miles,
      zipcode
    }
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: FormProps) => {
    console.log(data);

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("q", data.searchQuery);
    if (data.miles && data.miles > 0) urlParams.set("miles", data.miles?.toString() || "");
    if (data.zipcode) urlParams.set("zipcode", data.zipcode || "");
    console.log(window.location)
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
        // onClose={toggleDrawer}
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
                        inputName="zipcode"
                      />
                    </div>
                  </div>
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