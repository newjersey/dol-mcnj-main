import { ReactElement, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { STAT_MISSING_DATA_INDICATOR } from "../constants";
import { ContextualInfoContext } from "../contextual-info/ContextualInfoContext";

interface Props {
  title: string;
  tooltipText?: string;
  disclaimer?: string;
  data: string;
  dataSource?: string;
  backgroundColorClass?: string;
}

export const StatBlock = (props: Props): ReactElement => {
  const { t } = useTranslation();

  const { setContextualInfo } = useContext(ContextualInfoContext);

  const dataMissingOrSource =
    props.data === STAT_MISSING_DATA_INDICATOR
      ? t("StatBlock.missingDataExplanation")
      : `${t("StatBlock.dataSourceLabel")} ${props.dataSource ?? t("StatBlock.defaultDataSource")}`;

  const onClickInfo = useCallback(() => {
    setContextualInfo((prevValue) => ({
      ...prevValue,
      isOpen: true,
      title: props.title,
      body: `${props.tooltipText}. ${dataMissingOrSource ?? ""}`,
      disclaimer: `${props.disclaimer}`,
    }));
  }, [dataMissingOrSource, props.title, props.tooltipText, props.disclaimer, setContextualInfo]);

  return (
    <div className="stat-block">
      {props.tooltipText != null ? (
        <button
          onClick={onClickInfo}
          className="contextual-link-button"
          data-testid="accordion-button"
        >
          <span className="contextual-link-text">{props.title}</span>
        </button>
      ) : (
        <div>{props.title}</div>
      )}

      {props.data && <div className="stat-block-number">{props.data}</div>}
    </div>
  );
};
