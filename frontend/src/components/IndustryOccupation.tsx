import { useState } from "react";
import {
  ArrowSquareOut,
  ArrowUpRight,
  // ArrowsInSimple,
  // ArrowsOutSimple,
  Briefcase,
  Info,
  RocketLaunch,
  // X,
} from "@phosphor-icons/react";
import { OccupationCopyColumn } from "./modules/OccupationCopyColumn";
import { RelatedTrainingSearch } from "./modules/RelatedTrainingSearch";
import { toUsCurrency } from "../utils/toUsCurrency";
import { numberWithCommas } from "../utils/numberWithCommas";
import { Selector } from "../svg/Selector";
import { OccupationNodeProps } from "../types/contentful";
import { SectionHeading } from "./modules/SectionHeading";
import { InDemandTag } from "./InDemandTag";
import { Tooltip } from "@material-ui/core";
import { Client } from "../domain/Client";

interface OccupationDetailsProps {
  industryTitle: string;
  occupationDetails?: OccupationNodeProps[];
  client: Client;
}

export const IndustryOccupation = ({
  industryTitle,
  occupationDetails,
  client
}: OccupationDetailsProps) => {
  const [selectedOccupation, setSelectedOccupation] = useState<OccupationNodeProps>();
  const [open, setOpen] = useState<boolean>(false);

  // if props.industry starts with a vowel, use "an" instead of "a"
  const article = industryTitle
    ? ["a", "e", "i", "o", "u"].includes(industryTitle.charAt(0).toLowerCase())
      ? "an"
      : "a"
    : "a";

  return (
    <div className="occupation-block">
      <div className="container plus">
        <SectionHeading
          heading={`Select ${article} ${industryTitle} Occupation`}
          description="Select a field and explore different career pathways or click the tool tip to learn more about it."
        />
        <div className="occupation-selector">
          <label htmlFor="occupation-selector">
            Select an in-demand {industryTitle.toLocaleLowerCase()} occupation
            <button
              type="button"
              aria-label="occupation selector"
              className="select-button"
              onClick={() => {
                setOpen(!open);
              }}
            >
              {selectedOccupation?.shortTitle || selectedOccupation?.title || "Please choose an occupation"}
            </button>
          </label>
          {open && (
            <div className="dropdown-select">
              {occupationDetails?.map((item) => (
                <button
                  aria-label="occupation-item"
                  type="button"
                  key={item.sys.id}
                  className="occupation"
                  onClick={() => {
                    setSelectedOccupation(item);
                    setOpen(false);
                  }}
                >
                  {item.shortTitle ?  item.shortTitle : item.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedOccupation && (
        <div className="career-detail occupation-block">
          <div className="container plus">
            <div className="occupation-box">
              <div className="container plus">
                <div className="heading">
                  <div>
                    <h3>{selectedOccupation.title}</h3>
                    {selectedOccupation.inDemand && <InDemandTag />}
                    {selectedOccupation.description && <p>{selectedOccupation.description}</p>}
                  </div>
                  <div className="meta">
                    <div>
                      <p className="title">
                        Median Salary{" "}
                        <Tooltip placement="top" title="TEST">
                          <Info size={20} weight="fill" />
                        </Tooltip>
                      </p>
                      <p>
                        {selectedOccupation.medianSalary
                          ? toUsCurrency(selectedOccupation.medianSalary)
                          : "---"}
                      </p>
                    </div>
                    <div>
                      <p className="title">
                        Jobs Open in NJ{" "}
                        <Tooltip placement="top" title="TEST">
                          <Info size={20} weight="fill" />
                        </Tooltip>
                      </p>
                      <p>
                        <strong>
                          {selectedOccupation.numberOfAvailableJobs
                            ? numberWithCommas(selectedOccupation.numberOfAvailableJobs)
                            : "---"}
                        </strong>
                      </p>
                      <a
                        href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${
                          selectedOccupation.trainingSearchTerms || selectedOccupation.title
                        }&amp;location=New%20Jersey&amp;radius=0&amp;source=NLX&amp;currentpage=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>See current job openings</span>
                        <ArrowSquareOut size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="occu-row related">
            <div>
              <OccupationCopyColumn {...selectedOccupation} />
            </div>
            <div>
              <div className="box">
                <div className="heading-bar">
                  <RocketLaunch size={32} />
                  Related Training Opportunities
                </div>

                <div className="content related-training">
                  <ul className="unstyled">
                    <RelatedTrainingSearch
                      query={
                        selectedOccupation.trainingSearchTerms || selectedOccupation.title
                      }
                      client={client}
                    />
                  </ul>
                  <a
                    className="usa-button"
                    href={`/search/${selectedOccupation.title.toLowerCase()}`}
                  >
                    <span>
                      <Selector name="trainingBold" />
                      See more trainings on the Training Explorer
                    </span>
                    <ArrowUpRight size={20} />
                  </a>
                  <a className="usa-button" href="/tuition-assistance">
                    <span>
                      <Selector name="supportBold" />
                      Learn more financial assistance opportunities
                    </span>
                    <ArrowUpRight size={20} />
                  </a>
                </div>
              </div>
              <div className="box related-jobs">
                <div className="heading-bar">
                  <Briefcase size={32} />
                  Related Job Opportunities
                </div>
                <div className="content">
                  <a
                    className="usa-button usa-button--secondary"
                    href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${selectedOccupation.title.toLowerCase()}&location=New%20Jersey&radius=0&source=NLX&currentpage=1&pagesize=100`}
                  >
                    <span>
                      <Briefcase size={32} />
                      Check out related jobs on Career One Stop
                    </span>
                    <ArrowUpRight size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}