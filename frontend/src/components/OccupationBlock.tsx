import {
  ArrowSquareOut,
  Briefcase,
  CalendarCheck,
  CaretDown,
  CaretUp,
  Fire,
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
    hourlyRate?: number;
    numberOfJobs?: number;
  }[];
}

export const ErrorMessage = ({ children, heading }: { children?: ReactNode; heading?: string }) => {
  const { t } = useTranslation();
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
        (training, index, self) => index === self.findIndex((t) => t.name === training.name)
      );

      setSortedTraining(uniqueTrainings);
    }
  }, [props.content]);

  const { t } = useTranslation();

  const tasks = props.content?.tasks?.slice(0, showMore ? undefined : 3);
  return (
    <section className="occupation-block">
      <div className="container">
        <p className="section-heading">{`In-Demand ${props.industry} Careers`}</p>
        <div className="occupation-selector">
          <label htmlFor="occupation-selector">
            Select and in-demand {props.industry?.toLocaleLowerCase()} career
            <select
              id="occupation-selector"
              onChange={(e) => {
                props.setOccupation(e.target.value);
              }}
            >
              <option value="">Please choose an occupation</option>
              {props.inDemandList?.map((item) => (
                <option key={item.sys.id} value={item.idNumber}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
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
                <a className="link-format-blue" href="/">
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
                <div className="heading">
                  <h3>{props.content.title}</h3>
                  {props.content.inDemand && (
                    <span className="tag">
                      <Fire size={15} />
                      &nbsp; In-Demand
                    </span>
                  )}
                  <p>{props.content.description}</p>
                </div>
                <div className="occu-row info">
                  {props.content.tasks.length > 0 && (
                    <div className="box description">
                      <div className="heading-bar">
                        <CalendarCheck size={32} />A Day in the Life
                      </div>
                      <div className="content">
                        <ul>
                          {tasks?.map((task: string) => (
                            <li key={task}>
                              <p>{task}</p>
                            </li>
                          ))}
                        </ul>

                        <button
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
                      </div>
                    </div>
                  )}
                  <div className="meta">
                    <div>
                      <p className="title">
                        Avg. Salary <Info size={15} />
                      </p>
                      <p>
                        {props.content.medianSalary
                          ? toUsCurrency(props.content.medianSalary)
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="title">
                        Jobs Available <Info size={15} />
                      </p>
                      <p>
                        <a
                          href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${props.content.soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {props.content.openJobsCount ||
                            numberWithCommas(
                              props.inDemandList?.filter(
                                (ind) => ind.idNumber === props.content?.soc
                              )[0].numberOfJobs
                            )}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="occu-row related">
                  <div>
                    <div className="box">
                      <div className="heading-bar">
                        <GraduationCap size={32} />
                        Education
                      </div>
                      <div className="content">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: props.content.education,
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
                          {props.content.relatedOccupations?.map((occupation) => (
                            <li key={occupation.soc}>
                              <a href={`/occupation/${occupation.soc}`}>{occupation.title}</a>
                            </li>
                          ))}
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
                          {sortedTraining?.slice(0, 3).map((train) => (
                            <li key={train.id}>
                              <p>
                                <a href={`/training/${train.id}`}>{train.name}</a>
                              </p>
                              <span className="span-grid">
                                <span className="left">
                                  <span>
                                    <Hourglass size={32} />
                                    {train.calendarLength
                                      ? `${calendarLength(train.calendarLength)} to complete`
                                      : "--"}
                                  </span>
                                  <span>
                                    <MapPinLine size={32} />
                                    {train.providerName}
                                  </span>
                                </span>
                                <span className="right">
                                  <span className="salary">
                                    {train.totalCost && toUsCurrency(train.totalCost)}
                                  </span>
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                        <a className="outline usa-button usa-button--outline" href="/search">
                          See more trainings on the Training Explorer
                          <ArrowSquareOut size={20} />
                        </a>
                        <a
                          className="outline usa-button usa-button--outline"
                          href="/tuition-assistance"
                        >
                          Learn more financial assistance opportunities
                          <ArrowSquareOut size={20} />
                        </a>
                      </div>
                    </div>
                    <div className="box">
                      <div className="heading-bar">
                        <Briefcase size={32} />
                        Related Job Opportunities
                      </div>
                      <div className="content">
                        <a
                          className="solid usa-button"
                          href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${props.content.soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1`}
                        >
                          Check out related jobs on Career One Stop
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
