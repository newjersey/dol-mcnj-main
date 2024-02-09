import { useState } from "react";
import { IntroBlockSectionProps, IntroBlocksProps } from "../types/contentful";
import { IconNames } from "../types/icons";
import { Button } from "./modules/Button";

interface ActiveSectionProps extends IntroBlockSectionProps {
  index: number;
}

const IntroBlocks = ({ heading, message, sectionsHeading, sections }: IntroBlocksProps) => {
  const [activeSection, setActiveSection] = useState<ActiveSectionProps>(
    sections ? { ...sections[0], index: 0 } : { index: 0 },
  );

  // TODO: Remove after both features are live

  if (process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "false" && sections) {
    const index = sections.findIndex((item) => item.title === "Career Pathways");
    if (index !== -1) {
      sections.splice(index, 1);
    }
  }

  if (process.env.REACT_APP_FEATURE_CAREER_NAVIGATOR === "false" && sections) {
    const index = sections.findIndex((item) => item.title === "Career Navigator");
    if (index !== -1) {
      sections.splice(index, 1);
    }
  }

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
                className={activeSection.title === section.title ? "active" : ""}
                onClick={() => {
                  setActiveSection({ ...section, index });
                }}
              >
                {section.title}
              </button>
            ))}
          </div>

          <div className="section-content">
            {activeSection.heading && <p className="heading">{activeSection.heading}</p>}
            {activeSection.message && <p className="message">{activeSection.message}</p>}
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
                url={activeSection.link.url}
                copy={activeSection.link.copy}
                iconSuffix={"ArrowRight" as IconNames}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { IntroBlocks };
