import React, { ReactElement, useState } from "react";
import { InDemandOccupation } from "../domain/Occupation";
import { Icon } from "@material-ui/core";
import { Link } from "@reach/router";

import ArchitectureandEngineeringOccupations from "./industry-icons/Architecture and Engineering Occupations.svg";
import ArtsDesignEntertainmentSportsandMediaOccupations from "./industry-icons/Arts Design Entertainment Sports and Media Occupations.svg";
import BuildingandGroundsCleaningandMaintenanceOccupations from "./industry-icons/Building and Grounds Cleaning and Maintenance Occupations.svg";
import BusinessandFinancialOperationsOccupations from "./industry-icons/Business and Financial Operations Occupations.svg";
import CommunityandSocialServiceOccupations from "./industry-icons/Community and Social Service Occupations.svg";
import ComputerandMathematicalOccupations from "./industry-icons/Computer and Mathematical Occupations.svg";
import ConstructionandExtractionOccupations from "./industry-icons/Construction and Extraction Occupations.svg";
import EducationalInstructionandLibraryOccupations from "./industry-icons/Educational Instruction and Library Occupations.svg";
import FarmingFishingandForestryOccupations from "./industry-icons/Farming Fishing and Forestry Occupations.svg";
import FoodPreparationandServingRelatedOccupations from "./industry-icons/Food Preparation and Serving Related Occupations.svg";
import HealthcarePractitionersandTechnicalOccupations from "./industry-icons/Healthcare Practitioners and Technical Occupations.svg";
import HealthcareSupportOccupations from "./industry-icons/Healthcare Support Occupations.svg";
import InstallationMaintenanceandRepairOccupations from "./industry-icons/Installation Maintenance and Repair Occupations.svg";
import LegalOccupations from "./industry-icons/Legal Occupations.svg";
import LifePhysicalandSocialScienceOccupations from "./industry-icons/Life Physical and Social Science Occupations.svg";
import ManagementOccupations from "./industry-icons/Management Occupations.svg";
import MilitarySpecificOccupations from "./industry-icons/Military Specific Occupations.svg";
import OfficeandAdministrativeSupportOccupations from "./industry-icons/Office and Administrative Support Occupations.svg";
import PersonalCareandServiceOccupations from "./industry-icons/Personal Care and Service Occupations.svg";
import ProductionOccupations from "./industry-icons/Production Occupations.svg";
import ProtectiveServiceOccupations from "./industry-icons/Protective Service Occupations.svg";
import SalesandRelatedOccupations from "./industry-icons/Sales and Related Occupations.svg";
import TransportationandMaterialMovingOccupations from "./industry-icons/Transportation and Material Moving Occupations.svg";
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
            alt={t("IconAlt.occupationGroup")}
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
                {it.counties && it.counties.length > 0 && <span> ({it.counties.join(", ")})</span>}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const industryIconLookup: Record<string, string> = {
  "Architecture and Engineering": ArchitectureandEngineeringOccupations,
  "Arts, Design, Entertainment, Sports, and Media":
    ArtsDesignEntertainmentSportsandMediaOccupations,
  "Building and Grounds Cleaning and Maintenance":
    BuildingandGroundsCleaningandMaintenanceOccupations,
  "Business and Financial Operations": BusinessandFinancialOperationsOccupations,
  "Community and Social Service": CommunityandSocialServiceOccupations,
  "Computer and Mathematical": ComputerandMathematicalOccupations,
  "Construction and Extraction": ConstructionandExtractionOccupations,
  "Educational Instruction and Library": EducationalInstructionandLibraryOccupations,
  "Farming, Fishing, and Forestry": FarmingFishingandForestryOccupations,
  "Food Preparation and Serving Related": FoodPreparationandServingRelatedOccupations,
  "Healthcare Practitioners and Technical": HealthcarePractitionersandTechnicalOccupations,
  "Healthcare Support": HealthcareSupportOccupations,
  "Installation, Maintenance, and Repair": InstallationMaintenanceandRepairOccupations,
  Legal: LegalOccupations,
  "Life, Physical, and Social Science": LifePhysicalandSocialScienceOccupations,
  Management: ManagementOccupations,
  "Military Specific": MilitarySpecificOccupations,
  "Office and Administrative Support": OfficeandAdministrativeSupportOccupations,
  "Personal Care and Service": PersonalCareandServiceOccupations,
  Production: ProductionOccupations,
  "Protective Service": ProtectiveServiceOccupations,
  "Sales and Related": SalesandRelatedOccupations,
  "Transportation and Material Moving": TransportationandMaterialMovingOccupations,
};
