import { NavMenuData } from "../../types/contentful";
import { LinkObject } from "./LinkObject";

export const NavMenu = ({
  menu,
  className,
  label,
  innerClassName,
  icons = false,
  headingLevel,
  id,
}: {
  menu?: NavMenuData;
  id?: string;
  className?: string;
  innerClassName?: string;
  label?: string;
  icons?: boolean;
  internalLinks?: boolean;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}) => {
  const Heading = headingLevel
    ? (`h${headingLevel}` as keyof JSX.IntrinsicElements)
    : ("span" as keyof JSX.IntrinsicElements);
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
            return (
              <li
                key={item.sys.id}
                className={`nav-item${item.classes ? ` ${item.classes}` : ""}${
                  hasSub ? " has-sub" : " no-sub"
                }`}
              >
                <LinkObject icons={icons} {...item} />
                {hasSub && (
                  <ul className="unstyled">
                    {item.subItemsCollection?.items.map((subItem) => (
                      <li key={subItem.sys?.id}>
                        <LinkObject icons={icons} {...subItem} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
