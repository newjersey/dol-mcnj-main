import { Heading } from "./modules/Heading";
import { SearchBlock } from "./SearchBlock";
import { ContentfulRichText } from "../types/contentful";
import { LinkObject } from "./modules/LinkObject";
import { ArrowSquareOut, ArrowRight } from "@phosphor-icons/react";

export const TrainingExplorerHeading = ({
  steps,
  drawerContent,
}: {
  steps: string[];
  title: string;
  drawerContent: ContentfulRichText;
}) => {
  const HowTo = ({ className }: { className: string }) => (
    <div className={`how-to-steps-section ${className}`}>
      <ul className="unstyled">
        {steps.map((step, index) => (
          <li key={step}>
            <div className="list-num-container">
              <div className="list-num">{index + 1}</div>
            </div>
            <div className="list-info">
              <p>{step}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <section className="training-explorer-heading">
      <div className="container">
        <SearchBlock drawerContent={drawerContent} />
        <HowTo className="mobile-only" />

        <div className="cta">
          <Heading level={2}>Not ready to search for training yet?</Heading>
          <div className="btns">
            <LinkObject
              url="https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=&location=New%20Jersey&radius=25&source=NLX&curPage=1&referer=%2FToolkit%2FJobs%2Ffind-jobs.aspx"
              className="usa-button usa-button--outline bg-white margin-right-0 primary"
            >
              Search for jobs
              <ArrowSquareOut size={24} />
            </LinkObject>
            <LinkObject
              url="/support-resources/tuition-assistance"
              className="usa-button usa-button--outline bg-white margin-right-0 secondary"
            >
              Find out about tuition resources
              <ArrowRight size={24} />
            </LinkObject>
          </div>
        </div>
      </div>
    </section>
  );
};
