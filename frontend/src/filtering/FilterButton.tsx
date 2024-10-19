import { ReactElement} from "react";
import { FunnelSimple } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

interface Props {
  toggleDrawer: () => void;
}

export const FilterButton = ({
  toggleDrawer
}: Props): ReactElement<Props> => {
  const { t } = useTranslation();
  return (
    <div id="filter-button-container">
      <button
        onClick={toggleDrawer}
      >
        {t("SearchResultsPage.filtersButton")} <FunnelSimple />
      </button>
    </div>
  )
}