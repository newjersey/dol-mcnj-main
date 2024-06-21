import { useTranslation } from "react-i18next";

export const ResultsHeader = ({
  loading,
  searchQuery,
  metaCount
}:{
  loading: boolean,
  searchQuery: string,
  metaCount: number
}) => {
  const { t } = useTranslation();
  const query = decodeURIComponent(searchQuery.replace(/\+/g, " "));
  const message = t("SearchResultsPage.resultsString", {
    count: metaCount,
    query,
  });

  return (
    <div id="search-header-container">
      <h2 className="text-xl weight-500 pts cutoff-text">
        {!searchQuery || searchQuery === "null" || loading ? (
          t("SearchResultsPage.noSearchTermHeader")
        ) : (
          message
        )}
      </h2>
    </div>
  )
};