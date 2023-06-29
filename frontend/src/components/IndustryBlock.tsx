import { ArrowCircleDown } from "@phosphor-icons/react";
import { IndustryProps } from "../types/contentful";
import { ContentfulRichText } from "./ContentfulRichText";
import { Selector } from "../svg/Selector";
import { Accordion } from "./Accordion";
import { useEffect } from "react";

export const IndustryBlock = ({
  description,
  industryAccordionCollection: accordionData,
  photo,
  slug,
  sys,
  title,
}: IndustryProps) => {
  const scrollToIndustry = () => {
    const industryContainer = document.getElementById("industry-container");
    if (industryContainer) {
      industryContainer.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const numberedLists = document.querySelectorAll(".accordion-wrapper ol");

      Array.from(numberedLists).forEach((list: Element) => {
        const listItems = list.querySelectorAll("li");

        Array.from(listItems).forEach((item: Element, index: number) => {
          item.setAttribute("data-number", `${index + 1}`);
        });
      });
    }
  }, []);

  return (
    <section className="industry-block">
      <button
        type="button"
        className="explore-button"
        onClick={() => {
          scrollToIndustry();
        }}
      >
        <ArrowCircleDown size={32} color="#000" />
        <span>
          Explore <span>{title.toLowerCase()}</span> pathways below
        </span>
      </button>
      <div className="container" id="industry-container">
        <div className="heading">
          <h2>
            <Selector name={slug} />
            <span>{title} Industry Information</span>
          </h2>
        </div>
        <div className="content-wrapper">
          <div className="copy">
            <ContentfulRichText document={description.json} />
            {photo && <img src={photo.url} alt={title} className="photo" />}
          </div>
          <div className="accordion-wrapper">
            {accordionData.items.map((item, index) => (
              <Accordion
                key={item.sys.id}
                open={index === 0}
                title={
                  <>
                    {item.icon ? (
                      <img src={item.icon.url} width={32} alt="" />
                    ) : (
                      <Selector name={slug} />
                    )}
                    <span>{item.title}</span>
                  </>
                }
                content={item.copy.json}
                keyValue={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
