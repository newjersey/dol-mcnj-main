import { ChangeEvent, useState } from "react";
import { Controller, useFormContext } from 'react-hook-form';

interface Props {
  inputLabel: string;
  inputName: string;
  inputChecked?: boolean;
}

export const FilterFormSwitch = ({
  inputLabel,
  inputName,
  inputChecked = false
}: Props) => {
  const { control } = useFormContext();
  const [checked, setChecked] = useState(inputChecked);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="field-group">
      <div className="label-container">
        <label htmlFor={inputName}>
          {inputLabel}
        </label>
      </div>
      <div className="input-container">
        <Controller
          control={control}
          name={inputName}
          render={({ field: { onChange, ...props } }) => (
            <label className="switch">
              <input
                {...props}
                type="checkbox"
                checked={checked}
                onChange={e => {
                  handleChange(e);
                  onChange(e);
                }}
              />
              <span className={`slider round${checked ? ' isChecked' : ''}`}></span>
            </label>
          )}
        />
      </div>
    </div>
  );
}