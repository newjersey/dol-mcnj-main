import { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Drawer } from "@material-ui/core";

import { FunnelSimple } from "@phosphor-icons/react";

export const FilterDrawer = ({}): ReactElement => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div id="filter-drawer">
      <div className="button-container">
        <button
          onClick={toggleDrawer}
        >
          {t("SearchResultsPage.filtersButton")} <FunnelSimple />
        </button>
      </div>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer}
      >
        <div id="filter-drawer">
          Book
        </div>
      </Drawer>
    </div>
  )
};