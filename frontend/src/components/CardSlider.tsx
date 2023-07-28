import { useState } from "react";
import { IconLinkProps } from "../types/contentful";
import { IconCard } from "./IconCard";
import { SectionHeading } from "./modules/SectionHeading";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface CardSliderProps {
  heading?: string;
  sectionId?: string;
  cards: IconLinkProps[];
  theme?: "blue" | "green" | "purple" | "navy";
}

const CardSlider = ({ cards, heading, theme, sectionId }: CardSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideLeft = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const slideRight = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const showLeftArrow = currentIndex > 0;
  const showRightArrow = currentIndex < cards.length - 4.5;

  return (
    <div className="card-slider" id={sectionId}>
      <div className="container">
        <div className="inner">
          {heading && <SectionHeading heading={heading} theme={theme} />}
          <div
            className="slider-container"
            style={{ transform: `translateX(-${currentIndex * (100 / 4.5)}%)` }}
          >
            {cards.map((card) => {
              const isExternal = card.url.includes("http");
              const svgName =
                card.sectionIcon === "explore"
                  ? "ExploreBold"
                  : card.sectionIcon === "jobs"
                  ? "JobsBold"
                  : card.sectionIcon === "support"
                  ? "SupportBold"
                  : "TrainingBold";
              return (
                <IconCard
                  svg={svgName}
                  icon={card.icon}
                  title={card.copy}
                  theme={theme}
                  url={card.url}
                  key={card.sys.id}
                  description={card.description}
                  indicator={isExternal ? "ArrowUpRight" : undefined}
                />
              );
            })}
          </div>
        </div>
        {showLeftArrow && (
          <button className="arrow left" onClick={slideLeft}>
            <CaretLeft size={32} weight="bold" />
          </button>
        )}
        {showRightArrow && (
          <button className="arrow right" onClick={slideRight}>
            <CaretRight size={32} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CardSlider;
