"use client";
import { Button } from "@components/modules/Button";
import { FormInput } from "@components/modules/FormInput";
import { Heading } from "@components/modules/Heading";
import { LabelBox } from "@components/modules/LabelBox";
import {
  CaretDownIcon,
  CaretRightIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
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
  onType?: (type: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const FilterGroup = ({
  group,
  selected,
  onChange,
  index,
}: {
  group: { heading: string; items: ResourceTagProps[] };
  index?: number;
  selected: ResourceTagProps[];
  onChange?: (selected: ResourceTagProps[]) => void;
}) => {
  const [open, setOpen] = useState<boolean>(index === 0); // Open the first group by default
  return (
    <div key={group.heading}>
      <div className="heading">
        <button
          type="button"
          className={`toggle ${open ? "open" : ""} flex items-center gap-2`}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <CaretDownIcon size={22} weight="bold" className="caret-icon" />
          ) : (
            <CaretRightIcon size={22} weight="bold" className="caret-icon" />
          )}

          <Heading className="group-heading" level={3}>
            {group.heading}
          </Heading>
        </button>
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
      {open && (
        <div className="items ml-8">
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
                  onChange?.(selected.filter((i) => i.sys.id !== item.sys.id));
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
      )}
    </div>
  );
};

export const FilterControl = ({
  boxLabel,
  children,
  className,
  onType,
  searchQuery,
  setSearchQuery,
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
        <label htmlFor="resource-search" className="search-box usa-label">
          Find Resources
          <div className="input-wrapper">
            <MagnifyingGlassIcon
              size={20}
              className="search-icon"
              weight="bold"
            />
            <input
              id="resource-search"
              type="text"
              value={searchQuery}
              placeholder="Start typing here"
              className="usa-input"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                setSearchQuery && setSearchQuery(searchTerm);
                if (onType) {
                  onType(searchTerm);
                }
              }}
            />
          </div>
        </label>
        <Button
          className="clear-all usa-button--outline"
          label="Clear All"
          customTextColor="#2e6276"
          customBorderColor="#2e6276"
          type="button"
          onClick={() => {
            setSearchQuery && setSearchQuery("");
            onChange?.([]);
          }}
        />
        <div className="flex flex-col gap-4 mt-4">
          {groups.map((group, index) => (
            <FilterGroup
              group={group}
              key={group.heading}
              selected={selected}
              onChange={onChange}
              index={index}
            />
          ))}
        </div>
      </LabelBox>
      {children}
    </div>
  );
};
