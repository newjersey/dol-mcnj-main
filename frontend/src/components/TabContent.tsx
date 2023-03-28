import { useEffect, useState } from "react";
import { TabItemProps } from "../types/contentful";
import { slugify } from "../utils/slugify";
import { ContentfulRichText } from "../components/ContentfulRichText";
import { Select } from "../svg/Select";

interface TabContentProps {
  items: TabItemProps[];
}

export const TabContent = ({ items }: TabContentProps) => {
  const [activeTab, setActiveTab] = useState<TabItemProps>();
  const [anchor, setAnchor] = useState<string>("");
  const [openNav, setOpenNav] = useState<boolean>(false);

  const handleClick = (newAnchor: string) => {
    setAnchor(newAnchor);
    const newUrl = window.location.href.replace(/#.*/, "") + "#" + newAnchor;
    window.history.replaceState({}, "", newUrl);
  };

  useEffect(() => {
    if (items?.length) {
      if (window.location.href.split("#")[1]) {
        setAnchor(window.location.href.split("#")[1]);
      }

      if (anchor) {
        const currentTab = items.find((item) => slugify(item.heading) === anchor);
        setActiveTab(currentTab);
      } else {
        setActiveTab(items[0]);
      }
    }
  }, [items, anchor]);

  return (
    <section className="tab-content">
      <div className="container">
        <nav>
          <button
            className="drop-selector"
            data-testid="drop-selector"
            onClick={() => {
              setOpenNav(!openNav);
            }}
          >
            {activeTab?.heading}
            <Select />
          </button>
          <ul className={`tab-list${openNav ? " open" : ""}`}>
            {items?.map((item) => {
              return (
                <li key={item.sys.id}>
                  <button
                    data-testid={`tab-${item.sys.id}`}
                    className={activeTab?.sys.id === item.sys.id ? "active" : ""}
                    onClick={() => {
                      setActiveTab(item);
                      setOpenNav(false);
                      handleClick(`${slugify(item.heading)}`);
                    }}
                  >
                    {item.heading}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        {activeTab && (
          <div className="content">
            <h2>{activeTab.heading}</h2>
            <ContentfulRichText document={activeTab.copy.json} />
          </div>
        )}
      </div>
    </section>
  );
};
