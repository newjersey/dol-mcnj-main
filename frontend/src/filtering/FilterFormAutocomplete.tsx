import { useFormContext } from 'react-hook-form';
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

import { COUNTIES } from "./newJerseyCounties";

interface Props {
  inputLabel: string;
  inputName: string;
}

export const FilterFormAutocomplete = ({
  inputLabel,
  inputName
}: Props) => {
  const { register } = useFormContext();
  return (
    <div className="field-group">
      <div className="label-container">
        <label htmlFor={inputName}>
          {inputLabel}
        </label>
      </div>
      <Autocomplete
        data-testid="county-search"
        id="county"
        options={COUNTIES}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" {...register(inputName)} />
        )}
      />
    </div>
  )
}