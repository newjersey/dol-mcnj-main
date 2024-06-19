import { useTranslation } from "react-i18next";

export const ResultsHeader = ({
  searchQuery,
  metaCount
}:{
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
    <h2  className="text-xl weight-500 pts mbs cutoff-text">
      {!searchQuery || searchQuery === "null" ? (
        t("SearchResultsPage.noSearchTermHeader")
      ) : (
        message
      )}
    </h2>
  )
};