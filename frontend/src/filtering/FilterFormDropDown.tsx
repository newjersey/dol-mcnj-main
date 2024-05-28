// import { useEffect, useState } from "react";
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

interface Props {
  inputName: string;
  options: string[]; // Add the 'options' property to the 'Props' interface
  inputLabel?: string;
}

export const FilterFormDropDown = ({
  inputLabel,
  inputName,
  options
}: Props) => {
  const { control } = useFormContext();

  return (
    <div className="field-group">
      {inputLabel && (
        <div className="label-container">
          <label htmlFor={inputName}>
            {inputLabel}
          </label>
        </div>
      )}
      <div className="input-container">
        <Controller
          control={control}
          name={inputName}
          render={({ field: { onChange, ...props } }) => (
            <Autocomplete
              options={options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="filter-input"
                  variant="outlined"
                />
              )}
              onChange={(e, data) => onChange(data)}
              {...props}
            />
          )}
        />
      </div>
    </div>
  )
}