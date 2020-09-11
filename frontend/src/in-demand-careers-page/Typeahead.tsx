import React, { ChangeEvent, ReactElement } from "react";
import { Occupation } from "../domain/Occupation";
import { createStyles, Icon, InputAdornment, TextField } from "@material-ui/core";
import { Autocomplete, AutocompleteChangeReason } from "@material-ui/lab";
import { navigate } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  occupations: Occupation[];
}

export const Typeahead = (props: Props): ReactElement => {
  const handleTypeaheadChange = (
    event: ChangeEvent<{}>,
    value: Occupation | null,
    reason: AutocompleteChangeReason
  ): void => {
    if (value && reason === "select-option") {
      navigate(`/occupation/${value.soc}`);
    }
  };

  const useStyles = makeStyles(
    createStyles({
      option: {
        '&[data-focus="true"]': {
          backgroundColor: "#F4EAFE",
        },
      },
    })
  );

  return (
    <Autocomplete
      options={props.occupations}
      getOptionLabel={(occupation: Occupation): string => occupation.title}
      onChange={handleTypeaheadChange}
      classes={useStyles()}
      renderInput={(params): ReactElement => (
        <TextField
          {...params}
          placeholder="Search for occupations"
          variant="outlined"
          margin="dense"
          InputProps={{
            ...params.InputProps,
            inputProps: { ...params.inputProps, "aria-label": "occupation-search" },
            style: {
              borderRadius: 10,
              borderColor: "#7B7777",
              height: 38,
            },
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <Icon>search</Icon>
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
