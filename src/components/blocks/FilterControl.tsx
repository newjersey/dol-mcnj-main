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
  selected?: ResourceTagProps[]; // NEW
  onChange?: (selected: ResourceTagProps[]) => void;
}

export const FilterControl = ({
  boxLabel,
  children,
  className,
  groups,
  onChange,
  selected = [], // default to empty
}: FilterControlProps) => {
  const [open, setOpen] = useState<boolean>(false);

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
          onClick={() => onChange?.([])}
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
                  const combined = [...selected, ...group.items];
                  const unique = combined.filter(
                    (item, index, self) =>
                      self.findIndex((i) => i.sys.id === item.sys.id) === index
                  );
                  onChange?.(unique);
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
                checked={selected.some((i) => i.sys.id === item.sys.id)}
                onChange={() => {
                  if (selected.some((i) => i.sys.id === item.sys.id)) {
                    onChange?.(
                      selected.filter((i) => i.sys.id !== item.sys.id)
                    );
                  } else {
                    onChange?.([...selected, item]);
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
                const next = selected.filter(
                  (item) => !group.items.some((i) => i.sys.id === item.sys.id)
                );
                onChange?.(next);
              }}
            />
          </div>
        ))}
      </LabelBox>
      {children}
    </div>
  );
};
