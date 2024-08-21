import { TrainingSearch } from "@components/blocks/TrainingSearch";
import { Steps } from "./Steps";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { Heading } from "@components/modules/Heading";
import { LinkObject } from "@components/modules/LinkObject";
import { Button } from "@components/modules/Button";
import { Flex } from "@components/utility/Flex";

const stepContent = [
  "Search by occupation, provider, and more",
  "Filter and compare results",
  "Visit training provider’s website to enroll",
];

export const TrainingExplorerHeading = ({ heading }: { heading: string }) => {
  return (
    <section className="training-explorer-heading">
      <div className="container">
        <Breadcrumbs
          crumbs={[
            {
              url: "/",
              copy: "Home",
            },
          ]}
          pageTitle={heading}
        />
        <Heading level={1} className="main">
          {heading}
        </Heading>
        <Steps items={stepContent} className="desktop-only" />
        <TrainingSearch />
        <Steps items={stepContent} className="mobile-only" />
        <div className="learn-more">
          <p>
            Trainings and programs on the Training Explorer are accredited.{" "}
            <LinkObject url="/faq#etpl-program-general-information">
              Learn more
            </LinkObject>
          </p>
        </div>
        <div className="cta">
          <p className="heading-tag text-lrg">
            <strong>Not ready to search for training yet?</strong>
          </p>
          <Flex
            columnBreak="sm"
            alignItems="center"
            justifyContent="center"
            gap="xs"
          >
            <Button
              outlined
              type="link"
              link="https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=&location=New%20Jersey&radius=25&source=NLX&curPage=1&referer=%2FToolkit%2FJobs%2Ffind-jobs.aspx"
              iconSuffix="ArrowSquareOut"
            >
              Search for jobs
            </Button>
            <Button
              outlined
              defaultStyle="secondary"
              type="link"
              link="/support-resources/tuition-assistance"
              iconSuffix="ArrowRight"
            >
              Find out about tuition resources
            </Button>
          </Flex>
        </div>
      </div>
    </section>
  );
};
