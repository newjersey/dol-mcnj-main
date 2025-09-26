"use client";
import { LinkObject } from "@components/modules/LinkObject";
import { Spinner } from "@components/modules/Spinner";
import { useEffect, useState } from "react";

export const SideNav = () => {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [currentId, setCurrentId] = useState<string>("");
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  useEffect(() => {
    const allHeadings = Array.from(
      document.querySelectorAll("#pageCopySection h2, #pageCopySection h3")
    ).map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
      level: heading.tagName,
    }));

    if (allHeadings.length === 0) {
      return;
    }

    setHeadings(allHeadings);

    if (allHeadings.length > 0 && !currentId) {
      setCurrentId(allHeadings[0].id);
    }

    const handleScroll = () => {
      if (isScrolling) {
        return;
      }

      const scrollPosition = window.scrollY + 300;

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;

      if (isAtBottom && allHeadings.length > 0) {
        const lastHeadingId = allHeadings[allHeadings.length - 1].id;
        if (lastHeadingId !== currentId) {
          setCurrentId(lastHeadingId);
        }
        return;
      }

      let currentHeadingId = "";
      for (let i = allHeadings.length - 1; i >= 0; i--) {
        const heading = document.getElementById(allHeadings[i].id);
        if (heading && heading.offsetTop <= scrollPosition) {
          currentHeadingId = allHeadings[i].id;
          break;
        }
      }

      if (!currentHeadingId && allHeadings.length > 0) {
        currentHeadingId = allHeadings[0].id;
      }

      if (currentHeadingId && currentHeadingId !== currentId) {
        setCurrentId(currentHeadingId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentId, isScrolling]);

  return (
    <div className="w-[300px] sticky top-8">
      <p className="font-bold">On this page</p>
      <nav aria-label="Secondary navigation">
        <ul className="usa-sidenav">
          {headings.length > 0 ? (
            headings.map((heading) => (
              <li key={heading.id} className="usa-sidenav__item">
                <LinkObject
                  className={`usa-sidenav__link${
                    heading.id === currentId ? " usa-current" : ""
                  }`}
                  url={`#${heading.id}`}
                  onClick={() => {
                    setCurrentId(heading.id);

                    setIsScrolling(true);

                    setTimeout(() => {
                      setIsScrolling(false);
                    }, 1100);
                  }}
                >
                  {heading.text}
                </LinkObject>
              </li>
            ))
          ) : (
            <Spinner color="#005EA2" size={40} />
          )}
        </ul>
      </nav>
    </div>
  );
};
