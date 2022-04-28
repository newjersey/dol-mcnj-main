import React, { ChangeEvent, ReactElement, useEffect, useState, useContext } from "react";
import { InputAdornment, Icon } from "@material-ui/core";
import { Input } from "./Input";
import { SearchAndFilterStrings } from "../localizations/SearchAndFilterStrings";
import { FilterActionType, FilterContext } from "../filtering/FilterContext";
import { Button } from "./Button";
interface Props {
  onSearch: (searchQuery: string) => void;
  initialValue?: string;
  stacked?: boolean;
  smallButton?: boolean;
  buttonText?: string;
  placeholder?: string;
  className?: string;
  isLandingPage?: boolean;
}

export const Searchbar = (props: Props): ReactElement<Props> => {
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
      props.onSearch(searchQuery);
    }
  };

  const handleClearAll = (): void => {
    dispatch({ type: FilterActionType.REMOVE_ALL });
  };

  const flexDirection = props.stacked ? "fdc" : "fdr";
  const marginDirection = props.stacked ? "mtd" : "mld";
  const buttonWidth = props.smallButton ? "button-size-small" : "button-size-full";

  return (
    <div className={`${flexDirection} fac ${props.className}`}>
      <Input
        inputProps={{ "aria-label": "search" }}
        value={searchQuery}
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
            : SearchAndFilterStrings.searchBarDefaultPlaceholderText
        }
      />
      <div className={`${marginDirection} ${buttonWidth} fdc fac`}>
        <Button
          variant="primary"
          className="width-full"
          onClick={(): void => props.onSearch(searchQuery)}
        >
          {props.buttonText ? props.buttonText : SearchAndFilterStrings.searchButtonDefaultText}
        </Button>
        {props.isLandingPage !== true && (
          <Button variant="outline" className="width-full mvs" onClick={handleClearAll}>
            {SearchAndFilterStrings.clearAllFiltersButtonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
