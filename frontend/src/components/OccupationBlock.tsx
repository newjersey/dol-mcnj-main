import {
  ArrowSquareOut,
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
import { CircularProgress } from "@material-ui/core";
import { numberWithCommas } from "../utils/numberWithCommas";
import { TrainingResult } from "../domain/Training";
import { calendarLength } from "../utils/calendarLength";
import { InDemandTag } from "./InDemandTag";
import { Selector } from "../svg/Selector";
import { Heading } from "./modules/Heading";

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

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".dropdown-select") || target.closest(".select-button")) return;
      setOpen(false);
    };

    const closeOnEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEsc);
    document.addEventListener("click", closeDropdown);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (document.getElementById("uswds") !== null) return;

      const script = document.createElement("script");
      script.src = "https://newjersey.github.io/njwds/dist/js/uswds.min.js";
      script.id = "uswds";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [props.content]);

  return (
    <section className="occupation-block">
      <div className="container">
        <Heading level={2}>{`Select ${article} ${props.industry} occupation`}</Heading>

        <div className="occupation-selector">
          <label htmlFor="occupation-selector">
            <button
              type="button"
              aria-label="occupation selector"
              className={`select-button${!props.content || !!props.error ? " inactive" : ""}`}
              onClick={() => {
                setOpen(!open);
              }}
            >
              {props.error
                ? "-Please choose an occupation-"
                : props.content?.title || "-Please choose an occupation-"}
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
        <div className="loading container fdr fjc fac ptl">
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
                        Median Salary{" "}
                        <button
                          data-position="top"
                          title="The median salary is an estimate based on available data and may vary depending on factors such as location, experience, and employer."
                          id="sal-tooltip"
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                          type="button"
                          className="unstyled usa-tooltip"
                          onFocus={(e) => e.preventDefault()}
                        >
                          <Info size={20} weight="fill" />
                        </button>
                      </p>
                      <p>
                        <strong>
                          {props.content.medianSalary
                            ? toUsCurrency(props.content.medianSalary)
                            : "N/A"}
                        </strong>
                      </p>
                    </div>
                    <div>
                      <p className="title">
                        Jobs Open in NJ
                        <button
                          data-position="top"
                          title="Job openings are based on postings from the NLx job board and reflect positions in New Jersey. The actual number of available jobs may vary."
                          onFocus={(e) => e.preventDefault()}
                          id="job-tooltip"
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                          type="button"
                          className="unstyled usa-tooltip"
                        >
                          <Info size={20} weight="fill" />
                        </button>
                      </p>
                      <p>
                        {" "}
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
                              <li key={train.id}>
                                <a
                                  href={`/training/${train.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <p className="title">{train.name}</p>
                                  <span className="span-grid">
                                    <span>
                                      <GraduationCap size={32} />
                                      {train.providerName}
                                    </span>
                                    <span>
                                      <MapPinLine size={32} />
                                      {train.city}, {train.county}
                                    </span>
                                    <span className="last-line">
                                      <span>
                                        <Hourglass size={32} />
                                        {train.calendarLength
                                          ? `${calendarLength(train.calendarLength)} to complete`
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

                        <a
                          className="usa-button"
                          href={`/training/search?q=${props.content.title.toLowerCase()}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span>
                            <Selector name="trainingBold" />
                            See more trainings on the Training Explorer
                          </span>
                        </a>
                        <a
                          className="usa-button"
                          href="/support-resources/tuition-assistance"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>
                            <Selector name="supportBold" />
                            Learn more financial assistance opportunities
                          </span>
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
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${props.content.soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1`}
                        >
                          <span>
                            <Briefcase size={32} />
                            Check out related jobs on Career One Stop
                          </span>
                          <ArrowSquareOut size={20} />
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
