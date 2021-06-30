import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import SearchOccupationScreenshot from "./search-occupation-screenshot.png";
import OccupationDetailsScreenshot from "./occupation-details-screenshot.png";

export const FaqJobListings = (props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Job Listings";
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Job Listings" />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">Job Listings</h2>
            <h3 className="weight-500">Finding job listings on the Training Explorer</h3>
            <p>
              The Training Explorer links to job listings on occupation pages. To search for an
              in-demand occupation, click on the "in-demand occupations" at the top of this page or
              visit:{" "}
              <Link className="link-format-blue" to="/in-demand-occupations">
                https://training.njcareers.org/in-demand-occupations
              </Link>
              .
            </p>
            <p>
              On this page, you search for any occupation that is projected by the State to have the
              most growth in job openings. Once you find an occupation, for example Phlebotomy, you
              can see the number of job listings currently available for that occupation as well as
              the median salary for that occupation.
            </p>
            <p>
              <img
                width="300"
                src={SearchOccupationScreenshot}
                alt="search-occupation-screenshot"
              />
            </p>
            <p>
              To view the job listings, select the link "Search current job openings posted for this
              occupation {">"}". This link will take you to Career OneStop to view listings for this
              occupation throughout the State of New Jersey. To refine your search, use the filter
              options to find jobs near you.
            </p>
            <p>
              <img
                width="345"
                src={OccupationDetailsScreenshot}
                alt="occupation-details-screenshot"
              />
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
