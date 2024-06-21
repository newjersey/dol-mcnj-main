import { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@material-ui/core";

export const SearchTips = (): ReactElement => {
  const { t } = useTranslation();

  const [showHelperText, setShowHelperText] = useState<boolean>(false);

  const toggleHelperText = () => {
    setShowHelperText(!showHelperText);
  };

  return (
    <div className="mbm" data-testid="searchTips">
      <p>{t("SearchResultsPage.searchTips1")}</p>
      <p>Check your spelling to ensure it is correct.</p>
      <p>Verify and adjust any filters that you might have applied to your search.</p>
      <p>{t("SearchResultsPage.searchTips2")}</p>
      <p>{t("SearchResultsPage.searchTips3")}</p>

      <button className="fin fac paz link-format-blue" onClick={toggleHelperText}>
        {showHelperText ? t("SearchResultsPage.seeLessText") : t("SearchResultsPage.seeMoreText")}
        <Icon>{showHelperText ? "keyboard_arrow_up" : "keyboard_arrow_right"}</Icon>
      </button>

      {showHelperText && (
        <div>
          <p>{t("SearchResultsPage.searchHelperText")}</p>
          <p>
            <span className="bold">{t("SearchResultsPage.boldText1")}&nbsp;</span>
            {t("SearchResultsPage.helperText1")}
          </p>
          <p>
            <span className="bold">{t("SearchResultsPage.boldText2")}&nbsp;</span>
            {t("SearchResultsPage.helperText2")}
          </p>
          <p>
            <span className="bold">{t("SearchResultsPage.boldText3")}&nbsp;</span>
            {t("SearchResultsPage.helperText3")}
          </p>
        </div>
      )}
    </div>
  )
};