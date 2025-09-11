"use client";
import { TopNavItemProps } from "@utils/types";
import { LinkObject } from "@components/modules/LinkObject";
import { CaretDown } from "@phosphor-icons/react";

interface NavSubMenuProps extends TopNavItemProps {
  icons?: boolean;
  open?: boolean;
  onClick: () => void;
}

export const NavSubMenu = (props: NavSubMenuProps) => {
  return (
    <>
      <button
        className=""
        aria-expanded={props.open ? "true" : "false"}
        aria-controls="basic-nav-section-one"
        onClick={() => {
          props.onClick();
        }}
      >
        <span>
          {props.copy}
          <CaretDown weight="fill" size={10} />
        </span>
      </button>
      {props.open && (
        <ul className="sub-menu unstyled">
          {props.subItemsCollection &&
            props.subItemsCollection.items.length > 0 &&
            props.subItemsCollection.items.map((subItem) => (
              <li key={subItem.itemId}>
                <LinkObject
                  noIndicator={!props.icons}
                  className="sub-nav-item"
                  onClick={() => {
                    props.onClick();
                  }}
                  url={subItem.url as string}
                >
                  {subItem.copy}
                </LinkObject>
              </li>
            ))}
        </ul>
      )}
    </>
  );
};
