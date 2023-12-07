import React, { ReactElement, useState } from "react";
import { InDemandOccupation } from "../domain/Occupation";
import { Icon } from "@material-ui/core";
import { Link } from "@reach/router";

import architectureAndEngineeringOccupations from "./industry-icons/Architecture and Engineering Occupations.svg";
import artsDesignEntertainmentSportsAndMediaOccupations from "./industry-icons/Arts Design Entertainment Sports and Media Occupations.svg";
import buildingAndGroundsCleaningAndMaintenanceOccupations from "./industry-icons/Building and Grounds Cleaning and Maintenance Occupations.svg";
import businessAndFinancialOperationsOccupations from "./industry-icons/Business and Financial Operations Occupations.svg";
import communityAndSocialServiceOccupations from "./industry-icons/Community and Social Service Occupations.svg";
import computerAndMathematicalOccupations from "./industry-icons/Computer and Mathematical Occupations.svg";
import constructionAndExtractionOccupations from "./industry-icons/Construction and Extraction Occupations.svg";
import educationalInstructionAndLibraryOccupations from "./industry-icons/Educational Instruction and Library Occupations.svg";
import farmingFishingAndForestryOccupations from "./industry-icons/Farming Fishing and Forestry Occupations.svg";
import foodPreparationAndServingRelatedOccupations from "./industry-icons/Food Preparation and Serving Related Occupations.svg";
import healthcarePractitionersAndTechnicalOccupations from "./industry-icons/Healthcare Practitioners and Technical Occupations.svg";
import healthcareSupportOccupations from "./industry-icons/Healthcare Support Occupations.svg";
import installationMaintenanceAndRepairOccupations from "./industry-icons/Installation Maintenance and Repair Occupations.svg";
import legalOccupations from "./industry-icons/Legal Occupations.svg";
import lifePhysicalAndSocialScienceOccupations from "./industry-icons/Life Physical and Social Science Occupations.svg";
import managementOccupations from "./industry-icons/Management Occupations.svg";
import militarySpecificOccupations from "./industry-icons/Military Specific Occupations.svg";
import officeAndAdministrativeSupportOccupations from "./industry-icons/Office and Administrative Support Occupations.svg";
import personalCareAndServiceOccupations from "./industry-icons/Personal Care and Service Occupations.svg";
import productionOccupations from "./industry-icons/Production Occupations.svg";
import protectiveServiceOccupations from "./industry-icons/Protective Service Occupations.svg";
import salesAndRelatedOccupations from "./industry-icons/Sales and Related Occupations.svg";
import transportationAndMaterialMovingOccupations from "./industry-icons/Transportation and Material Moving Occupations.svg";
import { useTranslation } from "react-i18next";

interface Props {
  majorGroupName: string;
  occupations: InDemandOccupation[];
}

