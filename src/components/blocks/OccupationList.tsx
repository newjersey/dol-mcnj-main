"use client";
import { OccupationListItem } from "@components/modules/OccupationListItem";
import {
  Autocomplete,
  AutocompleteChangeReason,
  TextField,
} from "@mui/material";
import { OccupationListItemProps } from "@utils/types";
import { ChangeEvent } from "react";
import { IconSelector } from "@components/modules/IconSelector";

interface OccupationListProps {
  className?: string;
  suggestions?: OccupationListItemProps["items"];
  items: {
    [key: string]: OccupationListItemProps["items"];
  };
}

export interface InDemandOccupation {
  soc: string;
  title: string;
  majorGroup: string;
  counties: string[];
}

export const OccupationList = ({
  className,
  items,
  suggestions,
}: OccupationListProps) => {
  const handleTypeaheadChange = (
    event: ChangeEvent<{}>,
    value: InDemandOccupation | null,
    reason: AutocompleteChangeReason,
  ): void => {
    if (value && reason === "selectOption") {
      window.location.href = `/occupation/${value.soc}`;
    }
  };

  const occupations = Object.keys(items).map((occupation) => {
    return {
      title: occupation,
      items: items[occupation as keyof typeof items],
    };
  });

  const sortedOccupations = occupations.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  return (
    <div className={`occupationList${className ? ` ${className}` : ""}`}>
      {suggestions && (
        <Autocomplete
          id="combo-box-demo"
          className="occupation-search"
          options={suggestions}
          getOptionLabel={(occupation: InDemandOccupation): string =>
            occupation.title
          }
          onChange={handleTypeaheadChange}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              margin="dense"
              placeholder="Search for occupations"
              InputProps={{
                ...params.InputProps,
                "aria-label": "occupation-search",
                style: {
                  borderRadius: 10,
                  borderColor: "#7B7777",
                  height: 38,
                  padding: "4px 12px",
                },
                startAdornment: (
                  <>
                    <IconSelector
                      name="MagnifyingGlass"
                      weight="bold"
                      color="#7B7777"
                    />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
      {sortedOccupations.map((item) => (
        <OccupationListItem key={item.title} {...item} />
      ))}
    </div>
  );
};
