import { useEffect, useState } from "react";
import { Checkbox } from "@material-ui/core";
import { useFormContext } from 'react-hook-form';

interface Props {
  inputName: string;
  clearSelected?: boolean;
  defaultValues?: string[];
  inputLabel?: string;
  options: {id: string, label: string}[];
}

export const FilterFormCheckGroup = ({
  inputName,
  clearSelected = false,
  defaultValues = [],
  inputLabel,
  options
}: Props) => {
  const { setValue } = useFormContext();
  const lowerCaseValues = defaultValues.map(value => value.toLowerCase());
  const [selected, setSelected] = useState(lowerCaseValues);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.id;
    const index = selected.indexOf(value);
    const newSelected = [...selected];

    if (index === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(index, 1);
    }

    setSelected(newSelected);
    setValue(inputName, newSelected);
  }

  useEffect(() => {
    if (clearSelected) {
      setSelected([]);
      setValue(inputName, []);
    }
  }, [clearSelected])


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
        {options.map((option) => (
          <div key={option.id} className="checkbox-container">
            <Checkbox
              id={option.id}
              name={inputName}
              value={option.id}
              checked={selected.includes(option.id)}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={option.id}>{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}