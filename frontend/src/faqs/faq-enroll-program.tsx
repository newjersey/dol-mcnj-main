import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import { InDemandTag } from "../components/InDemandTag";

export const FaqEnrollProgram = (props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Enroll Program";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Enroll Program" />
        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">Enrolling in a Program listed on this website</h2>

            <h3 className="weight-500">Finding the school's contact information</h3>
            <p>
              For questions regarding a specific program or to enroll in a specific program you must
              contact the school or organization directly. Contact information for each program is
              available under the "provider details" tab within each program listing. This website
              is for information purposes only.
            </p>

            <h3 className="weight-500">In-Demand Training</h3>
            <p>
              Training listed that leads to an occupation that is in-demand will have a label like
              this one.
            </p>
            <InDemandTag />
            <p>Training with this in-demand label may be eligible for financial support.</p>

            <h3 className="weight-500">Get Advice from a OneStop Counselor</h3>
            <p>
              To find out more information about funding, contact your NJ County One-Stop Career,
              who will help determine funding eligibility. You can submit a request to get in touch
              virtually{" "}
              <a
                href="https://forms.office.com/Pages/ResponsePage.aspx?id=0cN2UAI4n0uzauCkG9ZCpyMAsRmL_iZGuS3yTOduNF1UMFE1VUIxTU9MTDdXSDZNWlBHU0s4S0lQNSQlQCN0PWcu"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                at this link
              </a>
              . There will be a link you can copy on the training page that you can share with them.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
