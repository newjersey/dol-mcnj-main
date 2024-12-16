import { TrainingSearch } from "@components/blocks/TrainingSearch";
import { Steps } from "./Steps";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { Heading } from "@components/modules/Heading";
import { LinkObject } from "@components/modules/LinkObject";
import { Button } from "@components/modules/Button";
import { Flex } from "@components/utility/Flex";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { ButtonProps } from "@utils/types";

export const TrainingExplorerHeading = ({
  heading,
  subheading,
  message,
  steps,
  breadcrumbs,
  notReady,
  learnMore,
}: {
  heading: string;
  subheading?: string;
  message?: string;
  steps: string[];
  breadcrumbs: { url: string; copy: string }[];
  notReady: {
    copy: string;
    buttons: ButtonProps[];
  };
  learnMore: {
    url: string;
    copy: string;
  };
}) => {
  return (
    <section className="training-explorer-heading">
      <div className="container">
        <Breadcrumbs crumbs={breadcrumbs} pageTitle={heading} />
        <Heading level={1} className="main">
          {heading}
        </Heading>
        {subheading && <p className="subheading">{subheading}</p>}
        {message && (
          <div
            className="message"
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(message),
            }}
          />
        )}
        <Steps items={steps} className="desktop-only" />
        <TrainingSearch />
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
