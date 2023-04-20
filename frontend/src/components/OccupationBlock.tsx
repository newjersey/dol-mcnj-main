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
} from "@phosphor-icons/react";
import { OccupationDetail } from "../domain/Occupation";
import { toUsCurrency } from "../utils/toUsCurreny";
import { useState } from "react";

interface OccupationBlockProps extends OccupationDetail {
  industry?: string;
}

export const OccupationBlock = (props: OccupationBlockProps) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const uniqueTrainings = props.relatedTrainings?.filter(
    (training, index, self) => index === self.findIndex((t) => t.name === training.name)
  );

  const tasks = props.tasks?.slice(0, showMore ? undefined : 3);

  return (
    <section className="occupation-block">
      <div className="container">
        <p className="section-heading">{`In-Demand ${props.industry} Careers`}</p>
        <div className="occupation-selector">
          <label htmlFor="occupation-selector">
            Select and in-demand {props.industry?.toLocaleLowerCase()} career
            <select id="occupation-selector">
              <option>Please choose an occupation</option>
              <option>Medical Assitant</option>
            </select>
          </label>
        </div>
      </div>
      <div className="container">
        <div className="occupation-box">
          <div className="heading">
            <h3>{props.title}</h3>
            {props.inDemand && (
              <span className="tag">
                <Fire size={15} />
                &nbsp; In-Demand
              </span>
            )}
            <p>{props.description}</p>
          </div>
          <div className="occu-row info">
            <div className="box description">
              <div className="heading-bar">
                <CalendarCheck size={32} />A Day in the Life
              </div>
              <div className="content">
                {props.tasks ? (
                  <ul>
                    {tasks.map((task) => (
                      <li key={task}>
                        <p>{task}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  "This data is not yet available for this occupation"
                )}

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
            <div className="meta">
              <div>
                <p className="title">
                  Avg. Salary <Info size={15} />
                </p>
                <p>{props.medianSalary && toUsCurrency(props.medianSalary)}</p>
              </div>
              <div>
                <p className="title">
                  Jobs Available <Info size={15} />
                </p>
                <p>{props.openJobsCount || "N/A"}</p>
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
                  <p>{props.education}</p>
                </div>
              </div>
              <div className="box">
                <div className="heading-bar">
                  <Briefcase size={32} />
                  Related Occupations
                </div>
                <div className="content related-occupations">
                  <ul className="unstyled">
                    {props.relatedOccupations?.map((occupation) => (
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
                    {uniqueTrainings.slice(0, 3).map((train) => (
                      <li key={train.id}>
                        <p>
                          <a href={`/training/${train.id}`}>{train.name}</a>
                        </p>
                        <span className="span-grid">
                          <span className="left">
                            <span>
                              <Hourglass size={32} />
                              This data is not yet available
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
                  <a className="outline usa-button usa-button--outline" href="/tuition-assistance">
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
                  <a className="solid usa-button" href="/tuition-assistance">
                    Check out related jobs on Career One Stop
                    <ArrowSquareOut size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
