import { useEffect, useState } from "react";
import { TagProps } from "../types/contentful";
import { LabelBox } from "./modules/LabelBox";
import { Heading } from "./modules/Heading";

interface FilterControlsProps {
  boxLabel: string;
  className?: string;
  groups: {
    heading: string;
    items: TagProps[];
  }[];
  onChange?: (selected: TagProps[]) => void;
}

const FilterControls = ({ boxLabel, className, groups, onChange }: FilterControlsProps) => {
  const [selected, setSelected] = useState<TagProps[]>([]);

  useEffect(() => {
    // Call the onChange callback when the selected items change
    if (onChange) {
      onChange(selected);
    }
  }, [selected]);

  return (
    <aside className={`filterControls${className ? ` ${className}` : ""}`}>
      <LabelBox title={boxLabel} color="navy" toggle>
        <button
          type="button"
          className="clear-all usa-button--outline"
          onClick={() => setSelected([])}
        >
          Clear All
        </button>
        {groups.map((group) => (
          <div key={group.heading}>
            <div className="heading">
              <Heading className="group-heading" level={3}>
                {group.heading}
              </Heading>
              <button
                type="button"
                className="usa-button  usa-button--unstyled"
                onClick={() => {
                  // Select all items in the group and remove duplicates
                  setSelected(
                    [...selected, ...group.items].filter(
                      (item, index, self) => self.indexOf(item) === index
                    )
                  );
                }}
              >
                Select All
              </button>
            </div>
            {group.items.map((item) => (
              <div className="usa-checkbox">
                <input
                  className="usa-checkbox__input"
                  id={item.sys.id}
                  checked={selected.includes(item)}
                  type="checkbox"
                  onChange={() => {
                    // Toggle the selected state of the checkbox item
                    if (selected.includes(item)) {
                      setSelected(selected.filter((i) => i !== item));
                    } else {
                      setSelected([...selected, item]);
                    }
                  }}
                />
                <label className="usa-checkbox__label" htmlFor={item.sys.id}>
                  {item.title}
                </label>
              </div>
            ))}
            <button
              type="button"
              className="clear usa-button  usa-button--unstyled"
              onClick={() => {
                // Remove the selected items that belong to the current group
                setSelected(selected.filter((item) => !group.items.includes(item)));
              }}
            >
              Clear Selection
            </button>
          </div>
        ))}
      </LabelBox>
    </aside>
  );
};

export { FilterControls };
