import { useTranslation } from "react-i18next";
import { Training } from "../domain/Training";
import { Grouping } from "../components/Grouping";
import { Baby, Briefcase, Moon, Wheelchair } from "@phosphor-icons/react";

export const ProviderServices = ({ training }: { training: Training }) => {
  const { t } = useTranslation();
  return (
    <Grouping
      title={t("TrainingPage.providerServicesGroupHeader")}
      subheading="Support services provided for the Learning Opportunity"
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
        <p className="disclaimer">{t("TrainingPage.providerServicesDisclaimerLabel")}</p>
      </>
    </Grouping>
  );
};