export const MajorGroup = (props: Props): ReactElement => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };

  const getArrowIcon = (): string => {
    return isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down";
  };

  const iconAlt = iconAltLookup[props.majorGroupName] || "IconAlt.occupationGroup.general";

  return (
    <div data-testid="majorGroup" className="major-group mbs weight-500 blue">
      <button
        type="button"
        onClick={toggleIsOpen}
        onMouseDown={(e): void => e.preventDefault()}
        className="pas color-blue width-100"
      >
        <div className="fdr fac weight-500">
          <img
            className="mrs"
            alt={t(iconAlt)}
            src={industryIconLookup[props.majorGroupName]}
          />

          <span className="blue">{props.majorGroupName}</span>

          <span className="mla">
            <Icon>{getArrowIcon()}</Icon>
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="mts mlxl pbd">
          {props.occupations.map((it) => (
            <div key={it.soc} className="pbs">
              <Link className="link-format-blue" to={`/occupation/${it.soc}`}>
                {it.title}
              </Link>
              {it.counties && it.counties.length > 0 && (
                <span className="black">
                  {" "}
                  (In-demand only in {it.counties.join(", ")}{" "}
                  {it.counties.length > 1 ? "Counties" : "County"})
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const industryIconLookup: Record<string, string> = {
  "Architecture and Engineering": architectureAndEngineeringOccupations,
  "Arts, Design, Entertainment, Sports, and Media":
    artsDesignEntertainmentSportsAndMediaOccupations,
  "Building and Grounds Cleaning and Maintenance":
    buildingAndGroundsCleaningAndMaintenanceOccupations,
  "Business and Financial Operations": businessAndFinancialOperationsOccupations,
  "Community and Social Service": communityAndSocialServiceOccupations,
  "Computer and Mathematical": computerAndMathematicalOccupations,
  "Construction and Extraction": constructionAndExtractionOccupations,
  "Educational Instruction and Library": educationalInstructionAndLibraryOccupations,
  "Farming, Fishing, and Forestry": farmingFishingAndForestryOccupations,
  "Food Preparation and Serving Related": foodPreparationAndServingRelatedOccupations,
  "Healthcare Practitioners and Technical": healthcarePractitionersAndTechnicalOccupations,
  "Healthcare Support": healthcareSupportOccupations,
  "Installation, Maintenance, and Repair": installationMaintenanceAndRepairOccupations,
  Legal: legalOccupations,
  "Life, Physical, and Social Science": lifePhysicalAndSocialScienceOccupations,
  Management: managementOccupations,
  "Military Specific": militarySpecificOccupations,
  "Office and Administrative Support": officeAndAdministrativeSupportOccupations,
  "Personal Care and Service": personalCareAndServiceOccupations,
  Production: productionOccupations,
  "Protective Service": protectiveServiceOccupations,
  "Sales and Related": salesAndRelatedOccupations,
  "Transportation and Material Moving": transportationAndMaterialMovingOccupations,
};

const iconAltLookup: Record<string, string> = {
  "Architecture and Engineering": "IconAlt.occupationGroup.architectureAndEngineeringOccupations",
  "Arts, Design, Entertainment, Sports, and Media": "IconAlt.occupationGroup.artsDesignEntertainmentSportsAndMediaOccupations",
  "Building and Grounds Cleaning and Maintenance": "IconAlt.occupationGroup.buildingAndGroundsCleaningAndMaintenanceOccupations",
  "Business and Financial Operations": "IconAlt.occupationGroup.businessAndFinancialOperationsOccupations",
  "Community and Social Service": "IconAlt.occupationGroup.communityAndSocialServiceOccupations",
  "Computer and Mathematical": "IconAlt.occupationGroup.computerAndMathematicalOccupations",
  "Construction and Extraction": "IconAlt.occupationGroup.constructionAndExtractionOccupations",
  "Educational Instruction and Library": "IconAlt.occupationGroup.educationalInstructionAndLibraryOccupations",
  "Farming, Fishing, and Forestry": "IconAlt.occupationGroup.farmingFishingAndForestryOccupations",
  "Food Preparation and Serving Related": "IconAlt.occupationGroup.foodPreparationAndServingRelatedOccupations",
  "Healthcare Practitioners and Technical": "IconAlt.occupationGroup.healthcarePractitionersAndTechnicalOccupations",
  "Healthcare Support": "IconAlt.occupationGroup.healthcareSupportOccupations",
  "Installation, Maintenance, and Repair": "IconAlt.occupationGroup.installationMaintenanceAndRepairOccupations",
  Legal: "IconAlt.occupationGroup.legalOccupations",
  "Life, Physical, and Social Science": "IconAlt.occupationGroup.lifePhysicalAndSocialScienceOccupations",
  Management: "IconAlt.occupationGroup.managementOccupations",
  "Military Specific": "IconAlt.occupationGroup.militarySpecificOccupations",
  "Office and Administrative Support": "IconAlt.occupationGroup.officeAndAdministrativeSupportOccupations",
  "Personal Care and Service": "IconAlt.occupationGroup.personalCareAndServiceOccupations",
  Production: "IconAlt.occupationGroup.productionOccupations",
  "Protective Service": "IconAlt.occupationGroup.protectiveServiceOccupations",
  "Sales and Related": "IconAlt.occupationGroup.salesAndRelatedOccupations",
  "Transportation and Material Moving": "IconAlt.occupationGroup.transportationAndMaterialMovingOccupations",
}
