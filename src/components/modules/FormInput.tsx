import { Envelope } from "@phosphor-icons/react";
import { FormInputProps } from "@utils/types";

export const FormInput = (props: FormInputProps) => {
  const {
    ariaLabel,
    checked,
    className,
    counter,
    defaultChecked,
    defaultValue,
    disabled,
    error,
    helperText,
    hideLabel,
    inputClass,
    inputId,
    label,
    labelClass,
    name,
    onBlur,
    onBlurArea,
    onBlurSelect,
    onChange,
    onChangeArea,
    onChangeSelect,
    options,
    placeholder,
    readOnly,
    required,
    type,
    value,
    variant,
  } = props;
  const isChoice = type === "checkbox" || type === "radio";
  const labelClasses = labelClass ? ` ${labelClass}` : "";
  const inputClasses = inputClass ? ` ${inputClass}` : "";

  return (
    <span
      className={`formField ${type}${hideLabel ? " hideLabel" : ""}${
        className ? ` ${className}` : ""
      }${error ? " error" : ""}`}
    >
      {type === "textarea" ? (
        // Render textarea for type "textarea"
        <>
          <label className={`usa-label${labelClasses}`} htmlFor={inputId}>
            {label}
            {required && <span className="require-mark text-error">*</span>}
          </label>
          {helperText && <p>{helperText}</p>}
          <textarea
            aria-label={ariaLabel}
            className={inputClass}
            defaultValue={defaultValue}
            disabled={disabled}
            id={inputId}
            name={inputId || name}
            onBlur={onBlurArea}
            onChange={onChangeArea}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            value={value}
          />
          {counter && (
            <span
              className={`character-count${
                counter.count > counter.limit ? " text-error" : ""
              }`}
            >
              {counter.count} / {counter.limit}
            </span>
          )}
        </>
      ) : isChoice ? (
        // Render checkbox or radio input
        <>
          <div className={`usa-${type}`}>
            {helperText && <p>{helperText}</p>}
            <input
              aria-label={ariaLabel}
              checked={checked}
              className={`usa-${type}__input${inputClasses}`}
              defaultChecked={defaultChecked}
              disabled={disabled}
              id={inputId}
              name={name || inputId}
              onBlur={onBlur}
              onChange={onChange}
              readOnly={readOnly}
              required={required}
              type={type}
              value={defaultValue || label}
            />
            <label
              className={`usa-${type}__label${labelClasses}`}
              htmlFor={inputId}
            >
              {label}
              {required && <span className="require-mark text-error">*</span>}
            </label>
            {variant === "switch" && (
              <span className="toggle">
                <span className="dot" />
              </span>
            )}
          </div>
        </>
      ) : type === "select" ? (
        // Render select dropdown
        <>
          <label className={`usa-label${labelClasses}`} htmlFor={inputId}>
            {label}
            {required && <span className="require-mark text-error">*</span>}
          </label>
          {helperText && <p>{helperText}</p>}
          <select
            aria-label={ariaLabel}
            className={`usa-select${inputClasses}`}
            defaultValue={defaultValue}
            disabled={disabled}
            id={inputId}
            name={inputId}
            onBlur={onBlurSelect}
            onChange={onChangeSelect}
          >
            {placeholder && <option value="">- {placeholder} -</option>}
            {options?.map((option) => (
              <option key={option.key} value={option.value}>
                {option.key}
              </option>
            ))}
          </select>
        </>
      ) : type === "email" ? (
        <>
          <label className={`usa-label${labelClasses}`} htmlFor={inputId}>
            {label}
            {required && <span className="require-mark text-error">*</span>}
          </label>
          {helperText && <p>{helperText}</p>}
          <Envelope size={25} weight="regular" className="icon" />
          <input
            aria-label={ariaLabel}
            className={`usa-input email${inputClasses}`}
            defaultValue={defaultValue}
            disabled={disabled}
            id={inputId}
            name={inputId}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            type={type}
            value={value}
          />
        </>
      ) : (
        // Render all other input
        <>
          <label className={`usa-label${labelClasses}`} htmlFor={inputId}>
            {label}
            {required && <span className="require-mark text-error">*</span>}
          </label>
          {helperText && <p>{helperText}</p>}
          <input
            aria-label={ariaLabel}
            className={`usa-input${inputClasses}`}
            defaultValue={defaultValue}
            disabled={disabled}
            id={inputId}
            name={inputId}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            type={type}
            value={value}
          />
        </>
      )}
      {error && <span className="error">{error}</span>}
    </span>
  );
};
