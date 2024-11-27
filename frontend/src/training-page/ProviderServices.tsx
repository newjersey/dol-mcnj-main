import { useTranslation } from "react-i18next";
import { Training } from "../domain/Training";
import { Grouping } from "../components/Grouping";
import { Baby, Briefcase, Globe, Moon, Wheelchair } from "@phosphor-icons/react";

export const ProviderServices = ({ training }: { training: Training }) => {
  const { t } = useTranslation();
  return (
    <Grouping
      title={t("TrainingPage.providerServicesGroupHeader")}
      subheading="Please confirm with provider on any support service needs"
    >
      <>
        {training.hasEveningCourses && (
          <div className="fact-item">
            <span className="label">
              <Moon size={18} />
            </span>
            {t("TrainingPage.eveningCoursesServiceLabel")}
          </div>
        )}
        {training.languages.some((lang) => lang !== "en-US") && (
          <div className="fact-item">
            <span className="label">
              <Globe size={18} />
            </span>
            {t("TrainingPage.otherLanguagesServiceLabel")}
          </div>
        )}
        {training.isWheelchairAccessible && (
          <div className="fact-item">
            <span className="label">
              <Wheelchair size={18} weight="bold" />
            </span>
            {t("TrainingPage.wheelchairAccessibleServiceLabel")}
          </div>
        )}
        {training.hasChildcareAssistance && (
          <div className="fact-item">
            <span className="label">
              <Baby size={18} weight="bold" />
            </span>
            {t("TrainingPage.childcareAssistanceServiceLabel")}
          </div>
        )}
        {training.hasJobPlacementAssistance && (
          <div className="fact-item">
            <span className="label">
              <Briefcase size={18} weight="bold" />
            </span>
            {t("TrainingPage.jobAssistanceServiceLabel")}
          </div>
        )}
        <p>{t("TrainingPage.providerServicesDisclaimerLabel")}</p>
      </>
    </Grouping>
  );
};
