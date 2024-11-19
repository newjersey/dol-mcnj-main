import { IconCard } from "@components/modules/IconCard";
import { SectionHeading } from "@components/modules/SectionHeading";
import { Grid } from "@components/utility/Grid";

import { CardSliderProps, SectionIcons } from "@utils/types";

const CardSlider = ({
  className,
  theme,
  heading,
  sectionId,
  cards,
}: CardSliderProps) => {
  return (
    <section
      className={`cardSlider${className ? ` ${className}` : ""}`}
      id={sectionId}
    >
      <div className="container">
        <div className="inner">
          {heading && <SectionHeading color={theme} heading={heading} />}
          <Grid gap="md" columns={4} className="slider-container">
            {cards.map((card, index: number) => {
              const isExternal = card.url?.includes("http");

              return (
                <IconCard
                  key={card.sys.id}
                  {...card}
                  icon={sectionId ? undefined : card.icon}
                  theme={theme}
                  indicator={isExternal ? "ArrowSquareOut" : undefined}
                  systemIcon={sectionId as SectionIcons}
                  message={card.description}
                />
              );
            })}
          </Grid>
        </div>
      </div>
    </section>
  );
};

export { CardSlider };
