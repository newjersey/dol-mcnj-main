"use client";
import { LinkObject } from "@components/modules/LinkObject";
import { NavSubMenu } from "./NavSubMenu";
import { HeadingLevel, NavMenuProps, TopNavItemProps } from "@utils/types";
import { ReactNode, useEffect, useState } from "react";

export const NavMenu = ({
  menu,
  className,
  label,
  innerClassName,
  noDropdowns = false,
  extraItems,
  icons = false,
  headingLevel,
  id,
}: {
  menu?: NavMenuProps;
  id?: string;
  extraItems?: ReactNode;
  className?: string;
  noDropdowns?: boolean;
  innerClassName?: string;
  label?: string;
  icons?: boolean;
  internalLinks?: boolean;
  headingLevel?: HeadingLevel;
}) => {
  const Heading = headingLevel
    ? (`h${headingLevel}` as keyof JSX.IntrinsicElements)
    : ("span" as keyof JSX.IntrinsicElements);

  const [activeSubMenu, setActiveSubMenu] = useState<TopNavItemProps>();

  const handleClickOutside = (event: MouseEvent) => {
    if (activeSubMenu && event.target instanceof Element) {
      if (!event.target.closest(".main-nav")) {
        setActiveSubMenu(undefined);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeSubMenu]);

  return (
    <nav
      id={id}
      className={`main-nav ${className ? ` ${className}` : ""}`}
      aria-label={label}
    >
      <div className={innerClassName}>
        {menu?.heading && (
          <Heading className="nav-heading">
            {menu?.url ? (
              <LinkObject noIndicator={!icons} url={menu?.url}>
                {menu?.heading}
              </LinkObject>
            ) : (
              menu?.heading
            )}
          </Heading>
        )}

        <ul className="unstyled">
          {menu?.topLevelItemsCollection.items.map((item, index) => {
            const hasSub =
              item.subItemsCollection &&
              item.subItemsCollection.items.length > 0;
            return (
              <li
                key={item.copy + index}
                className={`nav-item${item.classes ? ` ${item.classes}` : ""}${
                  hasSub ? " has-sub" : " no-sub"
                }`}
              >
                {hasSub && !noDropdowns ? (
                  <NavSubMenu
                    icons={icons}
                    {...item}
                    open={activeSubMenu?.itemId === item.itemId}
                    onClick={() => {
                      if (activeSubMenu?.itemId === item.itemId) {
                        setActiveSubMenu(undefined);
                      } else {
                        setActiveSubMenu(item);
                      }
                    }}
                  />
                ) : (
                  <>
                    <LinkObject
                      noIndicator={!icons}
                      className={`${item.classes ? ` ${item.classes}` : ""}`}
                      url={item.url as string}
                    >
                      {item.copy}
                    </LinkObject>

                    {item.subItemsCollection &&
                      item.subItemsCollection.items.length > 0 && (
                        <ul className="unstyled">
                          {item.subItemsCollection.items.map((subItem) => (
                            <li key={subItem.itemId}>
                              <LinkObject
                                noIndicator={!icons}
                                className={
                                  subItem.classes ? ` ${subItem.classes}` : ""
                                }
                                url={subItem.url as string}
                              >
                                {subItem.copy}
                              </LinkObject>
                            </li>
                          ))}
                        </ul>
                      )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
        {extraItems}
      </div>
    </nav>
  );
};
