import { Fragment, useEffect, useState } from "react";
import { NavMenuData, TopLevelNavItemProps } from "../../types/contentful";
import { LinkObject } from "./LinkObject";
import { NavSubMenu } from "./NavSubMenu";

export const NavMenu = ({
  menu,
  className,
  label,
  innerClassName,
  noDropdowns = false,
  icons = false,
  headingLevel,
  id,
}: {
  menu?: NavMenuData;
  id?: string;
  className?: string;
  noDropdowns?: boolean;
  innerClassName?: string;
  label?: string;
  icons?: boolean;
  internalLinks?: boolean;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}) => {
  const Heading = headingLevel
    ? (`h${headingLevel}` as keyof JSX.IntrinsicElements)
    : ("span" as keyof JSX.IntrinsicElements);

  const [activeSubMenu, setActiveSubMenu] = useState<TopLevelNavItemProps>();

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
    <nav id={id} className={`main-nav ${className ? ` ${className}` : ""}`} aria-label={label}>
      <div className={innerClassName}>
        {menu?.navMenus.heading && (
          <Heading className="nav-heading">
            {menu?.navMenus.url ? (
              <LinkObject icons={icons} url={menu?.navMenus.url}>
                {menu?.navMenus.heading}
              </LinkObject>
            ) : (
              menu?.navMenus.heading
            )}
          </Heading>
        )}
        <ul className="unstyled">
          {menu?.navMenus.topLevelItemsCollection.items.map((item) => {
            const hasSub =
              item.subItemsCollection?.items && item.subItemsCollection?.items.length > 0;
            const noLink = item.url === "#nolink" || item.classes?.includes("no-link");
            return (
              <li
                key={item.sys.id}
                className={`nav-item${item.classes ? ` ${item.classes}` : ""}${
                  hasSub ? " has-sub" : " no-sub"
                }`}
              >
                {hasSub && !noDropdowns ? (
                  <NavSubMenu
                    icons={icons}
                    {...item}
                    open={activeSubMenu?.sys.id === item.sys.id}
                    onClick={() => {
                      if (activeSubMenu?.sys.id === item.sys.id) {
                        setActiveSubMenu(undefined);
                      } else {
                        setActiveSubMenu(item);
                      }
                    }}
                  />
                ) : (
                  <>
                    {noLink ? (
                      <span className="nav-header">{item.copy}</span>
                    ) : (
                      <LinkObject icons={icons} {...item} />
                    )}
                    {hasSub && (
                      <ul className="unstyled">
                        {item.subItemsCollection?.items.map((subItem) => {
                          const subNoLink = subItem.url === "##nolink";
                          return (
                            <Fragment key={subItem.sys?.id}>
                              {subNoLink ? (
                                <>
                                  <span>{subItem.copy}</span>
                                </>
                              ) : (
                                <li key={subItem.sys?.id}>
                                  <LinkObject icons={icons} {...subItem} />
                                </li>
                              )}
                            </Fragment>
                          );
                        })}
                      </ul>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
