import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";

export const FaqLaborDemandOccupations = (_props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Labor Demand Occupations";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Labor Demand Occupations" />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">What is the Labor Demand Occupation List?</h2>
            <p>
              Find occupations in "in demand" across the State, and identify training programs for
              "in demand" jobs to help accomplish your goals. The Demand Occupations List brings
              together information about current job openings, trends and projections in employment
              and labor supply, and other current indicators of the labor market.
            </p>

            <h3 className="weight-500">Demand Occupations List</h3>
            <p>
              The Demand Occupations List can help career counselors and their clients find relevant
              skills training programs; shows you where skills gaps are present in the current
              economy, as well as the size of the skills shortage; and, anticipated employer need
              for trained workers in the listed fields.
              <ul>
                <li>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-format-blue"
                  >
                    Demand Occupations List
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-format-blue"
                  >
                    SOC to CIP Crosswalk
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-format-blue"
                  >
                    CIP Codes in Demand
                  </a>
                </li>
              </ul>
            </p>

            <h3 className="weight-500">For Career Counselors</h3>
            <p>
              Use this list as a starting point when approving individual training programs in the
              Workforce Development Partnership (WDP) Act, Workforce Investment Act (WIA), and all
              other occupational training initiatives within New Jersey’s Workforce Investment
              System.
            </p>

            <p>
              The Demand Occupations List is NOT meant to be a final, stand-alone authority for
              approval or denial of training in Workforce Development Partnership or any other
              program. When making training decisions, it is also important to consider the
              individual's:
              <ul>
                <li>employability development plan,</li>
                <li>local and regional labor market conditions,</li>
                <li>the labor market area where the trainee is likely to seek employment, and</li>
                <li>
                  the impact of training on the individual's marketable skills and earning power
                </li>
              </ul>
            </p>

            <h3 className="weight-500">Exceptions to Demand Approval</h3>
            <p>
              If a Workforce Investment Board (WIB) believes that an occupation is not listed as in
              demand in its area, it can designate such an occupation as being in demand and allow
              program participants under its jurisdiction to be placed in training, after
              consultation with the Department of Labor and Workforce Development. This is done in
              accordance with the procedures outlined in the Department's{" "}
              <a href="/" target="_blank" rel="noopener noreferrer" className="link-format-blue">
                To Work Bulletin 2005-01
              </a>{" "}
              dated April 14, 2005.
            </p>

            <a href="/" target="_blank" rel="noopener noreferrer" className="link-format-blue">
              Download the Exceptions Forms
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
