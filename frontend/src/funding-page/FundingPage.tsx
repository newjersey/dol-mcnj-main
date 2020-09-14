import { Header } from "../search-results/Header";
import { BetaBanner } from "../components/BetaBanner";
import React, { ReactElement } from "react";
import { Link, RouteComponentProps } from "@reach/router";

export const FundingPage = (props: RouteComponentProps): ReactElement => {
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
            <h3 className="text-l ptd weight-500">Individual Training Account (ITA) Grant</h3>
            <p>
              People who are economically disadvantaged or lost their job due to a layoff may be
              eligible for up to $4000 to pay for training. People can choose from a number of
              training providers approved by the Department of Labor and Workforce Development to
              receive training for an in-demand occupation. To learn more about the process, please
              register with your local one stop career center and ask to attend a training
              Information Session.
            </p>

            <h3 className="text-l ptd weight-500">Individual Training Account (ITA) Grant</h3>
            <p>
              Tuition waivers enable eligible unemployed individuals to enroll, tuition free, in
              courses of instruction at public colleges and universities in New Jersey. These
              courses can only be attended if there are seats available. Books, labs and other
              appropriate fees are the responsibility of the student. Complete the Free Application
              for Federal Student Aid (FAFSA) application, identify the program you are seeking at
              your local NJ State or County College or University, and meet with a one stop
              counselor to see if you qualify.
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
                <Link className="link-format-blue" to="/in-demand-careers">
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
