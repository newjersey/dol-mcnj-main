import { ReactElement } from "react";
import { Trans } from "react-i18next";
interface Props {
  noHeader?: boolean;
}

const FEEDBACK_URL = "https://forms.gle/XSmLCPHBctFVSGsA6";

export const BetaBanner = (props: Props): ReactElement => {
  const getHeaderMarginClass = (): string => {
    if (props.noHeader) {
      return "no-header-margin";
    } else {
      return "";
    }
  };

  return (
    <div className={`beta-banner ${getHeaderMarginClass()}`}>
      <a target="_blank" rel="noopener noreferrer" href={FEEDBACK_URL}>
        Share your feedback!
      </a>
    </div>
  );
};
