import { useEffect, useState } from "react";
import { useFormContext } from 'react-hook-form';
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

interface Props {
  inputName: string;
  options: string[]; // Add the 'options' property to the 'Props' interface
  clearSelected?: boolean;
  inputLabel?: string;
  placeholder?: string
}

export const FilterFormSingleDD = ({
  clearSelected,
  inputLabel,
  inputName,
  options,
  placeholder
}: Props) => {
  const { getValues, register, setValue } = useFormContext();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const county = getValues(inputName);
    if (county) {
      const lowerCase = county.toLowerCase();
      const capitalizedValue = lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
      setSelected(capitalizedValue);
    }
  }, [getValues, inputName]);

  useEffect(() => {
    if (clearSelected) {
      setSelected(null);
    }
  }, [clearSelected]);

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
        <Autocomplete
          data-testid="county-search"
          id={inputName}
          value={selected}
          options={options}
          onChange={(_, newValue: string | null) => {
            setSelected(newValue);
            setValue(inputName, newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              className="filter-input"
              variant="outlined"
              placeholder={placeholder}
              {...register(inputName)}
            />
          )}
        />
      </div>
    </div>
  )
}