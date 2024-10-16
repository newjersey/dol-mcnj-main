import { IconLinkProps } from "../types/contentful";
import { IconCard } from "./IconCard";
import { SectionHeading } from "./modules/SectionHeading";

interface CardRowProps {
  heading?: string;
  sectionId?: string;
  allSameIcon?: boolean;
  cards: IconLinkProps[];
  theme?: "blue" | "green" | "purple" | "navy";
}

const CardRow = ({ cards, heading, theme, allSameIcon, sectionId }: CardRowProps) => {
  return (
    <div className="card-row" id={sectionId}>
      <div className="container">
        <div className="inner">
          {heading && <SectionHeading heading={heading} theme={theme} />}
          <div className="slider-container">
            {cards.map((card) => {
              const isExternal = card.url.includes("http");
              const cardId = allSameIcon ? sectionId || card.sectionIcon : card.sectionIcon;
              const svgName =
                cardId === "explore"
                  ? "ExploreBold"
                  : cardId === "jobs"
                    ? "JobsBold"
                    : cardId === "support"
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
      </div>
    </div>
  );
};

export default CardRow;
