import { useState } from "react";
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

interface OptionProps {
  id: string;
  label: string;
  values?: number[];
}

interface Props {
  inputName: string;
  options: OptionProps[];
  defaultValues?: string[];
  inputLabel?: string;
  placeholder?: string;
}
export const FilterFormMultiDD = ({
  defaultValues = [],
  inputLabel,
  inputName,
  options,
  placeholder
}: Props) => {
  const { control } = useFormContext();
  const lowerCaseValues = defaultValues.map(value => value.toLowerCase());
  const selectedValues = options.filter(option => lowerCaseValues.includes(option.id));
  const [selected, setSelected] = useState(selectedValues);

  const handleChange = (data: (string | OptionProps)[]) => {
    setSelected(data as OptionProps[]);
  }

  return (
    <div className="field-group">
      {inputLabel && (
        <div className="label-container">
          <label htmlFor={inputName}>
            {inputLabel}
          </label>
        </div>
      )}
      <div className="input-wrapper">
        <Controller
          control={control}
          name={inputName}
          render={({ field: { onChange, ...props } }) => (
            <Autocomplete
              {...props}
              multiple
              id={inputName}
              onChange={(_, data) => {
                onChange(data)
                handleChange(data)
              }}
              options={options}
              getOptionLabel={(option) => option.label}
              getOptionSelected={(option, value) => {
                return value.id === option.id
              }}
              value={selected}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="filter-input"
                  variant="outlined"
                  placeholder={placeholder}
                />
              )}
            />
          )}
        />
      </div>
    </div>
  )
}