import { IconLinkProps } from "../types/contentful";
import { IconCard } from "./IconCard";
import { SectionHeading } from "./modules/SectionHeading";

interface CardRowProps {
  heading?: string;
  sectionId?: string;
  cards: IconLinkProps[];
  theme?: "blue" | "green" | "purple" | "navy";
}

const CardRow = ({ cards, heading, theme, sectionId }: CardRowProps) => {
  return (
    <div className="card-row" id={sectionId}>
      <div className="container">
        <div className="inner">
          {heading && <SectionHeading heading={heading} theme={theme} />}
          <div className="slider-container">
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
      </div>
    </div>
  );
};

export default CardRow;
