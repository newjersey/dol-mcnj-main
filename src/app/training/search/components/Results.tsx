"use client";
import { ResultCard } from "@components/modules/ResultCard";
import { Filter } from "./Filter";
import { CipDefinition, FetchResultsProps, ResultProps } from "@utils/types";
import { useState } from "react";
import { Button } from "@components/modules/Button";
import { ResultsHeader } from "./ResultsHeader";
import { CompareTable } from "./CompareTable";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
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
  const [results, setResults] = useState<FetchResultsProps>({
    itemCount: count,
    pageData: items,
    pageNumber: page,
    searchParams,
    searchParamsArray: [],
    totalPages: totalPages,
  });

  return (
    <>
      <Breadcrumbs
        style={{ marginBottom: "1rem" }}
        crumbs={[
          {
            copy: "Home",
            url: "/",
          },
          {
            copy: "Training Explorer",
            url: "/training",
          },
        ]}
        pageTitle="Search"
      />
      {compare.length > 0 && (
        <CompareTable items={compare} setCompare={setCompare} />
      )}

      <Button
        defaultStyle="secondary"
        iconPrefix="FunnelSimple"
        iconSuffix={toggle ? "CaretUp" : "CaretDown"}
        className="editSearch"
        type="button"
        outlined
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        Edit Search or Filter
      </Button>

      <ResultsHeader
        count={results.itemCount}
        query={`${extractParam("q")}`}
        defaultSort={`${extractParam("sort")}`}
      />

      <div className="inner">
        <Filter
          className={toggle ? "open" : undefined}
          allItems={results.pageData}
          searchParams={searchParams}
          setResults={setResults}
        />

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
                      compare.filter((item) => item.id !== trainingId),
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

          {results.totalPages > 1 && (
            <Pagination
              currentPage={results.pageNumber}
              totalPages={results.totalPages}
              hasPreviousPage={results.pageData.length > 10}
              hasNextPage={results.pageData.length > 10}
            />
          )}
        </div>
      </div>
    </>
  );
};

export { Results };
