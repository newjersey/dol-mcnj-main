import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";

export const FaqHealthInsurance = (props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Health Insurance";
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Health Insurance" />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">Health Insurance</h2>
            <p>
              Here is some information based on NJ state resources that we think may be useful to
              you:
            </p>

            <h3 className="weight-500">COVID-19</h3>
            <p>
              NJ FamilyCare, the State's Medicaid program, covers COVID-19 testing, visits for
              testing, and testing-related services without cost to members. The program will also
              cover 90-day supplies of prescriptions for maintenance medications and early refills
              of prescriptions. For more information, click{" "}
              <a
                href="https://www.nj.gov/governor/news/news/562020/20200310a.shtml"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>
              .
            </p>
            <p>
              The Department of Human Services Novel Coronavirus page has information on
              NJFamilyCare/Medicaid waivers as well as temporary telehealth guidelines for
              providers. The information can be found{" "}
              <a
                href="https://nj.gov/humanservices/coronavirus.html"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>
              .
            </p>
            <p>
              Please reference the{" "}
              <a
                href="https://covid19.nj.gov/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                NJ COVID Information Hub website
              </a>{" "}
              for any of your questions or concerns during this challenging time.
            </p>

            <h2 className="text-l mvd">NJ FamilyCare</h2>
            <p>
              NJ FamilyCare is a state health insurance program that provides qualified NJ residents
              with free or low cost health insurance that covers doctor visits, prescriptions,
              vision, dental care, mental health and substance use services, and hospitalization.
              Each county has at least three Health Plans that will help you get these services once
              enrolled. Depending on your family's income, there may be restrictions on certain
              services, which can be viewed{" "}
              <a
                href="http://www.njfamilycare.org/income.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>
              .
            </p>
            <p>
              <a
                href="http://www.njfamilycare.org/who_eligbl.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Groups that are eligible
              </a>{" "}
              for coverage under NJ FamilyCare include children, pregnant women, parents/caretaker
              relatives, single adults and childless couples. Financial eligibility will be
              determined by the latest federal tax return which, when filed, will be electronically
              verified.
            </p>
            <p>
              To apply for NJ FamilyCare, click{" "}
              <a
                href="https://njfc.force.com/familycare/quickstart"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>
              . If you have any questions or would like additional information about NJ FamilyCare
              please contact 1 (800)-701-0710 and a Health Benefits Coordinator will assist you.
            </p>

            <h2 className="text-l mvd">NJ Medicaid</h2>
            <p>
              NJ Medicaid provides health insurance to parents, caretakers, and dependent children,
              pregnant women, and people who are aged, blind, or disabled depending on a range of
              income and other criteria. These programs pay for hospital services, doctor visits,
              prescriptions, nursing home care, and other health care needs. To be eligible for NJ
              Medicaid, you must be a NJ resident, a U.S. citizen or qualified alien, and meet a
              specific financial income. In addition, you must fall into one of these groups:
              families with dependent children, pregnant women, and individuals who are 65 or older,
              blind, or permanently disabled. For questions about NJ Medicaid, please call 1 (800)
              356-1561 or contact your county’s{" "}
              <a
                href="https://www.state.nj.us/humanservices/dfd/programs/njsnap/cbss/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Board of Social Services
              </a>
              .
            </p>

            <h2 className="text-l mvd">NJ Medicare Information and Referral Service</h2>
            <p>
              New Jersey’s Medicare Information and Referral Service provides free, unbiased
              counseling for seniors regarding{" "}
              <a
                href="http://www.medicare.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Medicare
              </a>{" "}
              and other insurance issues. Individuals with concerns that cannot be addressed over
              the phone are referred to the State Health Insurance Assistance Program (SHIP) office
              in their county for assistance. The unit also administers, and is the out-of-state
              default service for, the{" "}
              <a
                href="http://www.adrcnj.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                ADRC
              </a>{" "}
              hotline at 877-222-3737. This number connects people calling from a landline within
              the state to their{""}{" "}
              <a
                href="https://www.state.nj.us/humanservices/doas/home/saaaa.html"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                county office on aging
              </a>{" "}
              where they can learn about and apply for a broad range of services.
            </p>

            <h2 className="text-l mvd">Medicare</h2>
            <p>
              To sign up for federal Medicare coverage, please visit{" "}
              <a
                href="https://www.medicare.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                medicare.gov
              </a>
              , which provides information on how to get started with Medicare, your Medicare
              coverage choices, and when and how to apply.
            </p>
            <p>
              If you have any questions or would like additional information about any of the above,
              please visit the Department of Health’s{" "}
              <a
                href="https://www.nj.gov/health/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                website
              </a>{" "}
              or call 1 (800) 701-0710.
            </p>

            <h2 className="text-l mvd">Federal Program: Continuation of Health Coverage - COBRA</h2>
            <p>
              In addition, if you recently lost your job, you may be eligible to temporarily keep
              the insurance you had with your previous employer through the U.S. Department Of Labor
              program COBRA, though it may cost you more than when you were an employee. COBRA
              generally applies to all private-sector group health plans maintained by employers
              that had at least 20 employees. To learn about COBRA, please visit the U.S. Department
              of Labor’s{" "}
              <a
                href="https://www.dol.gov/general/topic/health-plans/cobra"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                website
              </a>{" "}
              or call 1 (866) 487-2365.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
