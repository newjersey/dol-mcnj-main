import { TopLevelNavItemProps } from "../../types/contentful";
import { LinkObject } from "./LinkObject";
import { Icon } from "@material-ui/core";

interface NavSubMenuProps extends TopLevelNavItemProps {
  icons?: boolean;
  open?: boolean;
  onClick: () => void;
}

export const NavSubMenu = (props: NavSubMenuProps) => {
  const filteredItems = props.subItemsCollection?.items.filter((item) => item.url !== "/faq");

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
          <Icon className="indicator">arrow_drop_down</Icon>
        </span>
      </button>
      {props.open && (
        <ul className="sub-menu unstyled">
          {filteredItems?.map((subItem) => (
            <li key={subItem.sys?.id}>
              <LinkObject className="sub-nav-item" icons={props.icons} {...subItem} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
