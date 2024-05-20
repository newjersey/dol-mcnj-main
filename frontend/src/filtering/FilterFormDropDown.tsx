import { Controller, useFormContext } from 'react-hook-form';
import { WhiteSelect } from "../components/WhiteSelect";

interface Props {
  dropdownName: string;
  options_values: string[] | number[];
  dropdownLabel?: string;
}

export const FilterFormDropDown = ({
  dropdownName,
  options_values,
  dropdownLabel
}: Props) => {
  const { control } = useFormContext();

  return (
    <div className="field-group">
      {dropdownLabel && (
        <div className="label-container">
          <label htmlFor={dropdownName}>
            {dropdownLabel}
          </label>
        </div>
      )}
      <Controller
        control={control}
        name={dropdownName}
        render={({ field: { onChange, ...props } }) => (
          <WhiteSelect
            native={true}
            onChange={onChange}
            label={dropdownLabel}
            id={dropdownName}
            {...props}
          >
            {options_values.map((val) => (
              <option key={val} value={val}>
                {val} miles
              </option>
            ))}
          </WhiteSelect>
        )}
      />
    </div>
  )
}