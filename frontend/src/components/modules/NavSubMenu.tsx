import { useState } from "react";
import { TopLevelNavItemProps } from "../../types/contentful";
import { LinkObject } from "./LinkObject";
import { Icon } from "@material-ui/core";

interface NavSubMenuProps extends TopLevelNavItemProps {
  icons?: boolean;
}

export const NavSubMenu = (props: NavSubMenuProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <button
        className=""
        aria-expanded={open ? "true" : "false"}
        aria-controls="basic-nav-section-one"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <span>
          {props.copy}

          <Icon className="indicator">arrow_drop_down</Icon>
        </span>
      </button>
      {open && (
        <ul className="sub-menu unstyled">
          {props.subItemsCollection?.items.map((subItem) => (
            <li key={subItem.sys?.id}>
              <LinkObject className="sub-nav-item" icons={props.icons} {...subItem} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
