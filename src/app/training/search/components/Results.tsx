"use client";
import { ResultCard } from "@components/modules/ResultCard";
import { Filter } from "./Filter";
import { FetchResultsProps, ResultProps } from "@utils/types";
import { createContext, useEffect, useState } from "react";
import { getPercentEmployed } from "@utils/outcomeHelpers";
import { ResultsHeader } from "./ResultsHeader";
import { CompareTable } from "./CompareTable";
import { SEARCH_RESULTS_PAGE_DATA as pageContent } from "@data/pages/training/search";
import { Pagination } from "@components/modules/Pagination";
import { Alert } from "@components/modules/Alert";
import { ParamTags } from "./ParamTags";
import { SupportedLanguages } from "@utils/types/types";

export interface FilterProps {
  searchQuery?: string;
  miles?: string;
  zipCode?: string[];
  county?: string;
  inDemand?: boolean;
  totalCost?: number;
  cipCode?: string;
  online?: "true" | "false";
  completionTime?: number[];
  isWheelchairAccessible?: boolean;
  hasJobPlacementAssistance?: boolean;
  hasChildcareAssistance?: boolean;
  hasEveningCourses?: boolean;
  languages?: string[];
  socCode?: string;
}

export interface ContextProps {
  compare: ResultProps[];
  extractParam: (param: string) => string | null;
  itemsPerPage: string;
  lang: SupportedLanguages;
  results: FetchResultsProps;
  searchTerm: string;
  setCompare: (compare: ResultProps[]) => void;
  setItemsPerPage: (itemsPerPage: string) => void;
  setResults: (results: FetchResultsProps) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSortValue: (sortValue: string) => void;
  setToggle: (toggle: boolean) => void;
  sortValue: string;
  toggle: boolean;
}

export const ResultsContext = createContext<ContextProps>({} as ContextProps);

const Results = ({
  items,
  query,
  searchParams,
  count,
  totalPages = 1,
  page,
  lang = "en",
}: {
  query?: string;
  searchParams: any;
  items: ResultProps[];
  totalPages: number;
  lang?: SupportedLanguages;
  count: number;
  page: number;
}) => {
  const extractParam = (param: string) => {
    const q = new URLSearchParams(searchParams);
    return q.get(param);
  };

  const [compare, setCompare] = useState<ResultProps[]>([]);
  const [toggle, setToggle] = useState(extractParam("toggle") === "true");
  const [searchTerm, setSearchTerm] = useState<string>(extractParam("q") || "");
  const [sortValue, setSortValue] = useState(extractParam("sort") || "");
  const [itemsPerPage, setItemsPerPage] = useState(extractParam("limit") || "");
  const [results, setResults] = useState<FetchResultsProps>({
    itemCount: count,
    pageData: items,
    pageNumber: page,
    searchParams,
    searchParamsArray: [],
    totalPages: totalPages,
  });

  useEffect(() => {
    if (toggle && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [toggle]);

  return (
    <ResultsContext.Provider
      value={{
        compare,
        extractParam,
        itemsPerPage,
        lang,
        results,
        searchTerm,
        setCompare,
        setItemsPerPage,
        setResults,
        setSearchTerm,
        setSortValue,
        setToggle,
        sortValue,
        toggle,
      }}
    >
      {compare.length > 0 && <CompareTable />}

      <ResultsHeader />
      {results.searchParams && searchTerm !== "" && <ParamTags />}
      <div className="inner">
        <Filter />

        <div className={`results${toggle ? "" : " wide"}`} id="results">
          <>
            {results.pageData.length === 0 && !query && page === 1 ? (
              <Alert {...pageContent.en.searchHelp} />
            ) : results.pageData.length <= 3 && page === 1 ? (
              <Alert {...pageContent.en.searchHelp} />
            ) : (
              <></>
            )}

            {results.pageData.map((item: ResultProps) => (
              <ResultCard
                key={item.id}
                title={item.name}
                trainingId={item.id}
                cipDefinition={item.cipDefinition}
                cost={item.totalCost}
                description={item.highlight}
                percentEmployed={getPercentEmployed(item.outcomes)}
                education={item.providerName}
                timeToComplete={item.calendarLength}
                location={`${item.city}, ${item.county}`}
                inDemandLabel={item.inDemand ? "In Demand" : undefined}
                url={`/training/${item.id}`}
                compare
                disableCompare={
                  !compare.find((com) => com.id === item.id) &&
                  compare.length === 3
                }
                onCompare={(trainingId) => {
                  if (compare.find((item) => item.id === trainingId)) {
                    setCompare(
                      compare.filter((item) => item.id !== trainingId)
                    );
                  } else {
                    const item = items.find((item) => item.id === trainingId);
                    if (item) {
                      setCompare([...compare, item]);
                    }
                  }
                }}
              />
            ))}
          </>

          {results.totalPages > 1 && <Pagination />}
        </div>
      </div>
    </ResultsContext.Provider>
  );
};

export { Results };
