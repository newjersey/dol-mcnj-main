import { Controller, useFormContext } from 'react-hook-form';
import { WhiteSelect } from "../components/WhiteSelect";

interface Props {
  dropdownLabel: string;
  dropdownName: string;
  options_values: string[] | number[];
}

export const FilterFormDropDown = ({
  dropdownLabel,
  dropdownName,
  options_values
}: Props) => {
  const { control } = useFormContext();

  return (
    <div className="field-group">
      <div className="label-container">
        <label>
          {dropdownLabel}
        </label>
      </div>
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
                {val}
              </option>
            ))}
          </WhiteSelect>
        )}
      />
    </div>
  )
}