import { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";

import { FunnelSimple } from "@phosphor-icons/react";

interface Props {
  searchQuery?: string;
  miles?: string;
  zip?: string;
}

export const FilterDrawer = ({
}: Props): ReactElement => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
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
    </>
  )
};