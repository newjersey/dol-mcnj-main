import { ArrowRight, DotsThreeVertical, Fire, X } from "@phosphor-icons/react";
import { content } from "../career-pathways-page/content";
import { Heading } from "./modules/Heading";
import { LinkObject } from "./modules/LinkObject";
import { useEffect, useState } from "react";
import { Selector, SelectorProps } from "../svg/Selector";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";
// import { Accordion } from "./Accordion";
// import { Selector } from "../svg/Selector";

const Panel = ({
  open,
  setOpen,
  photo,
  description,
  title,
  shorthandTitle,
  drawerCards,
}: {
  open: boolean;
  photo: string;
  description: string;
  title: string;
  setOpen: (index: number | null) => void;
  shorthandTitle?: string;
  drawerCards: {
    icon?: SelectorProps["name"];
    title: string;
    copy: string;
  }[];
}) => {
  return (
    <>
      <div className={`overlay${open ? " open" : ""}`} />
      <div className={`panel${open ? " open" : ""}`}>
        <button
          aria-label="Close"
          title="Close"
          className="close"
          onClick={() => setOpen(null)}
          type="button"
        >
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
            <p>{description}</p>
            <img src={photo} alt={title} className="photo" />
          </div>
          <div className="accordion-wrapper">
            {drawerCards.map((card) => (
              <div className="box">
                <div className="heading-bar">
                  {card.icon ? <Selector name={card.icon} /> : <Fire size={32} />}
                  {card.title}
                </div>
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(card.copy) }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const IndustrySelector = () => {
  const [activePanel, setActivePanel] = useState<number | null>();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePanel(null);
      }
    };

    const handleClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).classList.contains("overlay")) {
        setActivePanel(null);
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="industry-selector">
      <div className="container">
        <div className="inner">
          <Heading level={2}>{content.industrySelector.heading}</Heading>

          <ul className="unstyled">
            {content.industrySelector.items.map((props, index) => {
              const { image, title, slug, description, active, drawerCards } = props;
              return (
                <li key={image}>
                  <div>
                    <div className="heading-section">
                      <p className="title">{title}</p>
                      <span className={`tag-item color-${active ? "purple" : "navy"}`}>
                        {active ? "Pathway included" : "Pathway coming soon"}
                      </span>
                      <div className="image">
                        <img src={image} alt={title} />
                      </div>
                    </div>
                    <p>{description}</p>
                  </div>
                  <div className="buttons">
                    <LinkObject
                      url={`/career-pathways/${slug}`}
                      className="usa-button margin-right-0 primary"
                    >
                      Explore <ArrowRight size={22} />
                    </LinkObject>
                    <button
                      className="usa-button usa-button--outline bg-white margin-right-0 primary"
                      onClick={() => {
                        setActivePanel(index);
                      }}
                    >
                      Learn more <DotsThreeVertical size={22} weight="bold" />
                    </button>
                  </div>
                  <Panel
                    open={activePanel === index}
                    drawerCards={drawerCards}
                    setOpen={setActivePanel}
                    photo={image}
                    description={description}
                    title={title}
                    shorthandTitle={slug}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
