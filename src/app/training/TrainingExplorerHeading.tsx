import { TrainingSearch } from "@components/blocks/TrainingSearch";
import { Steps } from "./Steps";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { Heading } from "@components/modules/Heading";
import { LinkObject } from "@components/modules/LinkObject";
import { Button } from "@components/modules/Button";
import { Flex } from "@components/utility/Flex";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { ButtonProps } from "@utils/types";
import { HeadingLevel, SupportedLanguages } from "@utils/types/types";
import { PageHero, PageHeroProps } from "@components/blocks/PageHero";

export interface TrainingExplorerHeadingProps {
  pageHero: PageHeroProps;
  search: {
    heading: {
      level: HeadingLevel;
      heading: string;
    };
    toolTip: {
      screenReader: string;
      copy: string;
    };
    clearButton: ButtonProps;
    form: {
      inputLabel: string;
      filterHeading: string;
      miles: {
        label: string;
        milesPlaceholder: string;
        zipPlaceholder: string;
        zipError: string;
      };
      costLabel: string;
      format: {
        label: string;
        inPersonLabel: string;
        onlineLabel: string;
      };
      submitLabel: string;
    };
  };
  lang?: SupportedLanguages;
  steps: string[];
  notReady: {
    copy: string;
    buttons: ButtonProps[];
  };
  learnMore: {
    url: string;
    copy: string;
  };
}

export const TrainingExplorerHeading = ({
  steps,
  search,
  notReady,
  pageHero,
  learnMore,
}: TrainingExplorerHeadingProps) => {
  return (
    <section className="training-explorer-heading">
      <PageHero {...pageHero} />
      <div className="container">
        <Steps items={steps} className="desktop-only" />
        <TrainingSearch content={search} />
        <Steps items={steps} className="mobile-only" />

        <div className="learn-more">
          <p>
            {learnMore.copy}{" "}
            <LinkObject url={learnMore.url}>Learn more</LinkObject>
          </p>
        </div>
        <div className="cta">
          <p className="heading-tag text-lrg">
            <strong>{notReady.copy}</strong>
          </p>
          <Flex
            columnBreak="sm"
            alignItems="center"
            justifyContent="center"
            gap="xs"
          >
            {notReady.buttons.map((button) => (
              <Button {...button} key={button.label} />
            ))}
          </Flex>
        </div>
      </div>
    </section>
  );
};
