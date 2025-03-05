import { useContext } from "react";
import { updateSearchParamsNavigate } from "../../utils/filterFunctions";
import { ResultsContext } from "../Results";
import { getSearchData } from "../../utils/getSearchData";

export const FilterForm = ({ children }: { children: React.ReactNode }) => {
  let { setResults, searchTerm, toggle } = useContext(ResultsContext);
  return (
    <aside id="searchFilter" className={`searchFilter${toggle ? " open" : ""}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateSearchParamsNavigate(
            [
              { key: "q", value: searchTerm },
              { key: "p", value: "1" },
            ],
            getSearchData,
            setResults
          );
        }}
      >
        {children}
      </form>
    </aside>
  );
};
