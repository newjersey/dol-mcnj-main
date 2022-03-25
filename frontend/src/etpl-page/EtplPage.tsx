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
import { EtplPageStrings } from "../localizations/EtplPageStrings";
import { ContactUsSection } from "../components/ContactUsSection";

interface Props extends RouteComponentProps {
  client: Client;
}

export const EtplPage = (_props: Props): ReactElement => {
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
        <MajorGroup title={EtplPageStrings.cosmetology} icon={BoardOfCosmetology}>
          <p>
            {EtplPageStrings.cosmetologyText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.cosmetologyLink}>
              {EtplPageStrings.cosmetologyLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.cosmetologyText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup title={EtplPageStrings.nursing} icon={BoardOfNursing}>
          <p>
            {EtplPageStrings.nursingText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.nursingLink}>
              {EtplPageStrings.nursingLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.nursingText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup title={EtplPageStrings.higherEd} icon={OfficeOfTheSecretaryOfHigherEducation}>
          <p>
            {EtplPageStrings.higherEdText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.higherEdLink}>
              {EtplPageStrings.higherEdLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.higherEdText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup
          title={EtplPageStrings.insurance}
          icon={DepartmentOfBankingAndInsuranceInsuranceLicensing}
        >
          <p>
            {EtplPageStrings.insuranceText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.insuranceLink}>
              {EtplPageStrings.insuranceLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.insuranceText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup
          title={EtplPageStrings.realEstate}
          icon={DepartmentOfBankingAndInsuranceRealEstateCommission}
        >
          <>
            <p>{EtplPageStrings.realEstateText1}</p>
            <p>
              {EtplPageStrings.realEstateText2.split("{link}")[0].trim()}
              &nbsp;
              <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.realEstateLink}>
                {EtplPageStrings.realEstateLinkText}
              </a>
              &nbsp;
              {EtplPageStrings.realEstateText2.split("{link}")[1].trim()}
            </p>
          </>
        </MajorGroup>

        <MajorGroup
          title={EtplPageStrings.laborTrainingEval}
          icon={DepartmentOfLaborWorkforceDevelopmentTrainingEvaluationUnit}
        >
          <p>
            {EtplPageStrings.laborTrainingEvalText.split("{link1}")[0].trim()}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={EtplPageStrings.laborTrainingEvalLink1}
            >
              {EtplPageStrings.laborTrainingEvalLinkText1}
            </a>
            &nbsp;
            {EtplPageStrings.laborTrainingEvalText.split("{link1}")[1].split("{link2}")[0].trim()}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={EtplPageStrings.laborTrainingEvalLink2}
            >
              {EtplPageStrings.laborTrainingEvalLinkText2}
            </a>
            &nbsp;
            {EtplPageStrings.laborTrainingEvalText.split("{link1}")[1].split("{link2}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup
          title={EtplPageStrings.laborGrantees}
          icon={
            DepartmentOfLaborWorkforceDevelopmentGranteesForCustomizedTrainingYouthAndDVRSPrograms
          }
        >
          <>
            <p>{EtplPageStrings.laborGranteesText1}</p>
            <p>
              {EtplPageStrings.laborGranteesText2.split("{link}")[0].trim()}
              &nbsp;
              <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.laborGranteesLink}>
                {EtplPageStrings.laborGranteesLinkText}
              </a>
              &nbsp;
              {EtplPageStrings.laborGranteesText2.split("{link}")[1].trim()}
            </p>
          </>
        </MajorGroup>

        <MajorGroup title={EtplPageStrings.publicSchools} icon={DepartmentOfEducationPublicSchools}>
          <p>
            {EtplPageStrings.publicSchoolsText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.publicSchoolsLink}>
              {EtplPageStrings.publicSchoolsLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.publicSchoolsText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup
          title={EtplPageStrings.xrays}
          icon={DepartmentOfEnvironmentalProtectionRadiologyXrayPrograms}
        >
          <p>
            {EtplPageStrings.xraysText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.xraysLink}>
              {EtplPageStrings.xraysLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.xraysText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup
          title={EtplPageStrings.longTermCare}
          icon={DepartmentOfHealthLongTermCareFacilitiesLicensing}
        >
          <p>
            {EtplPageStrings.longTermCareText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.longTermCareLink}>
              {EtplPageStrings.longTermCareLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.longTermCareText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup
          title={EtplPageStrings.indoorEnv}
          icon={DepartmentOfHealthIndoorEnvironmentsProgram}
        >
          <p>
            {EtplPageStrings.indoorEnvText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.indoorEnvLink}>
              {EtplPageStrings.indoorEnvLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.indoorEnvText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup
          title={EtplPageStrings.emergencyMed}
          icon={DepartmentOfHealthNJOfficeOfEmergencyMedicalServices}
        >
          <p>
            {EtplPageStrings.emergencyMedText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.emergencyMedLink}>
              {EtplPageStrings.emergencyMedLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.emergencyMedText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup title={EtplPageStrings.aviation} icon={FederalAviationAdministration}>
          <p>
            {EtplPageStrings.aviationText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.aviationLink}>
              {EtplPageStrings.aviationLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.aviationText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup title={EtplPageStrings.motorVehicles} icon={MotorVehicleCommission}>
          <p>
            {EtplPageStrings.motorVehiclesText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.motorVehiclesLink}>
              {EtplPageStrings.motorVehiclesLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.motorVehiclesText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup
          title={EtplPageStrings.realEstateAppraiser}
          icon={NJBoardObjectfRealEstateAppraisers}
        >
          <p>
            {EtplPageStrings.realEstateAppraiserText.split("{link}")[0].trim()}
            &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={EtplPageStrings.realEstateAppraiserLink}
            >
              {EtplPageStrings.realEstateAppraiserLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.realEstateAppraiserText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup
          title={EtplPageStrings.securityOfficer}
          icon={NJStatePoliceSecurityOfficerTrainingSORA}
        >
          <p>
            {EtplPageStrings.securityOfficerText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.securityOfficerLink}>
              {EtplPageStrings.securityOfficerLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.securityOfficerText.split("{link}")[1].trim()}
          </p>
        </MajorGroup>

        <MajorGroup title={EtplPageStrings.proLiteracy} icon={ProLiteracy}>
          <p>
            {EtplPageStrings.proLiteracyText.split("{link}")[0].trim()}
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.proLiteracyLink}>
              {EtplPageStrings.proLiteracyLinkText}
            </a>
            &nbsp;
            {EtplPageStrings.proLiteracyText.split("{link}")[1].trim()}
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
            <h2 className="text-xl mvd">{EtplPageStrings.header}</h2>
            <h3 className="text-l">{EtplPageStrings.sectionOneHeader}</h3>
            <p className="mbm">{EtplPageStrings.sectionOneText}</p>

            <h3 className="text-l"> {EtplPageStrings.step1Header}</h3>
            <p className="mbm">{EtplPageStrings.step1Text}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="fdc mtd mbl">{displayAgencyList()}</div>
          </div>
        </div>

        <div id="#apply" className="row">
          <div className="col-md-10">
            <h3 className="text-l"> {EtplPageStrings.step2Header}</h3>
            <p className="mbm">{EtplPageStrings.step2Text}</p>
            <div className={isTablet ? "plxl" : ""}>
              <h4 className="weight-500 mtl">{EtplPageStrings.newApplicants}</h4>
              <p className="mbl">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={EtplPageStrings.applicationPacketLink}
                >
                  {EtplPageStrings.applicationPacketLinkText}
                </a>
                <span className="flex">{EtplPageStrings.applicationPacketDescription}</span>
              </p>
              <p className="mbl">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={EtplPageStrings.renewalPacketLink}
                >
                  {EtplPageStrings.renewalPacketLinkText}
                </a>
                <span className="flex">{EtplPageStrings.renewalPacketDescription}</span>
              </p>
              <p className="mbl">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={EtplPageStrings.apprenticeshipPacketLinkText}
                >
                  {EtplPageStrings.apprenticeshipPacketLinkText}
                </a>
                <span className="flex">{EtplPageStrings.apprenticeshipPacketDescription}</span>
              </p>

              <h4 className="weight-500 mtl">{EtplPageStrings.wioaWfnj}</h4>
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={EtplPageStrings.workforceInnovationLink}
                >
                  {EtplPageStrings.workforceInnovationLinkText}
                </a>
              </p>
              <p>
                <a target="_blank" rel="noopener noreferrer" href={EtplPageStrings.wioaYouthLink}>
                  {EtplPageStrings.wioaYouthLinkText}
                </a>
              </p>

              <h4 className="weight-500 mtl">{EtplPageStrings.existingProviders}</h4>
              <p className="mbl">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={EtplPageStrings.additionModificationLink}
                >
                  {EtplPageStrings.additionModificationLinkText}
                </a>
                <span className="flex">{EtplPageStrings.additionModificationDescription}</span>
              </p>
            </div>

            <h3 className="text-l">{EtplPageStrings.step3Header}</h3>
            <p className="mbm">
              {EtplPageStrings.step3Text.split("{link}")[0].trim()}
              &nbsp;
              <a
                className="link-format-blue"
                target="_blank"
                rel="noopener noreferrer"
                href={EtplPageStrings.step3Link}
              >
                {EtplPageStrings.step3LinkText}
              </a>
              &nbsp;
              {EtplPageStrings.step3Text.split("{link}")[1].trim()}
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
