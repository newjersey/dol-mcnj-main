import { useFormContext } from 'react-hook-form';
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

interface Props {
  inputName: string;
  options: string[]; // Add the 'options' property to the 'Props' interface
  inputLabel?: string;
}

export const FilterFormAutocomplete = ({
  inputLabel,
  inputName,
  options
}: Props) => {
  const { register } = useFormContext();
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
          options={options}
          renderInput={(params) => (
            <TextField
              {...params}
              className="filter-dropdown"
              variant="outlined"
              {...register(inputName)}
            />
          )}
        />
      </div>
    </div>
  )
}