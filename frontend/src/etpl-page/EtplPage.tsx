import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { useMediaQuery } from "@material-ui/core";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BetaBanner } from "../components/BetaBanner";
import { Client } from "../domain/Client";
import { MajorGroup } from "./MajorGroup";
import { LinkButton } from "../components/LinkButton";

import BoardOfCosmetology from "./agency-icons/cosmetology.svg";
import BoardOfNursing from "./agency-icons/nursing.svg";
import OfficeOfTheSecretaryOfHigherEducation from "./agency-icons/office-of-higher-education.svg";
import DepartmentOfBankingAndInsuranceInsuranceLicensing from "./agency-icons/banking-and-insurance_insurance-licensing.svg";
import DepartmentOfBankingAndInsuranceRealEstateCommission from "./agency-icons/banking-and-insurance_real-estate.svg";
import DepartmentOfLaborWorkforceDevelopmentTrainingEvaluationUnit from "./agency-icons/njdol_training-evaluation-unit.svg";
import DepartmentOfLaborWorkforceDevelopmentGranteesForCustomizedTrainingYouthAndDVRSPrograms from "./agency-icons/njdol_grantees-customized-training-youth-dvrs-programs.svg";
import DepartmentOfEducationPublicSchools from "./agency-icons/doe_public-schools.svg";
import DepartmentOfEnvironmentalProtectionRadiologyXrayPrograms from "./agency-icons/doep_radiology-xray-programs.svg";
import DepartmentOfHealthLongTermCareFacilitiesLicensing from "./agency-icons/doh_long-term-care-facilities-licensing.svg";
import DepartmentOfHealthIndoorEnvironmentsProgram from "./agency-icons/doh_indoor_environments_program.svg";
import DepartmentOfHealthNJOfficeOfEmergencyMedicalServices from "./agency-icons/doh_njems.svg";
import FederalAviationAdministration from "./agency-icons/faa.svg";
import MotorVehicleCommission from "./agency-icons/motor-vehicle-commission.svg";
import NJBoardObjectfRealEstateAppraisers from "./agency-icons/nj-board-of-real-estate-appraisers.svg";
import NJStatePoliceSecurityOfficerTrainingSORA from "./agency-icons/nj-state-police_security-officer-training-sora.svg";
import ProLiteracy from "./agency-icons/proliteracy.svg";

interface Props extends RouteComponentProps {
  client: Client;
}

