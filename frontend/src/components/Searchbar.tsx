import React, { ChangeEvent, ReactElement, useEffect, useState, useContext } from "react";
import { InputAdornment, Icon } from "@material-ui/core";
import { Input } from "./Input";
import { FilterActionType, FilterContext } from "../filtering/FilterContext";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";
interface Props {
  onSearch: (searchQuery: string) => void;
  initialValue?: string;
  stacked?: boolean;
  buttonText?: string;
  placeholder?: string;
  className?: string;
  isLandingPage?: boolean;
}

const INPUT_PROPS = {
  "aria-label": "search",
  style: {
    padding: "6px 10px",
  },
};

export const Searchbar = (props: Props): ReactElement<Props> => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { dispatch } = useContext(FilterContext);

  useEffect(() => {
    if (props.initialValue) {
      setSearchQuery(props.initialValue as string);
    }
  }, [props.initialValue]);

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete("q");
      const newUrlString = `/training/search?q=${encodeURIComponent(searchQuery)}${
        urlParams.toString() !== "" ? `&${urlParams.toString()}` : ""
      }`;
      window.location.href = newUrlString;
    }
  };

  const handleClearAll = (): void => {
    dispatch({ type: FilterActionType.REMOVE_ALL });
    const urlParams = new URLSearchParams(window.location.search);
    const queryString = urlParams.get("q");

    window.location.href = `/training/search?q=${queryString}`;
  };

  const flexDirection = props.stacked ? "fdc" : "fdr";
  const marginDirection = props.stacked ? "mtd" : "mld";

  return (
    <div className={`${flexDirection} fac ${props.className}`}>
      <Input
        inputProps={INPUT_PROPS}
        value={searchQuery !== "null" ? searchQuery : ""}
        onChange={handleSearchInput}
        onKeyDown={handleKeyDown}
        startAdornment={
          <InputAdornment position="start">
            <Icon>search</Icon>
          </InputAdornment>
        }
        placeholder={
          props.placeholder
            ? props.placeholder
            : t("SearchAndFilter.searchBarDefaultPlaceholderText")
        }
      />
      <div className={`${marginDirection} button-size-full fdc fac`}>
        <Button
          variant="primary"
          className="width-full"
          onClick={() => {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.delete("q");
            const newUrlString = `/training/search?q=${encodeURIComponent(searchQuery)}${
              urlParams.toString() !== "" ? `&${urlParams.toString()}` : ""
            }`;
            window.location.href = newUrlString;
          }}
        >
          {props.buttonText ? props.buttonText : t("SearchAndFilter.searchButtonDefaultText")}
        </Button>

        {props.isLandingPage !== true && (
          <Button variant="outline" className="width-full mvs" onClick={handleClearAll}>
            {t("SearchAndFilter.clearAllFiltersButtonLabel")}
          </Button>
        )}
      </div>
    </div>
  );
};
