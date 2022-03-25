import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";

export const FaqUnemploymentInsurance = (_props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Unemployment Insurance";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Unemployment Insurance" />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">Unemployment Insurance</h2>
            Here is some information based on NJ state resources that we think may be useful to you:
            <h3 className="weight-500">COVID-19</h3>
            <p>
              The New Jersey Department of Labor has developed the{" "}
              <a
                href="https://getstarted.nj.gov/labor/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                NJDOL Benefits Eligibility Tool
              </a>{" "}
              to make it easier for you to understand what work-related benefits programs, and job
              protections, are available to you to help stabilize your household during this
              difficult time. Visit this tool at{" "}
              <a
                href="https://getstarted.nj.gov/labor/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                https://getstarted.nj.gov/labor/
              </a>
              .
            </p>
            <p>
              Important information for claiming weekly benefits due to the COVID-19 emergency can
              be found{" "}
              <a
                href="https://myunemployment.nj.gov/labor/myunemployment/covidinstructions.shtml"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>
              . Additional guidance from the NJ Department of Labor on benefits and COVID-19 can be
              found{" "}
              <a
                href="https://www.nj.gov/labor/worker-protections/earnedsick/covid.shtml?fbclid=IwAR3s8jlWGUn4GsZ6cjauTyOyn9VSL0U2kUAc6_Gy_saT9v_0i-AXS3cKryE"
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
            <h2 className="text-l mvd">Applying for Unemployment Insurance Online</h2>
            <p>
              Many job seekers apply online for Unemployment Insurance, which you can do{" "}
              <a
                href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/applyonline.shtml"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>
              .
            </p>
            <p>
              According to the New Jersey Department of Labor, these steps must be taken to apply
              online for Unemployment Insurance:
              <ol>
                <li>
                  Check eligibility: In order to apply for unemployment benefits online, you must
                  meet one of the following{" "}
                  <a
                    href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/infoneeded.shtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-format-blue"
                  >
                    requirements
                  </a>
                  .
                </li>
                <li>
                  Prepare government documents: Once you determine online eligibility, please have
                  the following{" "}
                  <a
                    href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/infoneeded.shtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-format-blue"
                  >
                    government documents
                  </a>{" "}
                  with you.
                </li>
                <li>
                  Prepare employer information: Please have the following{" "}
                  <a
                    href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/infoneeded.shtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-format-blue"
                  >
                    employer information
                  </a>{" "}
                  (from the last 18 months) ready when you are applying.
                </li>
                <li>
                  Create an account: To apply for unemployment benefits online, click{" "}
                  <a
                    href="https://secure.dol.state.nj.us/sso/XUI/#login/&realm=njcc&goto=https%3A%2F%2Fregapp1.dol.state.nj.us%3A8443%2FRegistration%2F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-format-blue"
                  >
                    here
                  </a>
                  . Please have a primary email address ready when creating your account!
                </li>
                <li>
                  Click application link on dashboard: Once your account is set up and you are
                  logged in, there will be a{" "}
                  <a
                    href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/opendashboard.shtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-format-blue"
                  >
                    dashboard
                  </a>{" "}
                  that includes the application link, application status, and an information tab.
                </li>
              </ol>
            </p>
            <h2 className="text-l mvd">Applying for Unemployment Insurance by Phone</h2>
            <p>
              In order to apply by phone for Unemployment Insurance, the Department of Labor and
              Workforce Development notes that you must follow these steps:
              <ol>
                <li>
                  Prepare government documents/employment information: A full list of required
                  documents is listed{" "}
                  <a
                    href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/infoneeded_ph.shtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-format-blue"
                  >
                    here
                  </a>
                  .
                </li>
                <li>
                  Call a Reemployment Call Center: Customer service agents at the call center can
                  accept your Unemployment Insurance claim over the phone. Contact information is
                  dependent by state region, which can be viewed{" "}
                  <a
                    href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/callrcc.shtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-format-blue"
                  >
                    here
                  </a>
                  .
                </li>
                <li>
                  Check your mail: Please be mindful and on the look out for mail from The Office of
                  Labor and Workforce Development. They may also send information via email, so
                  please check your inbox regularly. For more information on letters and forms that
                  may be sent you, please click{" "}
                  <a
                    href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/forms_ph.shtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-format-blue"
                  >
                    here
                  </a>
                  .
                </li>
              </ol>
            </p>
            <h2 className="text-l mvd">Eligibility requirements for Unemployment Benefits</h2>
            <p>
              To remain eligible for unemployment benefits, the New Jersey Department of Labor
              requires that you adhere to the following:
              <ol>
                <li>You must keep all scheduled appointments with the Department of Labor.</li>
                <li>You must be able to work.</li>
                <li>You must be available for work.</li>
                <li>You must actively seek work.</li>
                <li>You must not refuse an offer of suitable work.</li>
                <li>
                  You must claim your unemployment insurance benefits every week online or every two
                  weeks by phone.
                </li>
              </ol>
            </p>
            <p>
              Click{" "}
              <a
                href="https://myunemployment.nj.gov/labor/myunemployment/assets/pdfs/PR-94.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>{" "}
              for complete information about your rights and responsibilities while receiving UI
              benefits.
            </p>
            <h2 className="text-l mvd">Claiming Unemployment Insurance Benefits</h2>
            <p>
              There are two ways in which you can claim your weekly or biweekly unemployment
              insurance benefits.
            </p>
            <h3 className="weight-500">Online Instructions</h3>
            <p>
              You can claim your UI benefits online by creating an{" "}
              <a
                href="https://secure.dol.state.nj.us/sso/XUI/#login/&realm=njcc&goto=https%3A%2F%2Fregapp1.dol.state.nj.us%3A8443%2FRegistration%2F"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                account
              </a>{" "}
              with the Department of Labor and Workforce Development. For more information about
              certifying benefits online, click{" "}
              <a
                href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/howtocertify.shtml"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>
              .
            </p>
            <p>
              The schedule for certifying benefits online is:
              <ul>
                <li>Monday-Friday 7:00a.m. - 6:00p.m.</li>
                <li>Saturday 8:00a.m. - 3:00p.m.</li>
                <li>Sunday 8:00a.m. - 5:00p.m.</li>
              </ul>
            </p>
            <h3 className="weight-500">Phone Instructions</h3>
            <p>
              You will need your 4-digit PIN to certify your benefits (see below). The hours of
              operation for phone benefit claims are 8:30am-6:00pm, Monday to Friday (including
              holidays).
            </p>
            <p>
              The schedule for certifying benefits by phone is:
              <ul>
                <li>
                  Mondays - for individuals whose Social Security number ends with an odd number
                  (1,3,5,7,9).
                </li>
                <li>
                  Tuesdays - for individuals whose Social Security number ends with an even number
                  (0, 2, 4, 6, 8).
                </li>
                <li>
                  Wednesday through Friday - for those who missed certifying on the assigned day.
                </li>
              </ul>
            </p>
            <p>
              Contact numbers to file by phone
              <ul>
                <li>North New Jersey (201) 601-4100</li>
                <li>South New Jersey (856) 507-2340</li>
                <li>Central New Jersey (732) 761-2020</li>
                <li>Out-of-State Claims (888) 795-6672</li>
              </ul>
            </p>
            <h2 className="text-l mvd">Obtaining Your Personal Identification Number (PIN)</h2>
            <p>
              When you first certify your benefits, you will choose a 4-digit personal
              identification number (PIN). You will need your PIN every time you certify for you
              benefits. Write down your PIN and keep it in a safe, secure place. Your PIN is valid
              for one year. If you forget your PIN, please call your local{" "}
              <a
                href="https://myunemployment.nj.gov/before/about/howtoapply/callrcc.shtml"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Reemployment Call Center
              </a>
              , and ask the representative to reset your PIN.
            </p>
            <h2 className="text-l mvd">Receiving Payment</h2>
            <p>
              There are two ways to receive UI benefit payments: by debit card or by direct deposit.
              If you would like to receive your benefit payments via direct deposit, choose that
              option when you first file your claim, or complete the direct deposit application{" "}
              <a
                href="https://myunemployment.nj.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                online
              </a>
              . If you do not choose direct deposit, you will receive a prepaid Bank of America
              debit card. Bank of America mails the card to you in a plain, unmarked envelope within
              7-10 days after filing your initial claim. Click{" "}
              <a
                href="https://myunemployment.nj.gov/labor/myunemployment/before/about/payment/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>{" "}
              for more information about UI benefit payments.
            </p>
            <h2 className="text-l mvd">Additional Income Support Programs</h2>
            <p>
              The{" "}
              <a
                href="https://www.nj.gov/humanservices/clients/welfare/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                New Jersey Department of Human Services
              </a>{" "}
              offers a variety of programs for individuals and families who need income assistance.
              WorkFirst New Jersey (WFNJ) employment-directed activities provide employment
              education and training services for people who receive Temporary Assistance for Needy
              Families (TANF) and General Assistance (GA). Services include employment counseling,
              assessment, job search assistance, work experience, on-the-job training, vocational
              education, basic education skill development, computer literacy training, and other
              services to help WFNJ recipients find and keep a job. For more information, please
              call 800-792-9773, submit this online{" "}
              <a
                href="https://www.nj.gov/humanservices/dfd/staff/email/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                form
              </a>
              , or visit{" "}
              <a
                href="https://www.njhelps.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                NJHelps
              </a>{" "}
              to see if you are eligible for assistance.
            </p>
            <p>
              If you cannot work because of sickness or injury not caused by your job, you may be
              eligible for{" "}
              <a
                href="https://myleavebenefits.nj.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Temporary Disability Insurance benefits
              </a>
              . File your claim{" "}
              <a
                href="https://identity.dol.state.nj.us/amserver/UI/Login?module=LWD&goto=https%3A%2F%2Flwd.state.nj.us%3A443%2Ftdi%2FTDIIntroduction.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                online
              </a>{" "}
              for faster service. In addition, you may be eligible for{" "}
              <a
                href="https://www.ssa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Social Security
              </a>
              benefits such as{" "}
              <a
                href="https://www.ssa.gov/planners/disability/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Disability Insurance
              </a>
              or{" "}
              <a
                href="https://www.ssa.gov/ssi/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Supplemental Security Income
              </a>
              .
            </p>
            <h2 className="text-l mvd">Unemployment Insurance Support and Contact Information</h2>
            <h3 className="weight-500">Mailing Address</h3>
            <p>
              Unemployment Insurance - Customer Service Office <br />
              New Jersey Department of Labor and Workforce Development <br />
              PO Box 058 <br />
              Trenton, NJ 08625-0058
            </p>
            <h3 className="weight-500">Online and phone support</h3>
            <p>
              For more information about unemployment insurance, visit the{" "}
              <a
                href="https://myunemployment.nj.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Division of Unemployment Insurance’s website
              </a>
              . For direct contact, please call your local{" "}
              <a
                href="https://myunemployment.nj.gov/labor/myunemployment/help/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Reemployment Call Center
              </a>{" "}
              or contact the Division of Unemployment Insurance at (609) 292-24660 or at{" "}
              <a
                href="mailto:UIhelp@dol.nj.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                UIhelp@dol.nj.gov
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
