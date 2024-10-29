import { ReactElement } from "react";
import { FunnelSimple } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

interface Props {
  count?: number;
  toggleDrawer: () => void;
}

export const FilterButton = ({ toggleDrawer, count }: Props): ReactElement<Props> => {
  const { t } = useTranslation();
  return (
    <div id="filter-button-container">
      <button onClick={toggleDrawer}>
        {count
          ? count > 1
            ? `${count} ${t("SearchResultsPage.filtersButtonMultiple")}`
            : `${count} ${t("SearchResultsPage.filtersButtonSingle")}`
          : t("SearchResultsPage.filtersButton")}
        <FunnelSimple />
      </button>
    </div>
  );
};
