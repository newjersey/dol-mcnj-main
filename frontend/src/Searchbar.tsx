import React, {ChangeEvent, ReactElement, useEffect, useState} from "react";
import {InputAdornment} from "@material-ui/core";
import {PrimaryButton} from "./components/PrimaryButton";
import {Input} from "./components/Input";

interface Props {
  onSearch: (searchQuery: string) => void;
  initialValue?: string;
}

export const Searchbar = (props: Props): ReactElement<Props> => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (props.initialValue) {
      setSearchQuery(props.initialValue as string);
    }
  }, [props.initialValue]);

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value)
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      props.onSearch(searchQuery)
    }
  };

  return (
    <div className="fdr fac">
      <Input
        value={searchQuery}
        onChange={handleSearchInput}
        onKeyDown={handleKeyDown}
        startAdornment={
          <InputAdornment position="start">
            <i className="material-icons">search</i>
          </InputAdornment>
        }
        placeholder="Search for training courses"
      />
      <span className="mld">
        <PrimaryButton
          variant="contained"
          onClick={(): void => props.onSearch(searchQuery)}
        >
          Search
        </PrimaryButton>
      </span>
    </div>
  )
}