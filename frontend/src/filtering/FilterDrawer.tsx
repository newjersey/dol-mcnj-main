import { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { FunnelSimple } from "@phosphor-icons/react";


export const FilterDrawer = (): ReactElement => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="filter-button-container">
        <button
          onClick={toggleDrawer}
        >
          {t("SearchResultsPage.filtersButton")} <FunnelSimple />
        </button>
      </div>
    </>
  )
}