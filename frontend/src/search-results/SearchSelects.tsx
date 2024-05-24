import { ChangeEvent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  handleSortChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLimitChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  itemsPerPage: number;
  sortBy: "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match" | undefined;
}

const limitOptions = [
  "10",
  "25",
  "50",
  "100"
];

export const SearchSelects = ({
  handleSortChange,
  handleLimitChange,
  itemsPerPage,
  sortBy
}: Props) : ReactElement<Props> => {
  const { t } = useTranslation();
  const [limit, setLimit] = useState<number>(itemsPerPage);
  const [sortByValue, setSortByValue] = useState<"asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match" | undefined>(sortBy);

  const sortOptions = [
    { value: "best_match", label: t("SearchAndFilter.sortByBestMatch") },
    { value: "asc", label: "A-Z" },
    { value: "desc", label: "Z-A" },
    { value: "price_asc", label: t("SearchAndFilter.sortByCostLowToHigh") },
    { value: "price_desc", label: t("SearchAndFilter.sortByCostHighToLow") },
    { value: "EMPLOYMENT_RATE", label: t("SearchAndFilter.sortByEmploymentRate") },
  ];

  const handleSortBy = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortByValue(event.target.value as "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match");
    handleSortChange(event);
  };

  const handleLimit = (event: ChangeEvent<HTMLSelectElement>) => {
    setLimit(parseInt(event.target.value));
    handleLimitChange(event);
  };

  return (
    <div>
      <div>
        <label className="usa-label" htmlFor="per-page">
          {t("SearchAndFilter.sortByLabel")}
        </label>
        <select
          className="usa-select"
          name="per-page"
          id="per-page"
          defaultValue={sortByValue}
          onChange={handleSortBy}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="usa-label" htmlFor="per-page">
          Results per page
        </label>
        <select
          className="usa-select"
          name="per-page"
          defaultValue={limit}
          id="per-page"
          onChange={handleLimit}
        >
          {limitOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  )
}