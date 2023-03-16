import { useEffect, useState } from "react";
import { TabItemProps } from "../types/contentful";
import { slugify } from "../utils/slugify";
import { ContentfulRichText } from "../components/ContentfulRichText";

interface TabContentProps {
  items: TabItemProps[];
}

export const TabContent = ({ items }: TabContentProps) => {
  const [activeTab, setActiveTab] = useState<TabItemProps>();
  const [anchor, setAnchor] = useState<string>("");

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
          <ul className="tab-list">
            {items?.map((item) => {
              return (
                <li key={item.sys.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item);
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
          <>
            <h2>{activeTab.heading}</h2>
            <ContentfulRichText document={activeTab.copy.json} />
          </>
        )}
      </div>
    </section>
  );
};
