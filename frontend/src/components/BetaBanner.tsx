import React, { ReactElement } from "react";
import { useMediaQuery } from "@material-ui/core";

interface Props {
  noHeader?: boolean;
}

export const BetaBanner = (props: Props): ReactElement => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const feedbackLink = "https://forms.gle/XSmLCPHBctFVSGsA6";

  const getMessage = (): ReactElement => {
    if (isTabletAndUp) {
      return (
        <>
          Welcome to the beta version of Training Explorer. Please give us feedback on your
          experience&nbsp;
          <a
            className="link-format-blue"
            target="_blank"
            rel="noopener noreferrer"
            href={feedbackLink}
          >
            here
          </a>
          .
        </>
      );
    } else {
      return (
        <>
          This site is in beta. Feedback welcome&nbsp;
          <a
            className="link-format-blue"
            target="_blank"
            rel="noopener noreferrer"
            href={feedbackLink}
          >
            here
          </a>
          .
        </>
      );
    }
  };

  const getHeaderMarginClass = (): string => {
    if (props.noHeader) {
      return "no-header-margin";
    } else {
      return "";
    }
  };

  return <aside className={`beta-banner ${getHeaderMarginClass()}`}>{getMessage()}</aside>;
};
