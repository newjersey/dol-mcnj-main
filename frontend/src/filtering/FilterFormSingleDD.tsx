import { useEffect, useState } from "react";
import { useFormContext } from 'react-hook-form';
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

interface Props {
  inputName: string;
  options: string[]; // Add the 'options' property to the 'Props' interface
  inputLabel?: string;
}

export const FilterFormSingleDD = ({
  inputLabel,
  inputName,
  options
}: Props) => {
  const { getValues, register } = useFormContext();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const county = getValues(inputName);
    if (county) {
      const lowerCase = county.toLowerCase();
      const capitalizedValue = lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
      setSelected(capitalizedValue);
    }
  }, [getValues, inputName]);

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
          renderInput={(params) => (
            <TextField
              {...params}
              className="filter-input"
              variant="outlined"
              {...register(inputName)}
            />
          )}
        />
      </div>
    </div>
  )
}