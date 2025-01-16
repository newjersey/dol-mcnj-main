"use client";
import { useEffect, useState } from "react";
import { Text } from "@contentful/rich-text-types";
import { List, X } from "@phosphor-icons/react";
import { TabItemProps } from "@utils/types";
import { slugify } from "@utils/slugify";
import { ContentfulRichText } from "@components/modules/ContentfulRichText";
import { Spinner } from "@components/modules/Spinner";
import { colors } from "@utils/settings";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import MarkdownIt from "markdown-it";

interface TabContentProps {
  items?: TabItemProps[];
}

const mdParser = new MarkdownIt();

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

export const Tabs = ({ items }: TabContentProps) => {
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
        const currentTab = items.find(
          (item) => slugify(item.heading) === anchor
        );
        setActiveTab(currentTab);
      } else {
        setActiveTab(items[0]);
      }
    }
  }, [items, anchor]);

  useEffect(() => {
    if (activeTab?.copy && typeof activeTab.copy === "string") {
      const tokens = mdParser.parse(activeTab.copy, {}); // Parse the Markdown string

      const headings = tokens
        .filter((token) => token.type === "heading_open") // Find all heading tokens
        .map((token) => {
          const nextToken = tokens[tokens.indexOf(token) + 1]; // Get the next inline token
          return nextToken?.content || ""; // Extract the text content
        })
        .filter((heading) => heading); // Filter out empty headings

      setAllHeadings(headings); // Set the headings state
    } else {
      setAllHeadings([]); // Fallback for non-Markdown content
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
            <button
              className="usa-button nav-toggle"
              onClick={() => setOpenNav(!openNav)}
            >
              Table of Contents {openNav ? <X size={32} /> : <List size={32} />}
            </button>
          </div>
          <nav
            aria-label="Secondary navigation"
            className={openNav ? undefined : "closed"}
          >
            <p className="nav-title">
              <strong>Table of Contents</strong>
            </p>
            <ul className="usa-sidenav">
              {items?.map((item) => {
                return (
                  <li className="usa-sidenav__item" key={item.itemId}>
                    <a
                      href={`#${slugify(item.heading)}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(item);
                        setOpenNav(false);
                        handleClick(`${slugify(item.heading)}`);
                        window.scrollTo(0, 0);
                      }}
                      className={
                        activeTab?.itemId === item.itemId ? "usa-current" : ""
                      }
                    >
                      {item.heading}
                    </a>

                    {allHeadings.length > 0 &&
                      activeTab?.itemId === item.itemId && (
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

        <div className="content">
          {activeTab ? (
            <>
              <h2>{activeTab.heading}</h2>
              {typeof activeTab.copy === "string" ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownToHTML(activeTab.copy),
                  }}
                />
              ) : (
                <ContentfulRichText
                  document={activeTab.copy.json}
                  assets={activeTab.copy.links}
                />
              )}
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Spinner size={120} color={colors.primary} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
