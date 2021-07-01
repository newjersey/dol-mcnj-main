import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";

export const FaqChildcare = (props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Child Care";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Child Care" />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">Child & Family Care</h2>

            <h3 className="weight-500">COVID-19</h3>
            <p>
              New information for parents and child care providers is available on the NJ Department
              of Human Services Division of Family Development{" "}
              <a
                href="https://www.childcarenj.gov/Resources/Coronavirus"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Coronavirus Disease 2019 (COVID-19) page
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

            <h3 className="weight-500">
              New Jersey Child Care Resource and Referral Agencies (CCR&Rs)
            </h3>
            <p>
              New Jersey’s CCR&Rs have trained staff to provide information to parents, the public,
              and providers about the availability of child care services provided through the New
              Jersey's Child Care Subsidy Program and other programs for which a family may be
              eligible. They also provide information about different types of child care providers
              and how to apply for financial assistance to obtain child care. To learn more about
              New Jersey’s CCR&Rs, visit this{" "}
              <a
                href="http://www.childcarenj.gov/parents/Child-Care-Resource-and-Referral-Agencies"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                website
              </a>
              .
            </p>

            <h2 className="text-l mvd">Home-based Child Care Options</h2>

            <h3 className="weight-500">Family Child Care</h3>
            <p>
              This type of care is provided in someone’s home. In New Jersey, a provider can care
              for no more than five children, with an additional three children of their own. Home
              providers can choose to be{" "}
              <a
                href="https://www.nj.gov/dcf/about/divisions/ol/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                registered
              </a>
              , which requires them to meet basic safety standards outlined under state law. This
              registration also allows these in-home providers to accept payments from families
              participating in government-subsidized child care assistance programs. For additional
              details, click{" "}
              <a
                href="http://www.childcarenj.gov/getattachment/Parents/Types-of-Child-Care/NJFD_FindingQualityCC_checklist_12-22-pdf-(1).pdf.aspx?lang=en-US"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>
              .
            </p>

            <h3 className="weight-500">In-Home Care</h3>
            <p>
              In this type of care, a person comes to your home to care for your child.. Although
              you may use an agency to find such a provider, they are neither regulated nor licensed
              by the state and cannot participate in Grow NJ Kids. To learn more about in-home child
              care, please click{" "}
              <a
                href="http://www.childcarenj.gov/Providers/How-to-Become-a-Provider"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>
              .
            </p>

            <h2 className="text-l mvd">Center and School-based Child Care Options</h2>

            <h3 className="weight-500">Child Care Centers</h3>
            <p>
              Licensed by the state of New Jersey, these facilities are inspected every two years
              and must meet basic health, safety, program and staffing requirements. They can care
              for six or more children from the age of 6 weeks to 13 years.
            </p>

            <h3 className="weight-500">Head Start & Early Head Start</h3>
            <p>
              Head Start and Early Head Start programs support the mental, social and emotional
              development of children from birth to age 5. In addition to education services,
              programs provide children and their families with health, nutrition, social and other
              services.{" "}
            </p>

            <h3 className="weight-500">School District Preschool Programs</h3>
            <p>
              School districts provide research-based preschool programs for 3- and 4-year-olds,
              that may be located within a school district site, a private provider, or a local Head
              Start agency.
            </p>

            <h3 className="weight-500">Special Services School Districts</h3>
            <p>
              These districts provide options for preschool students with special needs ages 3-5.{" "}
            </p>

            <h3 className="weight-500">Applying for a Child Care Subsidy*</h3>
            <p>
              When applying for a child care subsidy, you will be required to provide the following:
              proof of income, training/school hours and household size. All required documents must
              be submitted to be considered for a subsidy. Eligibility requirements for both
              applicant(s)/parents and children are listed{" "}
              <a
                href="http://www.childcarenj.gov/Parents/SubsidyProgram"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>
              . To apply, complete and submit the following{" "}
              <a
                href="http://www.childcarenj.gov/getattachment/Parents/How-To-Apply/Subsidy-Application-English-pdf.pdf.aspx?lang=en-US"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                forms
              </a>{" "}
              to the{" "}
              <a
                href="http://www.childcarenj.gov/Parents/CCRR"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Child Care Resource and Referral (CCR&R) agency
              </a>{" "}
              in your county.
            </p>

            <h3 className="weight-500">New Jersey Child Support*</h3>
            <p>
              The Office of Child Support Services assists parents in obtaining the financial
              support necessary for their children to prosper in a stable setting. For more
              information, click{" "}
              <a
                href="https://www.njchildsupport.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here
              </a>{" "}
              or call 1 (877)-NJKIDS1.
            </p>
            <p>
              If you have any questions, please contact your county’s CCR&R agency or call the Child
              Care Helpline at 1-800-332-9227.
            </p>

            <h3 className="weight-500">Federal Resources*</h3>
            <p>
              In addition, the U.S. Department of Health and Human Services'{" "}
              <a
                href="https://www.acf.hhs.gov/help"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Administration for Children and Families
              </a>{" "}
              partners with programs that encourage strong, healthy, supportive communities that
              promote economic independence, productivity, and childhood development. For more
              information on their hotlines to reach them directly, click{" "}
              <a
                href="https://www.acf.hhs.gov/acf-hotlines"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                here.
              </a>
            </p>
            <p>
              *For more information about any of these child care programs, download this{" "}
              <a
                href="http://www.childcarenj.gov/getattachment/Parents/Types-of-Child-Care/NJFD_FindingQualityCC_checklist_12-22-pdf.pdf.aspx?lang=en-US"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                brochure
              </a>
              .
            </p>
            <p>
              For all other family, dependent, and senior / elder care resources, please visit{" "}
              <a
                href="https://www.nj211.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                NJ 2-1-1
              </a>{" "}
              or with your phone dial 2-1-1.{" "}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
