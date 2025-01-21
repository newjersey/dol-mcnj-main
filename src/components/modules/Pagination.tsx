"use client";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { ResultsContext } from "app/training/search/components/Results";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

export const Pagination = () => {
  const [breakCount, setBreakCount] = useState(0);
  const [loading, setLoading] = useState(true);

  let { results } = useContext(ResultsContext);

  useEffect(() => {
    const breakElements = document.querySelectorAll(
      ".usa-pagination .usa-pagination__overflow"
    );
    breakElements.forEach((element, index) => {
      element.setAttribute("aria-label", `Break ${index + 1}`);
    });
    const pageElements = document.querySelectorAll(".usa-pagination li");

    if (breakElements.length === 0) {
      setBreakCount(0);
    }

    if (breakElements.length === 1) {
      setBreakCount(1);
    }

    if (breakElements.length > 1) {
      setBreakCount(2);
      for (let i = 0; i < breakElements.length - 1; i++) {
        const start = breakElements[i];
        const end = breakElements[i + 1];
        const startIndex = Array.from(pageElements).indexOf(start);
        const endIndex = Array.from(pageElements).indexOf(end);
        for (let j = startIndex + 1; j < endIndex; j++) {
          pageElements[j].classList.add("middle");
        }
      }
      for (let i = 0; i < pageElements.length; i++) {
        if (i < Array.from(pageElements).indexOf(breakElements[0])) {
          if (!pageElements[i].classList.contains("control")) {
            pageElements[i].classList.add(`start_${i}`);
          }
        }
        if (
          i >
          Array.from(pageElements).indexOf(
            breakElements[breakElements.length - 1]
          )
        ) {
          if (!pageElements[i].classList.contains("control")) {
            pageElements[i].classList.add(
              `end_${
                i -
                Array.from(pageElements).indexOf(
                  breakElements[breakElements.length - 1]
                )
              }`
            );
          }
        }
      }
    } else {
      for (let i = 0; i < pageElements.length; i++) {
        if (
          !pageElements[i].classList.contains("control") &&
          !pageElements[i].classList.contains("selected")
        ) {
          pageElements[i].classList.remove("middle");
          pageElements[i].classList.remove(`start_${i}`);
          pageElements[i].classList.remove(
            `end_${i - Array.from(pageElements).indexOf(breakElements[0])}`
          );
        }
      }
    }
  }, [results.pageNumber, results.totalPages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(false);
    }
  }, []);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`usa-pagination${
        breakCount === 1
          ? " single-break"
          : breakCount === 2
          ? " multi-break"
          : " no-break"
      }`}
    >
      {!loading && (
        <ReactPaginate
          ariaLabelBuilder={(page) => `Go to page ${page}`}
          breakLabel="..."
          forcePage={results.pageNumber - 1}
          className="usa-pagination__list"
          nextClassName="control usa-pagination__item usa-pagination__arrow"
          nextLinkClassName="usa-pagination__link usa-pagination__next-page"
          previousClassName="control usa-pagination__item usa-pagination__arrow"
          previousLinkClassName="usa-pagination__link usa-pagination__previous-page"
          pageClassName="usa-pagination__item usa-pagination__page-no"
          pageLinkClassName="usa-pagination__button"
          breakClassName="usa-pagination__item usa-pagination__overflow"
          activeLinkClassName="usa-pagination__button usa-current"
          previousLabel={
            <>
              <CaretLeft className="usa-icon" size={20} weight="bold" />
              <span className="usa-pagination__link-text">Prev</span>
            </>
          }
          nextLabel={
            <>
              <span className="usa-pagination__link-text">Next</span>
              <CaretRight className="usa-icon" size={20} weight="bold" />
            </>
          }
          pageCount={results.totalPages}
          renderOnZeroPageCount={null}
          pageRangeDisplayed={2}
          onPageChange={(page) => {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set("p", `${page.selected + 1}`);
            window.location.href = newUrl.toString();
          }}
          hrefBuilder={(page) => {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set("p", `${page}`);
            return newUrl.toString();
          }}
        />
      )}
    </nav>
  );
};
