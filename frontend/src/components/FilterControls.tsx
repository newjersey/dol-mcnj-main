import { useEffect, useState } from "react";
import { TagProps } from "../types/contentful";
import { LabelBox } from "./modules/LabelBox";
import { Heading } from "./modules/Heading";
import { CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import { slugify } from "../utils/slugify";

interface FilterControlsProps {
  boxLabel: string;
  className?: string;
  groups: {
    heading: string;
    items: TagProps[];
  }[];
  onType?: (type: string) => void;
  onChange?: (selected: TagProps[]) => void;
  setSearchQuery?: (query: string) => void;
  searchQuery?: string;
}

const Group = ({
  group,
  selected,
  setSelected,
  index,
}: {
  index: number;
  group: { heading: string; items: TagProps[] };
  selected: TagProps[];
  setSelected: (selected: TagProps[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(index > 0 ? false : true);

  return (
    <div key={group.heading} className={`group${isOpen ? " open" : ""}`}>
      <div className="heading">
        <button
          id={slugify(group.heading)}
          className="toggle-heading"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CaretRight size={20} className="caret-icon" weight="bold" />
          <Heading className="group-heading" level={3}>
            {group.heading}
          </Heading>
        </button>
        <button
          type="button"
          id={slugify(group.heading) + " select-all"}
          className="usa-button  usa-button--unstyled"
          onClick={() => {
            setSelected(
              [...selected, ...group.items].filter(
                (item, index, self) => self.indexOf(item) === index,
              ),
            );
          }}
        >
          Select All
        </button>
      </div>
      <div className="items">
        {group.items.map((item) => (
          <div className="usa-checkbox" key={item.sys.id}>
            <input
              className="usa-checkbox__input"
              id={item.sys.id}
              checked={selected.includes(item)}
              type="checkbox"
              onChange={() => {
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
            setSelected(selected.filter((item) => !group.items.includes(item)));
          }}
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
};

const FilterControls = ({
  boxLabel,
  className,
  searchQuery,
  setSearchQuery,
  groups,
  onChange,
  onType,
}: FilterControlsProps) => {
  const [selected, setSelected] = useState<TagProps[]>([]);

  useEffect(() => {
    if (onChange) {
      onChange(selected);
    }
  }, [selected]);

  return (
    <div className={`filterControls${className ? ` ${className}` : ""}`}>
      <LabelBox title={boxLabel} color="navy" toggle>
        <div>
          <label htmlFor="resource-search" className="usa-label">
            Find Resources
            <div className="input-wrapper">
              <MagnifyingGlass size={20} className="search-icon" weight="bold" />
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
        </div>
        <button
          type="button"
          className="clear-all usa-button--outline"
          onClick={() => {
            setSearchQuery && setSearchQuery("");
            setSelected([]);
          }}
        >
          Clear All
        </button>
        {groups.map((group, index) => (
          <Group
            group={group}
            index={index}
            selected={selected}
            setSelected={setSelected}
            key={group.heading}
          />
        ))}
      </LabelBox>
    </div>
  );
};

export { FilterControls };
