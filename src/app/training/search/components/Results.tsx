"use client";
import { ResultCard } from "@components/modules/ResultCard";
import { Filter } from "./Filter";
import { FetchResultsProps, ResultProps } from "@utils/types";
import { createContext, useState } from "react";
import { Button } from "@components/modules/Button";
import { ResultsHeader } from "./ResultsHeader";
import { CompareTable } from "./CompareTable";
import { StarterText } from "./StarterText";
import { HelpText } from "./HelpText";
import { Pagination } from "@components/modules/Pagination";

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
  results: FetchResultsProps;
  setResults: (results: FetchResultsProps) => void;
  compare: ResultProps[];
  setCompare: (compare: ResultProps[]) => void;
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  extractParam: (param: string) => string | null;
  sortValue: string;
  setSortValue: (sortValue: string) => void;
  itemsPerPage: string;
  setItemsPerPage: (itemsPerPage: string) => void;
}

export const ResultsContext = createContext<ContextProps>({} as ContextProps);

const Results = ({
  items,
  query,
  searchParams,
  count,
  totalPages = 1,
  page,
}: {
  query?: string;
  searchParams: any;
  items: ResultProps[];
  totalPages: number;
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

  return (
    <ResultsContext.Provider
      value={{
        results,
        setResults,
        compare,
        setCompare,
        toggle,
        setToggle,
        searchTerm,
        setSearchTerm,
        extractParam,
        sortValue,
        setSortValue,
        itemsPerPage,
        setItemsPerPage,
      }}
    >
      {compare.length > 0 && <CompareTable />}

      <Button
        defaultStyle="secondary"
        iconPrefix="FunnelSimple"
        className="editSearch"
        type="button"
        outlined
        iconSuffix={toggle ? "CaretUp" : "CaretDown"}
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        Edit Search or Filter
      </Button>

      <ResultsHeader />
      <div className="inner">
        <Filter />
        <div className="results" id="results">
          <>
            {results.pageData.length === 0 && !query && page === 1 ? (
              <StarterText />
            ) : results.pageData.length <= 3 && page === 1 ? (
              <HelpText />
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
                percentEmployed={item.percentEmployed}
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
