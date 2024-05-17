import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface Props {
  inputLabel: string;
  inputName: string;
  hasIcon?: boolean;
  icon?: ReactNode;
  inputType?: "text" | "number";
}

export const FilterFormInput = ({
  inputLabel,
  inputName,
  inputType = "text",
  hasIcon = false,
  icon
}: Props) => {
  const { control } = useFormContext();

  return (
    <div className="field-group">
      <div className="label-container">
        <label>
          {inputLabel}
        </label>
      </div>
      <div className="input-container">
        {hasIcon && icon && (
          <div className="icon-container">
            {icon}
          </div>
        )}
        <Controller
          control={control}
          name={inputName}
          render={({ field: { onChange, ...props } }) => (
            <input
              {...props}
              className={hasIcon ? "w-icon" : ""}
              type={inputType}
              onChange={onChange}
            />
          )}
        />
      </div>
    </div>
  )
}