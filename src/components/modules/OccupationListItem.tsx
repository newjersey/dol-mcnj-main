"use client";
import * as Icon from "@components/svgs/occupations";
import { convertToPascalCase } from "@utils/convertToPascalCase";
import { LinkObject } from "./LinkObject";
import { Button } from "./Button";
import { useState } from "react";
import { OccupationListItemProps } from "@utils/types";

const OccupationListItem = ({
  className,
  items,
  title,
}: OccupationListItemProps) => {
  const [open, setOpen] = useState(false);
  const iconName = `${convertToPascalCase(title).replace(/\s/g, "")}Occupations`;

  const IconElement = Icon[iconName as keyof typeof Icon];

  return (
    <div className={`occupationListItem${className ? ` ${className}` : ""}`}>
      <Button
        type="button"
        unstyled
        iconSuffix={open ? "CaretUp" : "CaretDown"}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <span>
          <div className="occ-icon">
            <IconElement />
          </div>
          {title}
        </span>
      </Button>

      {open && (
        <ul>
          {items.map((item) => {
            const multipleCounties =
              item.counties.length > 1 ? "Counties" : "County";
            const counties = item.counties.join(", ");
            return (
              <li key={item.soc}>
                <LinkObject
                  url={`/occupation/${item.soc}`}
                  className="occupationLink"
                >
                  {item.title}
                </LinkObject>
                {item.counties.length > 0 && (
                  <span>
                    (In-demad only in {counties} {multipleCounties})
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export { OccupationListItem };
