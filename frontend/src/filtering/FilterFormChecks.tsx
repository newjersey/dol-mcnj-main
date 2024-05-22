interface Props {
  inputName: string;
  inputLabel?: string;
}

export const FilterFormChecks = ({
  inputName,
  inputLabel,
}: Props) => {
  return (
    <div className="field-group">
      {inputLabel && (
        <div className="label-container">
          <label htmlFor={inputName}>
            {inputLabel}
          </label>
        </div>
      )}
      Checks
    </div>
  )
}