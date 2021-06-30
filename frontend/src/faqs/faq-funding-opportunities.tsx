import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";

export const FaqFundingOpportunities = (props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Funding Opportunities";
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Etpl Out of State Provider" />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">I want to learn more about funding opportunities</h2>
            <p>
              There is funding available for individuals looking for new occupations that fall
              within the State’s “in-demand” list of occupations. In-demand occupations are expected
              to have the most openings in the future in the State of New Jersey.
            </p>

            <h3 className="weight-500">How do I know what qualifies for funding?</h3>
            <p>
              Training that leads to an{" "}
              <Link className="link-format-blue" to="/in-demand-occupations">
                in-demand occupation
              </Link>{" "}
              can qualify for funding but your local One Stop will make the final determination. As
              we mentioned under “How Does Funding Work”, these types of occupations are expected to
              have the most openings in the future in the State of New Jersey. This list of
              occupations can be used by career counselors to help you make decisions about careers
              advancements and training.
            </p>

            <h3 className="weight-500">Interested in funding? Here's what to do next.</h3>
            <p>
              <a
                className="link-format-blue"
                target="_blank"
                rel="noopener noreferrer"
                href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
              >
                Contact a career counselor
              </a>{" "}
              at your local One-Stop Career Center to explore funding opportunities.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
