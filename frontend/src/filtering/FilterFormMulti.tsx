import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

interface Props {
  inputName: string;
  options: {id: string, label: string}[];
  inputLabel?: string;
}
export const FilterFormMulti = ({
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
      <div className="input-wrapper">
        <Controller
          control={control}
          name={inputName}
          render={({ field: { onChange, ...props } }) => (
            <Autocomplete
              {...props}
              multiple
              id={inputName}
              onChange={(_, data) => onChange(data)}
              options={options}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="filter-input"
                  variant="outlined"
                />
              )}
            />
          )}
        />
      </div>
    </div>
  )
}