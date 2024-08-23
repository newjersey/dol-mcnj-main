"use client";
import { ContentfulRichText } from "@components/modules/ContentfulRichText";
import { Spinner } from "@components/modules/Spinner";
import { List, X } from "@phosphor-icons/react";
import { parseHeadingsToNestedArray } from "@utils/parseHeadingsToNestedArray";
import { slugify } from "@utils/slugify";
import { ContentfulRichTextProps } from "@utils/types";
import { useEffect, useState } from "react";

interface Heading {
  title: string;
  elementId: string;
  items?: Heading[];
}

export const Article = ({ content }: { content: ContentfulRichTextProps }) => {
  const [headingArray, setHeadingArray] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState<Heading | null>(null);
  const [openNav, setOpenNav] = useState<boolean>(false);

  useEffect(() => {
    const headings = document.querySelectorAll("h2, h3, h4, h5");
    headings.forEach((heading) => {
      const text = heading.textContent;
      if (text) {
        heading.id = slugify(text);
      }
    });
    const rootElement = document.getElementById("contentBody") as HTMLElement;
    const result = parseHeadingsToNestedArray(rootElement);

    setHeadingArray(result);
    setActiveHeading(result[0]);
  }, []);

  return (
    <div className="article">
      <div className="container narrow" id="contentBody">
        <div className="inner">
          <div className="nav-wrapper">
            <div className="toggle-container mobile-only">
              <button
                className="usa-button nav-toggle"
                onClick={() => setOpenNav(!openNav)}
              >
                Table of Contents{" "}
                {openNav ? <X size={32} /> : <List size={32} />}
              </button>
            </div>
            <nav
              aria-label="Secondary navigation"
              className={openNav ? "open" : undefined}
            >
              {headingArray.length === 0 ? (
                <Spinner color="#005ea2" size={80} />
              ) : (
                <>
                  <p className="nav-title desktop-only">
                    <strong>Table of Contents</strong>
                  </p>
                  <ul className="usa-sidenav">
                    {headingArray.map((item) => (
                      <li key={item.elementId} className="usa-sidenav__item">
                        <a
                          href={`#${item.elementId}`}
                          className={
                            activeHeading?.elementId === item.elementId
                              ? "usa-current"
                              : undefined
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveHeading(item);

                            // if there are no subheadings, scroll to the heading
                            if (!item.items || item.items.length === 0) {
                              setOpenNav(false);
                              const element = document.getElementById(
                                item.elementId,
                              ) as HTMLElement;
                              element.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }
                          }}
                        >
                          {item.title}
                        </a>
                        {item.items &&
                          item.items.length > 0 &&
                          item.elementId === activeHeading?.elementId && (
                            <ul className="usa-sidenav__sublist">
                              {item.items.map((subItem) => (
                                <li
                                  className={`usa-sidenav__item`}
                                  key={subItem.elementId}
                                >
                                  <a
                                    href={`#${subItem.elementId}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setOpenNav(false);

                                      // smooth scroll to the heading
                                      const element = document.getElementById(
                                        subItem.elementId,
                                      ) as HTMLElement;
                                      element.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                      });
                                    }}
                                  >
                                    {subItem.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </nav>
          </div>

          <ContentfulRichText
            className="content"
            document={content.json}
            assets={content.links}
          />
        </div>
      </div>
    </div>
  );
};
