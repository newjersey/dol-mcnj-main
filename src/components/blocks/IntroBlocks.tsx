"use client";
import { Button } from "@components/modules/Button";
import { IntroBlockSectionProps, IntroBlocksProps } from "@utils/types";
import { useState } from "react";

interface ActiveSectionProps extends IntroBlockSectionProps {
  index: number;
}

const IntroBlocks = ({
  heading,
  message,
  sectionsHeading,
  sections,
}: IntroBlocksProps) => {
  const [activeSection, setActiveSection] = useState<ActiveSectionProps>(
    sections ? { ...sections[0], index: 0 } : { index: 0 },
  );

  return (
    <section className="introBlocks">
      <div className="heading-box box">
        <div className="inner">
          {heading && <h2>{heading}</h2>}
          {message && <p>{message}</p>}
        </div>
      </div>
      <div className="sections-box box">
        <div className="inner">
          {sectionsHeading && <h2>{sectionsHeading}</h2>}
          <div className="buttons">
            {sections?.map((section, index) => (
              <button
                key={section.title}
                className={
                  activeSection.title === section.title ? "active" : ""
                }
                onClick={() => {
                  setActiveSection({ ...section, index });
                }}
              >
                {section.title}
              </button>
            ))}
          </div>

          <div className="section-content">
            {activeSection.heading && (
              <p className="heading">{activeSection.heading}</p>
            )}
            {activeSection.message && (
              <p className="message">{activeSection.message}</p>
            )}
            {activeSection.link?.url && (
              <Button
                className={`usa-button${
                  activeSection.index % 4 === 0
                    ? " secondary"
                    : activeSection.index % 4 === 1
                      ? " tertiary"
                      : activeSection.index % 4 === 2
                        ? " primary"
                        : " quaternary"
                }`}
                type="link"
                link={activeSection.link.url}
                iconSuffix="ArrowRight"
              >
                {activeSection.link.copy}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { IntroBlocks };
