import { useTranslation } from "react-i18next";
import { Training } from "../domain/Training";
import { Grouping } from "../components/Grouping";
import { Tooltip } from "react-tooltip";
import {
  Globe,
  ListBullets,
  GraduationCap,
  Timer,
  Clock,
  Info,
  Package,
} from "@phosphor-icons/react";

export const QuickFacts = ({ training }: { training: Training }) => {
  const { t } = useTranslation();

  const deliveryTypes = training.deliveryTypes?.map((type) => {
    switch (type) {
      case "deliveryType:OnlineOnly":
        return t("TrainingPage.onlineClass"); // Translation key for "Online Only"
      case "deliveryType:InPerson":
        return t("TrainingPage.inPersonClass"); // Translation key for "In-person"
      case "deliveryType:BlendedDelivery":
        return t("TrainingPage.blendedClass"); // Translation key for "Blended Delivery"
      case "deliveryType:VariableSite":
        return t("TrainingPage.variableSiteClass"); // Translation key for "Variable Site"
      default:
        return t("TrainingPage.unknownDeliveryType"); // Translation key for unknown types
    }
  });

  return (
    <Grouping
      title={t("TrainingPage.quickStatsGroupHeader")}
      subheading="Details about this learning opportunity"
    >
      <>
        {training.languages && training.languages.length > 0 && (
          <div className="fact-item">
            <Globe size={18} />
            <div className="copy">
              <p className="label">
                <strong>Languages:</strong>
              </p>
              <p>{training.languages.join(", ")}</p>
            </div>
          </div>
        )}
        {training.certifications && (
          <div className="fact-item">
            <GraduationCap size={18} />
            <div className="copy">
              <p className="label">
                <strong>{t("TrainingPage.certificationsLabel")}</strong>
              </p>
              <p>{training.certifications}</p>
            </div>
          </div>
        )}

        {deliveryTypes && (
          <div className="fact-item">
            <Package size={18} weight="bold" />
            <div className="copy">
              <p className="label">
                <strong>Delivery type:</strong>
              </p>
              <p>{deliveryTypes.join(", ")}</p>
            </div>
          </div>
        )}

        {training.prerequisites && (
          <div className="fact-item">
            <ListBullets size={18} weight="bold" />
            <div className="copy">
              <p className="label">
                <strong>{t("TrainingPage.prereqsLabel")}</strong>
              </p>
              <p>{training.prerequisites}</p>
            </div>
          </div>
        )}
        <div className="fact-item">
          <Timer size={18} weight="bold" />
          <div className="copy">
            <p className="label">
              <strong>{t("TrainingPage.completionTimeLabel")}</strong>
            </p>
            <p>
              {training.calendarLength
                ? t(`CalendarLengthLookup.${training.calendarLength}`)
                : t("Global.noDataAvailableText")}
            </p>
          </div>
        </div>

        <div className="fact-item">
          <Clock size={18} weight="bold" />
          <div className="copy">
            <p className="label">
              <strong>
                {t("TrainingPage.totalClockHoursLabel")}
                <Info
                  weight="fill"
                  className="mrxs"
                  data-tooltip-id="totalClockHours-tooltip"
                  data-tooltip-content={t("TrainingPage.totalClockHoursTooltip")}
                />
              </strong>
            </p>
            <p>
              <Tooltip id="totalClockHours-tooltip" className="custom-tooltip" />

              {training.totalClockHours
                ? t("TrainingPage.totalClockHours", {
                    hours: training.totalClockHours,
                  })
                : t("Global.noDataAvailableText")}
            </p>
          </div>
        </div>
      </>
    </Grouping>
  );
};
