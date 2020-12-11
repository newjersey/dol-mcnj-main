import { Header } from "../components/Header";
import { BetaBanner } from "../components/BetaBanner";
import React, { ReactElement, useEffect } from "react";
import { Link, RouteComponentProps } from "@reach/router";

export const FundingPage = (props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "Fund Your Training";
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners">
        <div className="row">
          <div className="col-sm-12">
            <h2 className="text-xl pvd weight-500">Ways to Fund Your Training in New Jersey</h2>
          </div>

          <div className="col-sm-8">
            <h3 className="text-l ptd weight-500">How does funding work?</h3>
            <p>
              There is funding available for individuals looking for new occupations that fall
              within the State’s “in-demand” list of occupations. In-demand occupations are expected
              to have the most openings in the future in the State of New Jersey.
            </p>

            <h3 className="text-l ptd weight-500">How do I know what qualifies for funding?</h3>
            <p>
              Training that leads to an&nbsp;
              <Link to="/in-demand-occupations">in-demand occupation</Link>&nbsp; can qualify for
              funding but your local One Stop will make the final determination. As we mentioned
              under “How Does Funding Work”, these types of occupations are expected to have the
              most openings in the future in the State of New Jersey. This list of occupations can
              be used by career counselors to help you make decisions about careers advancements and
              training.
            </p>

            <h3 className="text-l ptd weight-500">
              Interested in funding? Here's what to do next.
            </h3>
            <p>
              <Link to="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml">
                Contact a career counselor
              </Link>
              &nbsp;at your local One-Stop Career Center to explore funding opportunities.
            </p>
          </div>

          <div className="col-sm-4">
            <div className="bg-light-purple pam bradl">
              <h3 className="text-l weight-500">Get Started</h3>
              <p>
                To learn more about any of these options or to start your application process,&nbsp;
                <a
                  className="link-format-blue"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
                >
                  please contact your local one-stop
                </a>
                .
              </p>
            </div>

            <div className="bg-light-green pam mtm bradl">
              <h3 className="text-l ptd weight-500">Browse In-Demand Occupations</h3>
              <p>
                In-Demand occupations are expected to have the most openings in the future in the
                State of New Jersey. Trainings related to&nbsp;
                <Link className="link-format-blue" to="/in-demand-occupations">
                  occupations on this list
                </Link>
                &nbsp;can be eligible for funding by the State.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
