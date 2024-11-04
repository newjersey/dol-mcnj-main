"use client";
import { Button } from "@components/modules/Button";
import { FormInput } from "@components/modules/FormInput";
import { Heading } from "@components/modules/Heading";
import { LabelBox } from "@components/modules/LabelBox";
import { colors } from "@utils/settings";
import { ResourceTagProps } from "@utils/types";
import { ReactNode, useEffect, useState } from "react";

export interface FilterControlProps {
  boxLabel: string;
  children?: ReactNode;
  className?: string;
  groups: {
    heading: string;
    items: ResourceTagProps[];
  }[];
  onChange?: (selected: ResourceTagProps[]) => void;
}

export const FilterControl = ({
  boxLabel,
  children,
  className,
  groups,
  onChange,
}: FilterControlProps) => {
  const [selected, setSelected] = useState<ResourceTagProps[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    // Call the onChange callback when the selected items change
    if (onChange) {
      onChange(selected);
    }
  }, [selected]);

  useEffect(() => {
    const toggle = document.querySelectorAll(".labelBox .title");
    toggle.forEach((el) => {
      el.addEventListener("click", () => {
        setOpen(!open);
      });
    });
  }, [open]);

  return (
    <div
      className={`filterControl${className ? ` ${className}` : ""}${
        open ? ` open` : ""
      }`}
    >
      <LabelBox
        title={boxLabel}
        color="navy"
        bgFill
        iconSuffix="CaretDown"
        headingLevel={2}
        iconWeight="bold"
      >
        <Button
          className="clear-all usa-button--outline"
          label="Clear All"
          customTextColor="#2e6276"
          customBorderColor="#2e6276"
          type="button"
          onClick={() => setSelected([])}
        />
        {groups.map((group) => (
          <div key={group.heading}>
            <div className="heading">
              <Heading className="group-heading" level={3}>
                {group.heading}
              </Heading>
              <Button
                type="button"
                label="Select All"
                unstyled
                onClick={() => {
                  // Select all items in the group and remove duplicates
                  setSelected(
                    [...selected, ...group.items].filter(
                      (item, index, self) => self.indexOf(item) === index,
                    ),
                  );
                }}
                customTextColor={colors.baseDark}
              />
            </div>
            {group.items.map((item) => (
              <FormInput
                type="checkbox"
                name={group.heading}
                label={item.title}
                inputId={item.sys.id}
                key={item.sys.id}
                checked={selected.includes(item)}
                onChange={() => {
                  // Toggle the selected state of the checkbox item
                  if (selected.includes(item)) {
                    setSelected(selected.filter((i) => i !== item));
                  } else {
                    setSelected([...selected, item]);
                  }
                }}
              />
            ))}
            <Button
              type="button"
              className="clear"
              label="Clear Selection"
              unstyled
              customTextColor={colors.baseDark}
              onClick={() => {
                // Remove the selected items that belong to the current group
                setSelected(
                  selected.filter((item) => !group.items.includes(item)),
                );
              }}
            />
          </div>
        ))}
      </LabelBox>
      {children}
    </div>
  );
};
