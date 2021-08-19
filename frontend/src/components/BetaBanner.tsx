import React, { ReactElement } from "react";
import { HeaderStrings } from "../localizations/HeaderStrings";

interface Props {
  noHeader?: boolean;
}

export const BetaBanner = (props: Props): ReactElement => {
  const feedbackLink = HeaderStrings.betaBannerFeedbackLink;

  const getHeaderMarginClass = (): string => {
    if (props.noHeader) {
      return "no-header-margin";
    } else {
      return "";
    }
  };

  return (
    <aside className={`beta-banner ${getHeaderMarginClass()}`}>
      {HeaderStrings.betaBannerText}&nbsp;
      <a className="link-format-blue" target="_blank" rel="noopener noreferrer" href={feedbackLink}>
        {HeaderStrings.betaBannerLinkText}
      </a>
      .
    </aside>
  );
};
