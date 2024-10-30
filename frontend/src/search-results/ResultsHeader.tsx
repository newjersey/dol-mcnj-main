import { MagnifyingGlass } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export const ResultsHeader = ({
  loading,
  searchQuery,
  metaCount,
}: {
  loading: boolean;
  searchQuery: string;
  metaCount: number;
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
        {loading ? (
          t("SearchResultsPage.loadingHeader")
        ) : (
          <>
            {!searchQuery || searchQuery === "null"
              ? t("SearchResultsPage.noSearchTermHeader")
              : message}
          </>
        )}
      </h2>
      <form
        className="usa-search usa-search--small"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const urlParams = new URLSearchParams(window.location.search);
          const filteredParams = new URLSearchParams(
            Array.from(urlParams).filter(([key]) => key !== "q"),
          );
          window.location.href = `${window.location.origin}${window.location.pathname}?q=${form.search.value}&${filteredParams.toString()}`;
        }}
      >
        <input
          className="usa-input"
          type="search"
          placeholder="search"
          defaultValue={searchQuery}
          name="search"
        />
        <button className="usa-button" type="submit">
          <MagnifyingGlass weight="bold" />
        </button>
      </form>
    </div>
  );
};
