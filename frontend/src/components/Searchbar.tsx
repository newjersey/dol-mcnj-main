import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { InputAdornment, Icon } from "@material-ui/core";
import { PrimaryButton } from "./PrimaryButton";
import { Input } from "./Input";
import { SearchAndFilterStrings } from "../localizations/SearchAndFilterStrings";

interface Props {
  onSearch: (searchQuery: string) => void;
  initialValue?: string;
  stacked?: boolean;
  smallButton?: boolean;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

export const Searchbar = (props: Props): ReactElement<Props> => {
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      <div className={`${marginDirection} ${buttonWidth}`}>
        <PrimaryButton variant="contained" onClick={(): void => props.onSearch(searchQuery)}>
          {props.buttonText ? props.buttonText : SearchAndFilterStrings.searchButtonDefaultText}
        </PrimaryButton>
      </div>
    </div>
  );
};
