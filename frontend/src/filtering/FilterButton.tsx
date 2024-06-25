import { ReactElement, useEffect, useState } from "react";
import { FunnelSimple } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

interface Props {
  toggleDrawer: () => void;
}

export const FilterButton = ({
  toggleDrawer
}: Props): ReactElement<Props> => {
  const { t } = useTranslation();

  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsFloating(true);
      } else {
        setIsFloating(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div id="filter-button-container">
      <button
        onClick={toggleDrawer}
        className={isFloating ? "floating" : ""}
      >
        {t("SearchResultsPage.filtersButton")} <FunnelSimple />
      </button>
    </div>
  )
}