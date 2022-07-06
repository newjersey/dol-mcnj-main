import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { useMediaQuery } from "@material-ui/core";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BetaBanner } from "../components/BetaBanner";
import { Client } from "../domain/Client";
import { MajorGroup } from "./MajorGroup";

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
import { ContactUsSection } from "../components/ContactUsSection";
import { Trans, useTranslation } from "react-i18next";

const LINKS = {
  applicationPacketLink:
    "http://lwd.dol.state.nj.us/labor/forms_pdfs/coei/ETPL/ETPLInitialApplicationPacket.pdf",
  renewalPacketLink:
    "http://lwd.dol.state.nj.us/labor/forms_pdfs/coei/ETPL/ETPLRenewalApplicationPacket.pdf",
  apprenticeshipPacketLink:
    "https://www.nj.gov/labor/forms_pdfs/coei/ETPL/ETPL%20Apprenticeship%20Application.pdf",
  workforceInnovationLink:
    "http://www.nj.gov/labor/forms_pdfs/coei/ETPL/Youth_WFNJ%20Procedure.pdf",
  wioaYouthLink:
    "http://www.nj.gov/labor/forms_pdfs/coei/ETPL/ETPL%20Initial%20Service%20Provider%20Application%20Packet.pdf",
  additionModificationLink:
    "http://lwd.dol.state.nj.us/labor/forms_pdfs/coei/ETPL/ETPLProgramAdditionModification.pdf",
  cosmetologyLink: "https://www.njconsumeraffairs.gov/cos",
  nursingLink: "https://www.njconsumeraffairs.gov/nur/Pages/default.aspx",
  higherEdLink:
    "https://www.state.nj.us/highereducation/documents/pdf/Licensure/LicensureRules.pdf",
  insuranceLink: "https://www.state.nj.us/dobi/inslic.htm#ApplicationsandForms",
  realEstateLink: "https://www.state.nj.us/dobi/division_rec/index.htm",
  laborTrainingEvalLink1: "mailto:TrainingEvaluationUnit@dol.nj.gov",
  laborTrainingEvalLink2: "https://www.nj.gov/labor/lwdhome/coei/teu.html",
  laborGranteesLink:
    "https://www.nj.gov/labor/career-services/special-services/individuals-with-disabilities/",
  publicSchoolsLink: "https://nj.gov/education/license/",
  xraysLink: "https://www.state.nj.us/dep/rpp/brh/index.htm",
  longTermCareLink: "https://www.state.nj.us/health/healthfacilities/certification-licensing/",
  indoorEnvLink:
    "https://www.nj.gov/health/ceohs/environmental-occupational/child-care-edu/index.shtml",
  emergencyMedLink: "https://www.state.nj.us/health/ems/education/",
  aviationLink: "https://www.faa.gov/pilots/training/",
  motorVehiclesLink: "https://www.state.nj.us/mvcbiz/BusinessServices/DrivingSchool.htm",
  realEstateAppraiserLink: "https://www.njconsumeraffairs.gov/rea/Pages/default.aspx",
  securityOfficerLink: "https://www.njsp.org/private-detective/sora.shtml",
  proLiteracyLink: "https://www.proliteracy.org/",
  step3Link: "mailto:njtopps@dol.nj.gov",
};

interface Props extends RouteComponentProps {
  client: Client;
}

