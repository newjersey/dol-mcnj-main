import React, {ChangeEvent, ReactElement, useState} from "react";
import {InputAdornment} from "@material-ui/core";
import {PrimaryButton} from "./components/PrimaryButton";
import {Input} from "./components/Input";

interface Props {
  onSearch: (searchQuery: string) => void;
}

export const Searchbar = (props: Props): ReactElement<Props> => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value)
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      props.onSearch(searchQuery)
    }
  };

  return (
    <div className="mll fdr fac">
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