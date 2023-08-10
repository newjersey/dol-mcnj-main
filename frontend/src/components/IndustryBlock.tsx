import { Fire, Info, Star, X } from "@phosphor-icons/react";
import { IndustryProps } from "../types/contentful";
import { ContentfulRichText } from "./ContentfulRichText";
import { Selector } from "../svg/Selector";
import { Accordion } from "./Accordion";
import { useEffect, useState } from "react";

export const IndustryBlock = ({
  description,
  industryAccordionCollection: accordionData,
  photo,
  slug,
  title,
  shorthandTitle,
}: IndustryProps) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const numberedLists = document.querySelectorAll(".accordion-wrapper ol");

      Array.from(numberedLists).forEach((list: Element) => {
        const listItems = list.querySelectorAll("li");

        Array.from(listItems).forEach((item: Element, index: number) => {
          item.setAttribute("data-number", `${index + 1}`);
        });
      });

      const overlay = document.querySelector(".overlay");
      if (overlay) {
        overlay.addEventListener("click", () => {
          setOpen(false);
        });
      }
    }
  }, []);

  return (
    <section className="industry-block">
      <div className="container plus button">
        <button
          type="button"
          title="Explore Industry"
          className="explore-button"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <Info size={22} color="#000" />

          <span>
            What is <strong>{shorthandTitle || title}</strong> like in New Jersey?
          </span>
        </button>
      </div>

      <div className={`overlay${open ? " open" : ""}`} />
      <div className={`panel${open ? " open" : ""}`}>
        <button title="Close" className="close" onClick={() => setOpen(false)} type="button">
          <X size={28} />
          <div className="sr-only">Close</div>
        </button>

        <div className="heading">
          <h2>
            <span>{shorthandTitle || title} in New Jersey</span>
          </h2>
        </div>
        <div className="content-wrapper">
          <div className="copy">
            <ContentfulRichText document={description.json} assets={description.links} />
            {photo && <img src={photo.url} alt={title} className="photo" />}
          </div>
          <div className="accordion-wrapper">
            {accordionData.items.map(
              (item, index) =>
                index < 3 && (
                  <Accordion
                    key={item.sys.id}
                    open
                    title={
                      <>
                        {index === 1 ? <Fire /> : index === 2 ? <Star /> : <Selector name={slug} />}
                        <span>{item.title}</span>
                      </>
                    }
                    content={item.copy.json}
                    assets={item.copy.links}
                    keyValue={index}
                  />
                ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
