import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { InputAdornment, TextField } from '@material-ui/core';

interface Props {
  inputName: string;
  inputLabel?: string;
  hasIcon?: boolean;
  icon?: ReactNode;
  inputType?: "text" | "number";
  placeholder?: string;
  subLabel?: string;
}

export const FilterFormInput = ({
  inputLabel,
  inputName,
  inputType = "text",
  hasIcon = false,
  icon,
  placeholder,
  subLabel,
}: Props) => {
  const { control } = useFormContext();

  const inputIcon = () => hasIcon ? (
    <InputAdornment position="start">
      {icon}
    </InputAdornment>
  ) : null;

  return (
    <div className="field-group">
      {inputLabel && (
        <div className="label-container">
          <label htmlFor={inputName}>
            {inputLabel}
          </label>
        </div>
      )}
      {subLabel && (
        <div className="sub-label-container">
          <label>
            {subLabel}
          </label>
        </div>
      )}
      <div className="input-container">
        <Controller
          control={control}
          name={inputName}
          render={({ field: { onChange, ...props } }) => (
            <TextField
              {...props}
              onChange={onChange}
              className="filter-input"
              placeholder={placeholder}
              type={inputType}
              variant="outlined"
              InputProps={{
                startAdornment: inputIcon(),
              }}
            />
          )}
        />
      </div>
    </div>
  )
}