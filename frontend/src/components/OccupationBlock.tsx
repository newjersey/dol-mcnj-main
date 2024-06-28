import {
  ArrowSquareOut,
  ArrowUpRight,
  Briefcase,
  CalendarCheck,
  CaretDown,
  CaretUp,
  GraduationCap,
  Hourglass,
  Info,
  MapPinLine,
  RocketLaunch,
  Warning,
} from "@phosphor-icons/react";
import { OccupationDetail } from "../domain/Occupation";
import { toUsCurrency } from "../utils/toUsCurrency";
import { ReactNode, useEffect, useState } from "react";
import { Error } from "../domain/Error";
import { useTranslation } from "react-i18next";
import { CircularProgress, Tooltip } from "@material-ui/core";
import { numberWithCommas } from "../utils/numberWithCommas";
import { TrainingResult } from "../domain/Training";
import { InDemandTag } from "./InDemandTag";
import { SectionHeading } from "./modules/SectionHeading";
import { Selector } from "../svg/Selector";

interface OccupationBlockProps {
  content?: OccupationDetail;
  industry?: string;
  error?: Error;
  loading?: boolean;
  setOccupation: (occupation: string) => void;
  inDemandList?: {
    sys: {
      id: string;
    };
    title: string;
    idNumber: string;
    numberOfJobs?: number;
  }[];
}

export const ErrorMessage = ({ children, heading }: { children?: ReactNode; heading?: string }) => {
  return (
    <div className="error-message container">
      <div className="inner">
        <Warning size={51} />
        <p>
          <strong>Oh no. Looks like there was an error.</strong>
        </p>
        <p className="heading">{heading}</p>
        {children}
      </div>
    </div>
  );
};

