import React, { ReactElement } from "react";
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
    <aside className={`beta-banner ${getHeaderMarginClass()}`}>
      <Trans i18nKey="HeaderStrings.betaBannerText">
        This site is in beta. Feedback welcome
        <a
          className="link-format-blue"
          target="_blank"
          rel="noopener noreferrer"
          href={FEEDBACK_URL}
        >
          here
        </a>
        .
      </Trans>
    </aside>
  );
};
