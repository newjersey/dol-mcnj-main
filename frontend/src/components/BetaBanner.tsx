import React, { ReactElement } from "react";

interface Props {
  noHeader?: boolean;
}

export const BetaBanner = (props: Props): ReactElement => {
  const feedbackLink = "https://forms.gle/XSmLCPHBctFVSGsA6";

  const getHeaderMarginClass = (): string => {
    if (props.noHeader) {
      return "no-header-margin";
    } else {
      return "";
    }
  };

  return (
    <aside className={`beta-banner ${getHeaderMarginClass()}`}>
      This site is in beta. Feedback welcome&nbsp;
      <a className="link-format-blue" target="_blank" rel="noopener noreferrer" href={feedbackLink}>
        here
      </a>
      .
    </aside>
  );
};
