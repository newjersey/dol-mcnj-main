/* eslint-disable @typescript-eslint/ban-types */

import React, { ChangeEvent, ReactElement } from "react";
import { InDemandOccupation } from "../domain/Occupation";
import { createStyles, Icon, InputAdornment, TextField } from "@material-ui/core";
import { Autocomplete, AutocompleteChangeReason } from "@material-ui/lab";
import { navigate } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

interface Props {
  occupations: InDemandOccupation[];
}

export const Typeahead = (props: Props): ReactElement => {
  const { t } = useTranslation();

  const handleTypeaheadChange = (
    event: ChangeEvent<{}>,
    value: InDemandOccupation | null,
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
      getOptionLabel={(occupation: InDemandOccupation): string => occupation.title}
      onChange={handleTypeaheadChange}
      classes={useStyles()}
      renderInput={(params): ReactElement => (
        <TextField
          {...params}
          placeholder={t("InDemandPageStrings.typeaheadPlaceholder")}
          variant="outlined"
          margin="dense"
          InputProps={{
            ...params.InputProps,
            inputProps: { ...params.inputProps, "aria-label": "occupation-search" },
            style: {
              borderRadius: 10,
              borderColor: "#7B7777",
              height: 38,
              padding: "4px 12px",
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