export const EtplPage = (_props: Props): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "ETPL";

    if (window.location.hash === "") {
      window.scrollTo(0, 0);
    }
  }, []);

  const displayAgencyList = (): ReactElement => {
    return (
      <>
        <MajorGroup title={t("EtplPage.cosmetology")} icon={BoardOfCosmetology}>
          <p>
            {t("EtplPage.cosmetologyText")}
            &nbsp;
            <a
              target="_blank"
              className="link-format-blue"
              rel="noopener noreferrer"
              href={LINKS.cosmetologyLink}
            >
              {t("EtplPage.cosmetologyLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup title={t("EtplPage.nursing")} icon={BoardOfNursing}>
          <p>
            {t("EtplPage.nursingText")}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.nursingLink}
            >
              {t("EtplPage.nursingLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup title={t("EtplPage.higherEd")} icon={OfficeOfTheSecretaryOfHigherEducation}>
          <p>
            {t("EtplPage.higherEdText")}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.higherEdLink}
            >
              {t("EtplPage.higherEdLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title={t("EtplPage.insurance")}
          icon={DepartmentOfBankingAndInsuranceInsuranceLicensing}
        >
          <p>
            {t("EtplPage.insuranceText")}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.insuranceLink}
            >
              {t("EtplPage.insuranceLinkText")}
            </a>
            .
          </p>
        </MajorGroup>

        <MajorGroup
          title={t("EtplPage.realEstate")}
          icon={DepartmentOfBankingAndInsuranceRealEstateCommission}
        >
          <>
            <p>{t("EtplPage.realEstateText1")}</p>
            <p>
              {t("EtplPage.realEstateText2")}
              &nbsp;
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
                href={LINKS.realEstateLink}
              >
                {t("EtplPage.realEstateLinkText")}
              </a>
            </p>
          </>
        </MajorGroup>

        <MajorGroup
          title={t("EtplPage.laborTrainingEval")}
          icon={DepartmentOfLaborWorkforceDevelopmentTrainingEvaluationUnit}
        >
          <p>
            {t("EtplPage.laborTrainingEvalText")}{" "}
            <Trans i18nKey="EtplPage.laborTrainingEvalLink">
              start
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
                href={LINKS.laborTrainingEvalLink1}
              >
                link1
              </a>
              middle
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
                href={LINKS.laborTrainingEvalLink2}
              >
                link2
              </a>
              end
            </Trans>
          </p>
        </MajorGroup>

        <MajorGroup
          title={t("EtplPage.laborGrantees")}
          icon={
            DepartmentOfLaborWorkforceDevelopmentGranteesForCustomizedTrainingYouthAndDVRSPrograms
          }
        >
          <>
            <p>{t("EtplPage.laborGranteesText1")}</p>
            <p>
              {t("EtplPage.laborGranteesText2")}
              &nbsp;
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
                href={LINKS.laborGranteesLink}
              >
                {t("EtplPage.laborGranteesLinkText")}
              </a>
            </p>
          </>
        </MajorGroup>

        <MajorGroup title={t("EtplPage.publicSchools")} icon={DepartmentOfEducationPublicSchools}>
          <p>
            {t("EtplPage.publicSchoolsText")}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.publicSchoolsLink}
            >
              {t("EtplPage.publicSchoolsLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title={t("EtplPage.xrays")}
          icon={DepartmentOfEnvironmentalProtectionRadiologyXrayPrograms}
        >
          <p>
            {t("EtplPage.xraysText")}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.xraysLink}
            >
              {t("EtplPage.xraysLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title={t("EtplPage.longTermCare")}
          icon={DepartmentOfHealthLongTermCareFacilitiesLicensing}
        >
          <p>
            {t("EtplPage.longTermCareText")}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.longTermCareLink}
            >
              {t("EtplPage.longTermCareLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title={t("EtplPage.indoorEnv")}
          icon={DepartmentOfHealthIndoorEnvironmentsProgram}
        >
          <p>
            {t("EtplPage.indoorEnvText")}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.indoorEnvLink}
            >
              {t("EtplPage.indoorEnvLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title={t("EtplPage.emergencyMed")}
          icon={DepartmentOfHealthNJOfficeOfEmergencyMedicalServices}
        >
          <p>
            {t("EtplPage.emergencyMedText")}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.emergencyMedLink}
            >
              {t("EtplPage.emergencyMedLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup title={t("EtplPage.aviation")} icon={FederalAviationAdministration}>
          <p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.aviationLink}
            >
              {t("EtplPage.aviationLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup title={t("EtplPage.motorVehicles")} icon={MotorVehicleCommission}>
          <p>
            {t("EtplPage.motorVehiclesText")}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.motorVehiclesLink}
            >
              {t("EtplPage.motorVehiclesLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title={t("EtplPage.realEstateAppraiser")}
          icon={NJBoardObjectfRealEstateAppraisers}
        >
          <p>
            {t("EtplPage.realEstateAppraiserText")}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.realEstateAppraiserLink}
            >
              {t("EtplPage.realEstateAppraiserLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup
          title={t("EtplPage.securityOfficer")}
          icon={NJStatePoliceSecurityOfficerTrainingSORA}
        >
          <p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.securityOfficerLink}
            >
              {t("EtplPage.securityOfficerLinkText")}
            </a>
          </p>
        </MajorGroup>

        <MajorGroup title={t("EtplPage.proLiteracy")} icon={ProLiteracy}>
          <p>
            {t("EtplPage.proLiteracyText")}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="link-format-blue"
              href={LINKS.proLiteracyLink}
            >
              {t("EtplPage.proLiteracyLinkText")}
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
            <h2 className="text-xl mvd">{t("EtplPage.header")}</h2>
            <h3 className="text-l">{t("EtplPage.sectionOneHeader")}</h3>
            <p className="mbm">{t("EtplPage.sectionOneText")}</p>

            <h3 className="text-l"> {t("EtplPage.step1Header")}</h3>
            <p className="mbm">{t("EtplPage.step1Text")}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="fdc mtd mbl">{displayAgencyList()}</div>
          </div>
        </div>

        <div id="#apply" className="row">
          <div className="col-md-10">
            <h3 className="text-l"> {t("EtplPage.step2Header")}</h3>
            <p className="mbm">{t("EtplPage.step2Text")}</p>
            <div className={isTablet ? "plxl" : ""}>
              <h4 className="weight-500 mtl">{t("EtplPage.newApplicants")}</h4>
              <p className="mbl">
                <a
                  target="_blank"
                  className="link-format-blue"
                  rel="noopener noreferrer"
                  href={LINKS.applicationPacketLink}
                >
                  {t("EtplPage.applicationPacketLinkText")}
                </a>
                <span className="flex">{t("EtplPage.applicationPacketDescription")}</span>
              </p>
              <p className="mbl">
                <a
                  target="_blank"
                  className="link-format-blue"
                  rel="noopener noreferrer"
                  href={LINKS.renewalPacketLink}
                >
                  {t("EtplPage.renewalPacketLinkText")}
                </a>
                <span className="flex">{t("EtplPage.renewalPacketDescription")}</span>
              </p>
              <p className="mbl">
                <a
                  target="_blank"
                  className="link-format-blue"
                  rel="noopener noreferrer"
                  href={LINKS.apprenticeshipPacketLink}
                >
                  {t("EtplPage.apprenticeshipPacketLinkText")}
                </a>
                <span className="flex">{t("EtplPage.apprenticeshipPacketDescription")}</span>
              </p>

              <h4 className="weight-500 mtl">{t("EtplPage.wioaWfnj")}</h4>
              <p>
                <a
                  target="_blank"
                  className="link-format-blue"
                  rel="noopener noreferrer"
                  href={LINKS.workforceInnovationLink}
                >
                  {t("EtplPage.workforceInnovationLinkText")}
                </a>
              </p>
              <p>
                <a
                  target="_blank"
                  className="link-format-blue"
                  rel="noopener noreferrer"
                  href={LINKS.wioaYouthLink}
                >
                  {t("EtplPage.wioaYouthLinkText")}
                </a>
              </p>

              <h4 className="weight-500 mtl">{t("EtplPage.existingProviders")}</h4>
              <p className="mbl">
                <a
                  target="_blank"
                  className="link-format-blue"
                  rel="noopener noreferrer"
                  href={LINKS.additionModificationLink}
                >
                  {t("EtplPage.additionModificationLinkText")}
                </a>
                <span className="flex">{t("EtplPage.additionModificationDescription")}</span>
              </p>
            </div>

            <h3 className="text-l">{t("EtplPage.step3Header")}</h3>
            <p className="mbm">
              <Trans i18nKey="EtplPage.step3Text">
                Submit your application to COEI at
                <a
                  className="link-format-blue"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={LINKS.step3Link}
                >
                  njtopps@dol.nj.gov
                </a>
                and COEI will follow up if there are any questions regarding your application.
              </Trans>
            </p>
          </div>
        </div>

        <div className="row">
          <ContactUsSection />
        </div>
      </main>

      <Footer />
    </>
  );
};
