import { useTranslation } from "react-i18next";
import { InlineIcon } from "../components/InlineIcon";
import { Training } from "../domain/Training";
import { formatCip } from "../utils/formatCip";
import { Grouping } from "../components/Grouping";
import { Tooltip } from "react-tooltip";

export const QuickFacts = ({
  training,
  setDrawerOpen,
}: {
  setDrawerOpen: (open: boolean) => void;
  training: Training;
}) => {
  const { t } = useTranslation();

  return (
    <Grouping
      title={t("TrainingPage.quickStatsGroupHeader")}
      subheading="Details about this learning opportunity"
    >
      <>
        {training.languages && training.languages.length > 0 && (
          <div className="fact-item">
            <InlineIcon className="mrxs">language</InlineIcon>
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
            <InlineIcon className="mrxs">school</InlineIcon>
            <div className="copy">
              <p className="label">
                <strong>{t("TrainingPage.certificationsLabel")}</strong>
              </p>
              <p>{training.certifications}</p>
            </div>
          </div>
        )}
        {training.prerequisites && (
          <div className="fact-item">
            <InlineIcon className="mrxs">list_alt</InlineIcon>
            <div className="copy">
              <p className="label">
                <strong>{t("TrainingPage.prereqsLabel")}</strong>
              </p>
              <p>{training.prerequisites}</p>
            </div>
          </div>
        )}
        <div className="fact-item">
          <InlineIcon className="mrxs">av_timer</InlineIcon>
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
          <InlineIcon className="mrxs">schedule</InlineIcon>
          <div className="copy">
            <p className="label">
              <strong>
                {t("TrainingPage.totalClockHoursLabel")}
                <InlineIcon
                  className="mrxs"
                  data-tooltip-id="totalClockHours-tooltip"
                  data-tooltip-content={t("TrainingPage.totalClockHoursTooltip")}
                >
                  info
                </InlineIcon>
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
        <div className="fact-item">
          <InlineIcon>book</InlineIcon>
          <div className="copy">
            <p className="label">
              <strong>
                <button
                  type="button"
                  className="toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    setDrawerOpen(true);
                  }}
                >
                  {t("TrainingPage.cipCodeLabel")}&nbsp;
                </button>
              </strong>
              <a
                href={`https://nces.ed.gov/ipeds/cipcode/cipdetail.aspx?y=56&cip=${formatCip(training.cipDefinition.cipcode)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatCip(training.cipDefinition.cipcode)}
              </a>
            </p>
            <p>
              {training.cipDefinition ? (
                <>{training.cipDefinition.ciptitle}</>
              ) : (
                <span>{t("Global.noDataAvailableText")}</span>
              )}
            </p>
          </div>
        </div>
      </>
    </Grouping>
  );
};
