import React, { ReactElement } from "react";
import { useMediaQuery } from "@material-ui/core";
import { TrainingResult } from "../domain/Training";
import { formatMoney } from "accounting";
import { formatPercentEmployed } from "../presenters/formatPercentEmployed";
import { InDemandTag } from "../components/InDemandTag";
import { Button } from "../components/Button";
import { navigate } from "@reach/router";
import { useTranslation } from "react-i18next";

interface Props {
  data: TrainingResult[];
  scrollEnd: boolean;
}

export const ComparisonTable = (props: Props): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");
  const { t } = useTranslation();

  const item1 = props.data[0];
  const item2 = props.data[1];
  const item3 = props.data[2];
  const showInDemand = item1?.inDemand || item2?.inDemand || item3?.inDemand;

  const tblClasses = (): string => {
    const view = isTablet ? "comparison-table" : "comparison-table-mobile";
    const wide = props.data.length > 2 ? "wide" : "";
    const scroll = !props.scrollEnd ? "scroll-end" : "";
    const margin = !isTablet ? "mbs" : "";
    return `${view} ${wide} ${scroll} ${margin}`;
  };

  const mobileTable = (): ReactElement => {
    return (
      <table className={tblClasses()}>
        <tbody>
          <tr>
            {item1 && (
              <td
                className="weight-500 align-top align-center pas phs bhdcg"
                key={`${item1.id}-nam`}
              >
                {item1.name}
              </td>
            )}
            {item2 && (
              <td
                className="weight-500 align-top align-center pas phs bhdcg"
                key={`${item2.id}-nam`}
              >
                {item2.name}
              </td>
            )}
            {item3 && (
              <td
                className="weight-500 align-top align-center pas phs bhdcg"
                key={`${item3.id}-nam`}
              >
                {item3.name}
              </td>
            )}
          </tr>
          <tr>
            {item1 && (
              <td
                className={`align-top align-center bhdcg ${showInDemand ? "pas" : "pts pbd phs"}`}
                key={`${item1.id}-pro`}
              >
                {item1.providerName}
              </td>
            )}
            {item2 && (
              <td
                className={`align-top align-center bhdcg ${showInDemand ? "pas" : "pts pbd phs"}`}
                key={`${item2.id}-pro`}
              >
                {item2.providerName}
              </td>
            )}
            {item3 && (
              <td
                className={`align-top align-center bhdcg ${showInDemand ? "pas" : "pts pbd phs"}`}
                key={`${item3.id}-pro`}
              >
                {item3.providerName}
              </td>
            )}
          </tr>
          {showInDemand && (
            <tr>
              <td className={`align-center pas brdcg`} key={`${item1.id}-dem`}>
                {item1?.inDemand && <InDemandTag />}
              </td>
              {(item2 || item3) && (
                <td className="align-center pas" key={`${item2.id}-dem`}>
                  {item2?.inDemand && <InDemandTag />}
                </td>
              )}
              {item3 && (
                <td className={`align-center pas bldcg`} key={`${item3.id}-dem`}>
                  {item3?.inDemand && <InDemandTag />}
                </td>
              )}
            </tr>
          )}
          <tr>
            <td className="weight-500 pas bhdcg bg-light-purple">
              <span>Cost</span>
            </td>
            {item2 && (
              <td className="weight-500 pas bhdcg bg-light-purple">
                {!props.scrollEnd && (
                  <span className="weight-500">
                    {t("SearchResultsPageStrings.comparisonCostLabel")}
                  </span>
                )}
              </td>
            )}
            {item3 && <td className="weight-500 pas bhdcg bg-light-purple"></td>}
          </tr>
          <tr>
            {item1 && (
              <td className="align-center pas bhdcg" key={`${item1.id}-cos`}>
                {formatMoney(item1.totalCost)}
              </td>
            )}
            {item2 && (
              <td className="align-center pas bhdcg" key={`${item2.id}-cos`}>
                {formatMoney(item2.totalCost)}
              </td>
            )}
            {item3 && (
              <td className="align-center pas bhdcg" key={`${item3.id}-cos`}>
                {formatMoney(item3.totalCost)}
              </td>
            )}
          </tr>
          <tr>
            <td className="weight-500 pas bhdcg bg-light-purple">
              <span>{t("SearchResultsPageStrings.comparisonEmploymentRateLabelMobile")}</span>
            </td>
            {item2 && (
              <td className="weight-500 pas bhdcg bg-light-purple">
                {!props.scrollEnd && (
                  <span className="weight-500">
                    {t("SearchResultsPageStrings.comparisonEmploymentRateLabel")}
                  </span>
                )}
              </td>
            )}
            {item3 && <td className="weight-500 pas bhdcg bg-light-purple"></td>}
          </tr>
          <tr>
            <td className="align-center pas bhdcg" key={`${item1.id}-emp`}>
              {item1.percentEmployed
                ? t("SearchResultsPageStrings.percentEmployed", {
                    percent: formatPercentEmployed(item1.percentEmployed),
                  })
                : t("SearchResultsPageStrings.percentEmployedUnavailable")}
            </td>
            {item2 && (
              <td className="align-center pas bhdcg" key={`${item2.id}-emp`}>
                {item2.percentEmployed
                  ? t("SearchResultsPageStrings.percentEmployed", {
                      percent: formatPercentEmployed(item2.percentEmployed),
                    })
                  : t("SearchResultsPageStrings.percentEmployedUnavailable")}
              </td>
            )}
            {item3 && (
              <td className="align-center pas bhdcg" key={`${item3.id}-emp`}>
                {item3.percentEmployed
                  ? t("SearchResultsPageStrings.percentEmployed", {
                      percent: formatPercentEmployed(item3.percentEmployed),
                    })
                  : t("SearchResultsPageStrings.percentEmployedUnavailable")}
              </td>
            )}
          </tr>
          <tr>
            <td className="weight-500 pas bhdcg bg-light-purple">
              <span>{t("SearchResultsPageStrings.comparisonTimeToCompleteLabel")}</span>
            </td>
            {item2 && (
              <td className="weight-500 pas bhdcg bg-light-purple">
                {!props.scrollEnd && (
                  <span className="weight-500">
                    {t("SearchResultsPageStrings.comparisonTimeToCompleteLabel")}
                  </span>
                )}
              </td>
            )}
            {item3 && <td className="weight-500 pas bhdcg bg-light-purple"></td>}
          </tr>
          <tr>
            {item1 && (
              <td className="align-center ptd pbxl bhdcg" key={`${item1.id}-cal`}>
                {t(`CalendarLengthLookup.${item1.calendarLength}`)}
              </td>
            )}
            {item2 && (
              <td className="align-center ptd pbxl bhdcg" key={`${item2.id}-cal`}>
                {t(`CalendarLengthLookup.${item2.calendarLength}`)}
              </td>
            )}
            {item3 && (
              <td className="align-center ptd pbxl bhdcg" key={`${item3.id}-cal`}>
                {t(`CalendarLengthLookup.${item3.calendarLength}`)}
              </td>
            )}
          </tr>
          <tr>
            {item1 && (
              <td className="align-center ptd pbs bhdcg" key={`${item1.id}-det`}>
                <Button
                  className="btn-details"
                  variant="secondary"
                  onClick={() => navigate(`/training/${item1.id}`)}
                >
                  {t("SearchResultsPageStrings.comparisonSeeDetails")}
                </Button>
              </td>
            )}
            {item2 && (
              <td className="align-center ptd pbs bhdcg" key={`${item2.id}-det`}>
                <Button
                  className="btn-details"
                  variant="secondary"
                  onClick={() => navigate(`/training/${item2.id}`)}
                >
                  {t("SearchResultsPageStrings.comparisonSeeDetails")}
                </Button>
              </td>
            )}
            {item3 && (
              <td className="align-center ptd pbs bhdcg" key={`${item3.id}-det`}>
                <Button
                  className="btn-details"
                  variant="secondary"
                  onClick={() => navigate(`/training/${item3.id}`)}
                >
                  {t("SearchResultsPageStrings.comparisonSeeDetails")}
                </Button>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    );
  };

  const table = (): ReactElement => {
    return (
      <table className={tblClasses()}>
        <tbody>
          <tr>
            <td className="tbl-header pas" />
            {item1 && (
              <td className="weight-500 align-top align-center pvs" key={`${item1.id}-nam`}>
                {item1.name}
              </td>
            )}
            {item2 && (
              <td className="weight-500 align-top align-center pvs bldcg" key={`${item2.id}-nam`}>
                {item2.name}
              </td>
            )}
            {item3 && (
              <td className="weight-500 align-top align-center pvs bldcg" key={`${item3.id}-nam`}>
                {item3.name}
              </td>
            )}
          </tr>
          <tr>
            <td className="tbl-header" />
            {item1 && (
              <td
                className={`align-top align-center ${!showInDemand ? "pbd" : ""}`}
                key={`${item1.id}-pro`}
              >
                {item1.providerName}
              </td>
            )}
            {item2 && (
              <td
                className={`align-top align-center bldcg ${!showInDemand ? "pbd" : ""}`}
                key={`${item2.id}-pro`}
              >
                {item2.providerName}
              </td>
            )}
            {item3 && (
              <td
                className={`align-top align-center bldcg ${!showInDemand ? "pbd" : ""}`}
                key={`${item3.id}-pro`}
              >
                {item3.providerName}
              </td>
            )}
          </tr>
          {showInDemand && (
            <tr>
              <td className="tbl-header" />
              <td className={`align-center pvd brdcg`} key={`${item1.id}-dem`}>
                {item1?.inDemand && (
                  <>
                    <InDemandTag />
                  </>
                )}
              </td>
              {(item2 || item3) && (
                <td className="align-center pvd" key={`${item2.id}-dem`}>
                  {item2?.inDemand && (
                    <>
                      <InDemandTag />
                    </>
                  )}
                </td>
              )}
              {item3 && (
                <td className={`align-center pvd bldcg`} key={`${item3.id}-dem`}>
                  {item3?.inDemand && (
                    <>
                      <InDemandTag />
                    </>
                  )}
                </td>
              )}
            </tr>
          )}
          <tr>
            <td className="weight-500 tbl-header btdcg">
              <span>{t("SearchResultsPageStrings.comparisonCostLabel")}</span>
            </td>
            {item1 && (
              <td className="align-center pvd btdcg" key={`${item1.id}-cos`}>
                {formatMoney(item1.totalCost)}
              </td>
            )}
            {item2 && (
              <td className="align-center pvd btdcg bldcg" key={`${item2.id}-cos`}>
                {formatMoney(item2.totalCost)}
              </td>
            )}
            {item3 && (
              <td className="align-center pvd btdcg bldcg" key={`${item3.id}-cos`}>
                {formatMoney(item3.totalCost)}
              </td>
            )}
          </tr>
          <tr>
            <td className="weight-500 tbl-header btdcg">
              <span>{t("SearchResultsPageStrings.comparisonEmploymentRateLabel")}</span>
            </td>
            <td className="align-center pvd btdcg" key={`${item1.id}-emp`}>
              {item1.percentEmployed
                ? t("SearchResultsPageStrings.percentEmployed", {
                    percent: formatPercentEmployed(item1.percentEmployed),
                  })
                : t("SearchResultsPageStrings.percentEmployedUnavailable")}
            </td>
            {item2 && (
              <td className="align-center pvd btdcg bldcg" key={`${item2.id}-emp`}>
                {item2.percentEmployed
                  ? t("SearchResultsPageStrings.percentEmployed", {
                      percent: formatPercentEmployed(item2.percentEmployed),
                    })
                  : t("SearchResultsPageStrings.percentEmployedUnavailable")}
              </td>
            )}
            {item3 && (
              <td className="align-center pvd btdcg bldcg" key={`${item3.id}-emp`}>
                {item3.percentEmployed
                  ? t("SearchResultsPageStrings.percentEmployed", {
                      percent: formatPercentEmployed(item3.percentEmployed),
                    })
                  : t("SearchResultsPageStrings.percentEmployedUnavailable")}
              </td>
            )}
          </tr>
          <tr>
            <td className="weight-500 tbl-header btdcg">
              <span>{t("SearchResultsPageStrings.comparisonTimeToCompleteLabel")}</span>
            </td>
            {item1 && (
              <td className="align-center ptd pbl btdcg" key={`${item1.id}-cal`}>
                {t(`CalendarLengthLookup.${item1.calendarLength}`)}
              </td>
            )}
            {item2 && (
              <td className="align-center ptd pbl btdcg bldcg" key={`${item2.id}-cal`}>
                {t(`CalendarLengthLookup.${item2.calendarLength}`)}
              </td>
            )}
            {item3 && (
              <td className="align-center ptd pbl btdcg bldcg" key={`${item3.id}-cal`}>
                {t(`CalendarLengthLookup.${item3.calendarLength}`)}
              </td>
            )}
          </tr>
          <tr>
            <td className="tbl-header"></td>
            {item1 && (
              <td className="align-center align-bottom ptd pbz bldcg" key={`${item1.id}-det`}>
                <Button
                  className="btn-details"
                  variant="secondary"
                  onClick={() => navigate(`/training/${item1.id}`)}
                >
                  {t("SearchResultsPageStrings.comparisonSeeDetails")}
                </Button>
              </td>
            )}
            {item2 && (
              <td className="align-center align-bottom ptd pbz bldcg" key={`${item2.id}-det`}>
                <Button
                  className="btn-details"
                  variant="secondary"
                  onClick={() => navigate(`/training/${item2.id}`)}
                >
                  {t("SearchResultsPageStrings.comparisonSeeDetails")}
                </Button>
              </td>
            )}
            {item3 && (
              <td className="align-center align-bottom ptd pbz bldcg" key={`${item3.id}-det`}>
                <Button
                  className="btn-details"
                  variant="secondary"
                  onClick={() => navigate(`/training/${item3.id}`)}
                >
                  {t("SearchResultsPageStrings.comparisonSeeDetails")}
                </Button>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    );
  };

  return isTablet ? table() : mobileTable();
};