export const EtplPage = (props: Props): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");

  useEffect(() => {
    document.title = "ETPL";

    if (window.location.hash === "") {
      window.scrollTo(0, 0);
    }
  }, []);

  const displayAgencyList = (): ReactElement => {
    return (
      <>
        <MajorGroup title="Board of Cosmetology" icon={BoardOfCosmetology}>
          <p>
            The New Jersey State Board of Cosmetology and Hairstyling board licenses and regulates
            barbers, beauticians, cosmetology-hairstylists, manicurists, skin care specialists,
            teachers, shops and schools and registers students who attend these schools.{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.njconsumeraffairs.gov/cos"
            >
              Learn more
            </a>
          </p>
        </MajorGroup>

        <MajorGroup title="Board of Nursing" icon={BoardOfNursing}>
          <p>
            The New Jersey Board of Nursing was established in 1912 to protect the health, safety
            and welfare of New Jersey's residents by ensuring that those who practice nursing are
            qualified and competent to do so. This board licenses registered nurses and practical
            nurses, and regulates the nursing profession in New Jersey. The board certifies advanced
            practice nurses, sexual assault forensic nurses, and certified homemaker-home health
            aides. The board accredits nursing schools and approves clinical affiliates.{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.njconsumeraffairs.gov/nur/Pages/default.aspx"
            >
              Learn more
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title="Office of the Secretary of Higher Education"
          icon={OfficeOfTheSecretaryOfHigherEducation}
        >
          <p>
            An institution seeking to offer academic degree programs and/or college credit-bearing
            courses with a physical presence in New Jersey shall first provide evidence of
            incorporation and petition the Secretary for licensure. No institution shall offer or
            advertise the availability of college credit-bearing course(s) or academic degree
            program(s) with a physical presence in New Jersey before receiving formal approval of
            its petition.{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.state.nj.us/highereducation/documents/pdf/Licensure/LicensureRules.pdf"
            >
              Learn more about licensing
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title="Department of Banking and Insurance: Insurance Licensing"
          icon={DepartmentOfBankingAndInsuranceInsuranceLicensing}
        >
          <p>
            Learn more about Banking and Insurance{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.state.nj.us/dobi/inslic.htm#ApplicationsandForms"
            >
              licensing education forms
            </a>
            .
          </p>
        </MajorGroup>

        <MajorGroup
          title="Department of Banking and Insurance: Real Estate Commission"
          icon={DepartmentOfBankingAndInsuranceRealEstateCommission}
        >
          <>
            <p>
              Established in 1921, the New Jersey Real Estate Commission (REC), a division of the
              New Jersey Department of Banking and Insurance, was created to administer and enforce
              New Jersey's real estate licensing law, N.J.S.A. 45:15-1 et seq.
            </p>
            <p>
              The REC issues licenses to real estate brokers and salespersons, real estate schools,
              and course instructors, as well as establishes standards of practice for the real
              estate brokerage profession. It also regulates and registers out-of-state sales
              through New Jersey brokers.{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.state.nj.us/dobi/division_rec/index.htm"
              >
                Learn more
              </a>
            </p>
          </>
        </MajorGroup>

        <MajorGroup
          title="Department of Labor & Workforce Development, Training Evaluation Unit (TEU)"
          icon={DepartmentOfLaborWorkforceDevelopmentTrainingEvaluationUnit}
        >
          <p>
            The Training Evaluation Unit works in conjunction with the Department of Education’s
            Office of Career Readiness (PCSU) to evaluate and approve private career schools and
            correspondence schools that wish to operate within New Jersey’s workforce readiness
            system. All approved providers require biannual reviews in order to maintain continued
            approval. TEU staff provides technical assistance to approved and prospective providers
            as well as customers of the New Jersey workforce readiness system. For more information,
            please contact the Training Evaluation Unit by e-mail at:{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:TrainingEvaluationUnit@dol.nj.gov"
            >
              TrainingEvaluationUnit@dol.nj.gov
            </a>{" "}
            or{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.nj.gov/labor/lwdhome/coei/teu.html"
            >
              visit the website
            </a>
            .
          </p>
        </MajorGroup>

        <MajorGroup
          title="Department of Labor & Workforce Development (grantees for customized training, youth and DVRS programs)"
          icon={
            DepartmentOfLaborWorkforceDevelopmentGranteesForCustomizedTrainingYouthAndDVRSPrograms
          }
        >
          <>
            <p>
              Any individual with a physical, mental, cognitive, or other form of disability who has
              a substantial impediment to employment may qualify for the following services through
              the New Jersey Division of Vocational Rehabilitation Services (DVRS).
            </p>
            <p>
              The mission of the New Jersey Division of Vocational Rehabilitation Services is to
              enable eligible individuals with disabilities to achieve an employment outcome
              consistent with their strengths, priorities, needs, abilities, and capabilities.{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.nj.gov/labor/career-services/special-services/individuals-with-disabilities/"
              >
                Learn more
              </a>
            </p>
          </>
        </MajorGroup>

        <MajorGroup
          title="Department of Education, Public Schools"
          icon={DepartmentOfEducationPublicSchools}
        >
          <p>
            The New Jersey Department of Education supports schools, educators and districts to
            ensure all of New Jersey's 1.4 million students have equitable access to high quality
            education and achieve academic excellence.{" "}
            <a target="_blank" rel="noopener noreferrer" href="https://nj.gov/education/license/">
              Learn more about licensing
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title="Department of Environmental Protection (Radiology/X-ray Programs)"
          icon={DepartmentOfEnvironmentalProtectionRadiologyXrayPrograms}
        >
          <p>
            The mission of the Bureau of X-Ray Compliance (Bureau) is to improve the quality of life
            by protecting the public and radiation workers from unnecessary exposure to ionizing
            radiation from x-ray machines and reducing medical misdiagnosis caused by faulty x-ray
            equipment and operator error.{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.state.nj.us/dep/rpp/brh/index.htm"
            >
              Learn more about licensing
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title="Department of Health - Long Term Care Facilities Licensing"
          icon={DepartmentOfHealthLongTermCareFacilitiesLicensing}
        >
          <p>
            The Health Systems Branch of the New Jersey Department of Health works to ensure
            citizens receive appropriate levels of care in more than 2,000 regulated facilities
            statewide. These include hospitals, nursing homes, assisted living residences,
            ambulatory care centers, home health care, medical day care and other types of
            healthcare facilities.{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.state.nj.us/health/healthfacilities/certification-licensing/"
            >
              Learn more about licensing
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title="Department of Health - Indoor Environments Program"
          icon={DepartmentOfHealthIndoorEnvironmentsProgram}
        >
          <p>
            The quality of the environment you experience every day, such as the air you breathe
            indoors and the water you drink, can affect your health. The New Jersey Department of
            Health provides information about environmental health, and regulates some indoor air
            quality in certain settings.{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.nj.gov/health/ceohs/environmental-occupational/child-care-edu/index.shtml"
            >
              Learn more about indoor health assessments
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title="Department of Health - NJ Office of Emergency Medical Services"
          icon={DepartmentOfHealthNJOfficeOfEmergencyMedicalServices}
        >
          <p>
            The Office of Emergency Medical Services (OEMS) certifies more than 26,000 Emergency
            Medical Technician (EMTs) and 1,700 Mobile Intensive Care Paramedics (MICP's) as well as
            licensing mobility assistance vehicles, ambulances, mobile intensive care units,
            specialty care transport units and air medical units totaling more than 4,500 vehicles.{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.state.nj.us/health/ems/education/"
            >
              Learn more about licensing
            </a>
          </p>
        </MajorGroup>

        <MajorGroup title="Federal Aviation Administration" icon={FederalAviationAdministration}>
          <p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.faa.gov/pilots/training/"
            >
              Learn more about pilot school certification
            </a>
          </p>
        </MajorGroup>

        <MajorGroup title="Motor Vehicle Commission" icon={MotorVehicleCommission}>
          <p>
            MVC issues licenses that authorize driving schools and instructors to operate within the
            state of New Jersey. They also allow driving school owners and specified instructors or
            agents to purchase student learner's permits, examination permits, schedule road tests
            and administer state-approved knowledge and vision tests.{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.state.nj.us/mvcbiz/BusinessServices/DrivingSchool.htm"
            >
              Learn more about driving school licensing
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title="NJ Board of Real Estate Appraisers"
          icon={NJBoardObjectfRealEstateAppraisers}
        >
          <p>
            The New Jersey Legislature created the State Real Estate Appraiser Board to regulate the
            appraisal profession and evaluate the credentials of applicants for licensure and
            certification. This board is responsible for the regulation of real estate appraisers in
            New Jersey. The category of licenses issued by the board include licensed real estate
            appraisers, residential appraisers, certified general appraisers and apprentice
            appraisers.{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.njconsumeraffairs.gov/rea/Pages/default.aspx"
            >
              Learn more about licensing
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title="NJ State Police (Security Officer Training - SORA) "
          icon={NJStatePoliceSecurityOfficerTrainingSORA}
        >
          <p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.njsp.org/private-detective/sora.shtml"
            >
              Learn more about Security Officer Licensing
            </a>
          </p>
        </MajorGroup>

        <MajorGroup title="ProLiteracy" icon={ProLiteracy}>
          <p>
            ProLiteracy’s mission is to change lives and communities through the power of adult
            literacy.{" "}
            <a target="_blank" rel="noopener noreferrer" href="https://www.proliteracy.org/">
              Learn more about ProLiteracy
            </a>
          </p>
        </MajorGroup>
      </>
    );
  };

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners">
        <div className="row">
          <div className="col-md-10">
            <h2 className="text-xl mvd">
              A checklist of steps to get on the Eligible Training Provider List (ETPL)
            </h2>
            <h3 className="text-l">Why get your organization listed on the ETPL?</h3>
            <p className="mbm">
              The ETPL is intended to be an online report card that provides information on all
              providers and programs of occupational training in New Jersey. This website containing
              the ETPL and the CRC are available to everyone - not just those seeking training with
              public funds. Consequently, if you want your program information to be considered by
              those seeking training, your school and program information should be on the list to
              avoid being at a competitive disadvantage. If you are not on the list, those seeking
              training on this website will not find you and may come to the conclusion that you do
              not exist or are not approved. In addition, although your program may not receive
              state or federal training funds at this time, you may want to be eligible in the
              future.
            </p>

            <h3 className="text-l">Step 1: Obtain approval from a qualified government agency</h3>
            <p className="mbm">
              All training providers seeking placement on the ETPL under Workforce Innovation And
              Opportunity Act or State law are required to submit a formal application to the Center
              for Occupational Employment Information (COEI). The types of ETPL applications are
              explained and available for download at the links below.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="fdc mtd mbl">{displayAgencyList()}</div>
          </div>
        </div>

        <div id="#apply" className="row">
          <div className="col-md-10">
            <h3 className="text-l">Step 2: Find your application</h3>
            <p className="mbm">
              All training providers seeking placement on the ETPL under WIOA or State law are
              required to submit a formal application to the Center for Occupational Employment
              Information (COEI) . The types of ETPL applications are explained and available for
              download below:
            </p>
            <div className={isTablet ? "plxl" : ""}>
              <h4 className="weight-500 mtl">For New Applicants</h4>
              <p className="mbl">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://lwd.dol.state.nj.us/labor/forms_pdfs/coei/ETPL/ETPLInitialApplicationPacket.pdf"
                >
                  ETPL Initial Application Packet
                </a>
                <span className="flex">
                  This application is to be used by all new training providers seeking ETPL
                  placement that were not previously listed on the ETPL.
                </span>
              </p>
              <p className="mbl">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://lwd.dol.state.nj.us/labor/forms_pdfs/coei/ETPL/ETPLRenewalApplicationPacket.pdf"
                >
                  ETPL Renewal Application Packet
                </a>
                <span className="flex">
                  This application is to be used by all training providers who have already been
                  listed on the ETPL and are seeking to renew their ETPL eligibility.
                </span>
              </p>
              <p className="mbl">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.nj.gov/labor/forms_pdfs/coei/ETPL/ETPL%20Apprenticeship%20Application.pdf"
                >
                  ETPL Registered Apprenticeship Application Packet
                </a>
                <span className="flex">
                  This application is to be used by Registered Apprenticeship programs seeking
                  placement on the ETPL.
                </span>
              </p>

              <h4 className="weight-500 mtl">For WIOA Youth/WFNJ Providers:</h4>
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://www.nj.gov/labor/forms_pdfs/coei/ETPL/Youth_WFNJ%20Procedure.pdf"
                >
                  NJ Workforce Innovation Notice 10-17(A)
                </a>
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://www.nj.gov/labor/forms_pdfs/coei/ETPL/ETPL%20Initial%20Service%20Provider%20Application%20Packet.pdf"
                >
                  ETPL Initial WIOA Youth/WFNJ Provider
                </a>
              </p>

              <h4 className="weight-500 mtl">For Existing Providers</h4>
              <p className="mbl">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://lwd.dol.state.nj.us/labor/forms_pdfs/coei/ETPL/ETPLProgramAdditionModification.pdf"
                >
                  ETPL Program Addition/Modification Packet
                </a>
                <span className="flex">
                  This application is to be used by providers who are already ETPL approved and wish
                  to add new programs or modify existing programs on the ETPL.
                </span>
              </p>
            </div>

            <h3 className="text-l">Step 3: Submit your application</h3>
            <p className="mbm">
              Submit your application to COEI at{" "}
              <a
                className="link-format-blue"
                target="_blank"
                rel="noopener noreferrer"
                href="mailto:njtopps@dol.nj.gov"
              >
                njtopps@dol.nj.gov.
              </a>{" "}
              COEI will follow up if there are any questions regarding your application.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 align-center">
            <h4 className="mtl mbs text-m weight-500">Have More Questions?</h4>
            <p className="mtz mbd text-m weight-500">Get in Touch</p>
            <LinkButton secondary external className="mbl" to="mailto:test@email.com">
              Contact Us
            </LinkButton>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
