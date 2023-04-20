import {
  ArrowSquareOut,
  Briefcase,
  Fire,
  GraduationCap,
  Hourglass,
  Info,
  MapPinLine,
  RocketLaunch,
} from "@phosphor-icons/react";
import { OccupationDetail } from "../domain/Occupation";

interface OccupationBlockProps extends OccupationDetail {
  industry?: string;
}

export const OccupationBlock = (props: OccupationBlockProps) => {
  const uniqueTrainings = props.relatedTrainings?.filter(
    (training, index, self) => index === self.findIndex((t) => t.name === training.name)
  );

  return (
    <section className="occupation-block">
      <div className="container">
        <p className="section-heading">{`In-Demand ${props.industry} Careers`}</p>
        <div className="occupation-selector">
          <label htmlFor="occupation-selector">
            Select and in-demand {props.industry?.toLocaleLowerCase()} career
            <select id="occupation-selector">
              <option>Medical Assitant</option>
            </select>
          </label>
        </div>
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
                <Briefcase size={32} />
                Job Description
              </div>
              <div className="content">
                <p>{!props.description || "This data is not yet available for this occupation"}</p>
              </div>
            </div>
            <div className="meta">
              <div>
                <p className="title">
                  Avg. Salary <Info size={32} />
                </p>
                <p>{props.medianSalary}</p>
              </div>
              <div>
                <p>
                  Jobs Available <Info size={32} />
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
                <div className="content">
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
                <div className="content">
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
                            <span className="salary">{train.totalCost}</span>
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a className="outline" href="/search">
                    See more trainings on the Training Explorer
                    <ArrowSquareOut size={32} />
                  </a>
                  <a className="outline" href="/tuition-assistance">
                    Learn more financial assistance opportunities
                    <ArrowSquareOut size={32} />
                  </a>
                </div>
              </div>
              <div className="box">
                <div className="heading-bar">
                  <RocketLaunch size={32} />
                  Related Job Opportunities
                </div>
                <div className="content">
                  <a className="solid" href="/tuition-assistance">
                    Check out related jobs on Career One Stop
                    <ArrowSquareOut size={32} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <code>
          <pre
            style={{
              fontFamily: "monospace",
              display: "block",
              padding: "50px",
              color: "#88ffbf",
              backgroundColor: "black",
              textAlign: "left",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(props, null, "    ")}
          </pre>
        </code>
      </div>
    </section>
  );
};