export const OccupationBlock = (props: OccupationBlockProps) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [sortedTraining, setSortedTraining] = useState<TrainingResult[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setShowMore(false);
    if (props.content && props.content.relatedTrainings) {
      const sortedCourses = props.content.relatedTrainings.sort((a, b) => {
        if (a.percentEmployed === null && b.percentEmployed === null) {
          return a.name.localeCompare(b.name);
        } else if (a.percentEmployed === null) {
          return 1;
        } else if (b.percentEmployed === null) {
          return -1;
        } else if (a.percentEmployed !== b.percentEmployed) {
          return b.percentEmployed - a.percentEmployed;
        } else if (a.percentEmployed === b.percentEmployed && a.name !== b.name) {
          return a.name.localeCompare(b.name);
        } else {
          return 0;
        }
      });

      const uniqueTrainings = sortedCourses?.filter(
        (training, index, self) => index === self.findIndex((t) => t.name === training.name),
      );

      setSortedTraining(uniqueTrainings);
    }
  }, [props.content]);

  const { t } = useTranslation();

  const tasks = props.content?.tasks?.slice(0, showMore ? undefined : 3);

  // if props.industry starts with a vowel, use "an" instead of "a"
  const article = props.industry
    ? ["a", "e", "i", "o", "u"].includes(props.industry.charAt(0).toLowerCase())
      ? "an"
      : "a"
    : "a";

  return (
    <section className="occupation-block">
      <div className="container">
        <SectionHeading
          heading={`Select ${article} ${props.industry} occupation`}
          description="Select a field and explore different career pathways or click the tool tip to learn more about it."
        />
        <div className="occupation-selector">
          <label htmlFor="occupation-selector">
            Select an in-demand {props.industry?.toLocaleLowerCase()} occupation
            <button
              type="button"
              aria-label="occupation selector"
              className="select-button"
              onClick={() => {
                setOpen(!open);
              }}
            >
              {props.content?.title || "Please choose an occupation"}
            </button>
          </label>
          {open && (
            <div className="dropdown-select">
              {props.inDemandList?.map((item) => (
                <button
                  aria-label="occupation-item"
                  type="button"
                  key={item.sys.id}
                  className="occupation"
                  onClick={() => {
                    props.setOccupation(item.idNumber);
                    setOpen(false);
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {props.loading ? (
        <div className="container fdr fjc fac ptl">
          <CircularProgress color="secondary" />
        </div>
      ) : props.error === Error.NOT_FOUND ? (
        <>
          <ErrorMessage heading={t("ErrorPage.notFoundHeader")}>
            <>
              <p>{t("ErrorPage.notFoundText")}</p>
              <p>
                <a className="link-format-blue" href="/training/search/">
                  {t("ErrorPage.notFoundLink1")}
                </a>
              </p>
              <p>
                <a
                  className="link-format-blue"
                  href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
                >
                  {t("ErrorPage.notFoundLink2")}
                </a>
              </p>
            </>
          </ErrorMessage>
        </>
      ) : props.error === Error.SYSTEM_ERROR ? (
        <ErrorMessage heading={t("ErrorPage.somethingWentWrongHeader")}>
          <p>{t("ErrorPage.somethingWentWrongText")}</p>
        </ErrorMessage>
      ) : (
        <>
          {props.content && (
            <div className="container">
              <div className="occupation-box">
                <div className="heading-row">
                  <div className="heading">
                    <h3>{props.content.title}</h3>
                    {props.content.inDemand && <InDemandTag />}
                    <p>{props.content.description}</p>
                  </div>
                  <div className="meta">
                    <div>
                      <p className="title">
                        Median Salary
                        <Tooltip placement="top" title="TEST">
                          <Info size={20} weight="fill" />
                        </Tooltip>
                      </p>
                      <p>
                        {props.content.medianSalary
                          ? toUsCurrency(props.content.medianSalary)
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="title">
                        Jobs Open in NJ
                        <Tooltip placement="top" title="TEST">
                          <Info size={20} weight="fill" />
                        </Tooltip>
                        <br />
                        <strong>
                          {props.content.openJobsCount ||
                            numberWithCommas(
                              props.inDemandList?.filter(
                                (ind) => ind.idNumber === props.content?.soc,
                              )[0].numberOfJobs,
                            )}
                        </strong>
                      </p>
                      <p>
                        <a
                          href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${props.content.soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>See Current Job Openings</span>
                          <ArrowSquareOut size={20} />
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="occu-row related">
                  <div>
                    <div className="box description">
                      <div className="heading-bar">
                        <CalendarCheck size={32} />A Day in the Life
                      </div>
                      <div className="content">
                        {props.content.tasks.length > 0 ? (
                          <>
                            <ul>
                              {tasks?.map((task: string) => (
                                <li key={task}>
                                  <p>{task}</p>
                                </li>
                              ))}
                            </ul>

                            <button
                              title="See More"
                              className="usa-button  usa-button--unstyled"
                              onClick={() => {
                                setShowMore(!showMore);
                              }}
                            >
                              See
                              {showMore ? (
                                <>
                                  &nbsp;Less <CaretUp size={20} />
                                </>
                              ) : (
                                <>
                                  &nbsp;More <CaretDown size={20} />
                                </>
                              )}
                            </button>
                          </>
                        ) : (
                          <p>
                            <strong>This data is not yet available for this occupation.</strong>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="box">
                      <div className="heading-bar">
                        <GraduationCap size={32} />
                        Education
                      </div>
                      <div className="content">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: props.content.education
                              ? props.content.education
                              : `<strong>This data is not yet available for this occupation.</strong>`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="box">
                      <div className="heading-bar">
                        <Briefcase size={32} />
                        Related Occupations
                      </div>
                      <div className="content related-occupations">
                        <ul className="unstyled">
                          {props.content.relatedOccupations &&
                          props.content.relatedOccupations.length > 0 ? (
                            props.content.relatedOccupations.map((occupation) => (
                              <li key={occupation.soc}>
                                <a href={`/occupation/${occupation.soc}`}>{occupation.title}</a>
                              </li>
                            ))
                          ) : (
                            <li>
                              <strong>This data is not yet available for this occupation.</strong>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="box">
                      <div className="heading-bar">
                        <RocketLaunch size={32} />
                        Related Training Opportunities
                      </div>
                      <div className="content related-training">
                        <ul className="unstyled">
                          {sortedTraining && sortedTraining.length > 0 ? (
                            sortedTraining.slice(0, 3).map((train) => (
                              <li key={train.ctid}>
                                <a
                                  href={`/training/${train.ctid}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <p className="title">
                                    {train.name}
                                    <ArrowUpRight size={24} />
                                  </p>
                                  <span className="span-grid">
                                    <span>
                                      <GraduationCap size={32} />
                                      {train.providerName}
                                    </span>
                                    {train.availableAt.map((address, index) => (
                                      <span key={index}>
                                        <MapPinLine size={32} />
                                        {address.city}, {address.state}
                                      </span>
                                    ))}
                                    <span className="last-line">
                                      <span>
                                        <Hourglass size={32} />

                                        {train.calendarLength
                                          ? `${t(`CalendarLengthLookup.${train.calendarLength}`)} to complete`
                                          : "--"}
                                      </span>
                                      <span className="salary">
                                        {train.totalCost && toUsCurrency(train.totalCost)}
                                      </span>
                                    </span>
                                  </span>
                                </a>
                              </li>
                            ))
                          ) : (
                            <li>
                              <p className="mbd">
                                <strong>This data is not yet available for this occupation.</strong>
                              </p>
                            </li>
                          )}
                        </ul>

                        <a className="usa-button" href="/training/search">
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
                          className="solid usa-button"
                          href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${props.content.soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1`}
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
            </div>
          )}
        </>
      )}
    </section>
  );
};
