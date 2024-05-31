import { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { FunnelSimple, X } from "@phosphor-icons/react";
import { Drawer, useMediaQuery } from "@material-ui/core";


export const FilterDrawer = (): ReactElement => {
  const { t } = useTranslation();
  const mobile = useMediaQuery("(max-width:767px)");
  const [open, setOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setOpen(!open);
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
        </div>
      </Drawer>
    </>
  )
}