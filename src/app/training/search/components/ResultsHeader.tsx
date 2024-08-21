import { FormInput } from "@components/modules/FormInput";
import { Heading } from "@components/modules/Heading";
import { decodeUrlEncodedString } from "@utils/decodeUrlEncodedString";
import { useEffect, useState } from "react";

export const ResultsHeader = ({
  count,
  query,
  defaultSort,
}: {
  count: number;
  query: string;
  defaultSort?: string;
}) => {
  const [sortValue, setSortValue] = useState(defaultSort);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setSortValue(urlParams.get("sort") || "");
    }
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (typeof window !== "undefined") {
      const q = new URL(window.location.href);
      const searchParams = q.searchParams;
      if (e.target.value === "") {
        searchParams.delete("sort");
        const newUrlWithSort = searchParams.toString();
        window.location.href = `/training/search?${newUrlWithSort}`;
      } else {
        const newUrlWithSort = new URLSearchParams(searchParams);
        newUrlWithSort.set("sort", e.target.value);
        window.location.href = `/training/search?${newUrlWithSort}`;
      }
    }
  };

  return (
    <div className="resultsHeader">
      <Heading level={2} className="resultsCount">
        {count === 0 && (query === "undefined" || query === "null") ? (
          <>Find Training</>
        ) : (
          <>
            {count} {count === 1 ? "result" : "results"} found for &quot;
            {decodeUrlEncodedString(query)}&quot;
          </>
        )}
      </Heading>

      {count > 0 && (
        <div className="sortBy">
          <FormInput
            label="Sort By"
            type="select"
            defaultValue={sortValue}
            inputId="sortBy"
            onChangeSelect={handleSortChange}
            options={[
              {
                key: "Best Match",
                value: "",
              },
              {
                key: "Cost: Low to High",
                value: "low",
              },
              {
                key: "Cost: High to Low",
                value: "high",
              },
              {
                key: "Employment Rate",
                value: "rate",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};
