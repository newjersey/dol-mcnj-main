"use client";
import { useState } from "react";
import { FormInput } from "@components/modules/FormInput";

interface SwitchProps {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  helperText?: string;
  hideLabel?: boolean;
  inputClass?: string;
  inputId: string;
  label: string;
  disabled?: boolean;
  labelClass?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  required?: boolean;
  testId?: string;
  value?: string;
}

const Switch = ({
  checked,
  className,
  defaultChecked = false,
  helperText,
  inputClass,
  inputId,
  disabled,
  label,
  labelClass,
  onChange,
  readOnly,
  required,
  testId,
  value,
}: SwitchProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked);
  return (
    <div
      data-testid={testId}
      className={`switch${className ? ` ${className}` : ""}${
        isChecked ? " checked" : ""
      }`}
    >
      {helperText && <p>{helperText}</p>}
      <label htmlFor={inputId} className={labelClass}>
        <FormInput
          checked={checked}
          defaultChecked={checked ? undefined : defaultChecked}
          defaultValue={value}
          inputClass={inputClass}
          inputId={inputId}
          disabled={disabled}
          label={label}
          onChange={(e) => {
            if (onChange) {
              onChange(e);
            }
            setIsChecked(e.target.checked);
          }}
          readOnly={readOnly}
          required={required}
          type="checkbox"
          variant="switch"
        />
      </label>
    </div>
  );
};

export { Switch };
