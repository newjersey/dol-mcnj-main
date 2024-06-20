import { useState } from "react";
import { Drawer, useMediaQuery } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { FunnelSimple } from "@phosphor-icons/react";

export const FilterDrawer = () => {
  const mobile = useMediaQuery("(max-width:640px)");
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

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
      </Drawer>
    </>
  )
}