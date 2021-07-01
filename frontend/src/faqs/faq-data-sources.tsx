import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";

export const FaqDataSources = (props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Data Sources";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Data Sources" />
        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">The Data Sources used for this website</h2>

            <h3 className="weight-500">The Training Explorer</h3>
            <p>
              The Training Explorer is home to New Jersey's Eligible Training Provider List (ETPL)
              and Consumer Report Card (CRC). The ETPL is a comprehensive listing of all schools and
              organizations offering occupational education and job training programs that are
              eligible to receive publicly funded tuition assistance. The listing is made available
              via this website’s “Find Training” search feature. This dataset is updated on a weekly
              basis and is transitioning to real-time availability.
            </p>
            <p>
              The types of training you will find on this website range from private career schools,
              non-profit schools, community colleges, vocational schools, literacy programs,
              short-term credentials, and registered apprenticeships.
            </p>

            <h3 className="weight-500">Occupational Data</h3>
            <p>
              Informational data related to occupations, which is available through the in-demand
              occupations link at the top of the page, come from a variety of data sources. These
              data are updated from a real-time to annual basis.
            </p>
            <p>
              The job listings and link to the jobs count is from the{" "}
              <a
                href="https://usnlx.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                National Labor Exchange
              </a>{" "}
              through{" "}
              <a
                href="https://www.careeronestop.org/Site/about-us.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Career OneStop’s API
              </a>
              . Median Salary for the State of New Jersey is provided by the New Jersey Department
              of Labor.
            </p>
            <p>
              The description and day in the life content are from{" "}
              <a
                href="https://www.onetonline.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                ONet Online
              </a>
              . The educational and certification sections are from the Bureau of Labor Statistics.
            </p>
            <p>
              The related training and related career sections are a crosswalk of training that lead
              to that occupation on the page.
            </p>
            <p>
              All of the occupation data are pulled via real-time API and are showing the most up to
              date information.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
