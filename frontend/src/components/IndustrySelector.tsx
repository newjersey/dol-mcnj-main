import { ArrowRight, Info, Star, X } from "@phosphor-icons/react";
import { content } from "../career-pathways-page/content";
import { Heading } from "./modules/Heading";
import { LinkObject } from "./modules/LinkObject";
import { useEffect, useState } from "react";
import { Selector, SelectorProps } from "../svg/Selector";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";

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
  description?: string;
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

        <Heading level={3}>{shorthandTitle || title} in New Jersey</Heading>

        <div className="copy">
          {description && <p>{description}</p>}
          {photo && <img src={photo} alt={title} className="photo" />}
        </div>

        <div className="boxes-wrapper">
          {drawerCards.map((card) => (
            <div className="box">
              <div className="heading-bar">
                {card.icon ? <Selector name={card.icon} /> : <Star size={32} />}
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
    </>
  );
};

export const IndustrySelector = () => {
  const [activePanel, setActivePanel] = useState<number | null>(null);

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

  useEffect(() => {
    if (activePanel !== null) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activePanel]);

  return (
    <section className="industry-selector">
      <div className="container">
        <div className="inner">
          <Heading level={2}>{content.industrySelector.heading}</Heading>

          <ul className="unstyled">
            {content.industrySelector.items.map((props, index) => {
              const {
                image,
                title,
                slug,
                description,
                shorthandTitle,
                drawerDescription,
                active,
                drawerCards,
              } = props;
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
                      className="usa-button usa-button--unstyled"
                      onClick={() => {
                        setActivePanel(index);
                      }}
                    >
                      <Info size={22} weight="bold" />
                      <span>Learn more</span>
                    </button>
                  </div>
                  <Panel
                    open={activePanel === index}
                    drawerCards={drawerCards}
                    setOpen={setActivePanel}
                    photo={image}
                    description={drawerDescription}
                    title={title}
                    shorthandTitle={shorthandTitle}
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
