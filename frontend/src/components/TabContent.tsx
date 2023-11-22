import { useEffect, useState } from "react";
import { TabItemProps } from "../types/contentful";
import { slugify } from "../utils/slugify";
import { ContentfulRichText } from "../components/ContentfulRichText";
import { Text } from "@contentful/rich-text-types";
import { List, X } from "@phosphor-icons/react";

interface TabContentProps {
  items?: TabItemProps[];
}

const scrollToHeading = (heading: string) => {
  const element = document.getElementById(slugify(heading));
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
};

export const TabContent = ({ items }: TabContentProps) => {
  const [activeTab, setActiveTab] = useState<TabItemProps>();
  const [anchor, setAnchor] = useState<string>("");
  const [openNav, setOpenNav] = useState<boolean>(false);
  const [allHeadings, setAllHeadings] = useState<string[]>([]);

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

  useEffect(() => {
    if (activeTab) {
      setAllHeadings(
        activeTab.copy.json.content
          .filter((obj) => obj.nodeType.match(/^heading-/))
          .map((node) => (node.content[0] as Text).value),
      );
    }
  }, [activeTab]);

  useEffect(() => {
    const headingsLevelOne = document.querySelectorAll(".content h1");
    const headingsLevelTwo = document.querySelectorAll(".content h2");
    const headingsLevelThree = document.querySelectorAll(".content h3");
    const headingsLevelFour = document.querySelectorAll(".content h4");
    const combinedHeadings = [
      ...Array.from(headingsLevelOne),
      ...Array.from(headingsLevelTwo),
      ...Array.from(headingsLevelThree),
      ...Array.from(headingsLevelFour),
    ];
    combinedHeadings.forEach((heading) => {
      const textContent = heading.textContent;
      if (textContent) {
        heading.id = slugify(textContent);
      }
    });
  }, [allHeadings]);

  return (
    <section className="tab-content">
      <div className="container">
        <div className="nav-wrap">
          <div className="toggle-container">
            <button className="usa-button nav-toggle" onClick={() => setOpenNav(!openNav)}>
              Table of Contents {openNav ? <X size={32} /> : <List size={32} />}
            </button>
          </div>
          <nav aria-label="Secondary navigation" className={openNav ? undefined : "closed"}>
            <p className="nav-title">
              <strong>Table of Contents</strong>
            </p>
            <ul className="usa-sidenav">
              {items?.map((item) => {
                return (
                  <li className="usa-sidenav__item" key={item.sys.id}>
                    <a
                      href={`#${slugify(item.heading)}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(item);
                        setOpenNav(false);
                        handleClick(`${slugify(item.heading)}`);
                        window.scrollTo(0, 0);
                      }}
                      className={activeTab?.sys.id === item.sys.id ? "usa-current" : ""}
                    >
                      {item.heading}
                    </a>

                    {allHeadings.length > 0 && activeTab?.sys.id === item.sys.id && (
                      <ul className="usa-sidenav__sublist">
                        {allHeadings.map((heading) => (
                          <li className="usa-sidenav__item" key={heading}>
                            <a
                              href={`#${slugify(heading)}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenNav(false);
                                scrollToHeading(heading);
                              }}
                            >
                              {heading}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {activeTab && (
          <div className="content">
            <h2>{activeTab.heading}</h2>
            <ContentfulRichText document={activeTab.copy.json} assets={activeTab.copy.links} />
          </div>
        )}
      </div>
    </section>
  );
};
