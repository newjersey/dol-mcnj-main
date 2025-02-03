import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { AlertBar } from "../components/AlertBar";

export const SearchTips = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <div className="mbm mtm" data-testid="searchTips">
      <AlertBar
        type="info"
        heading={t("SearchResultsPage.searchTipsHeading")}
        toggle
        copy={t("SearchResultsPage.searchTTipsContent")}
      />
    </div>
  );
};
