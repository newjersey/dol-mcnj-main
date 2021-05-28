import React, { ReactElement } from "react";

interface Props {
  children: ReactElement | string;
  className?: string;
  hideBorderMobile?: boolean;
}

export const LandingCard = (props: Props): ReactElement => {
  const classes = (): string => {
    const base = "landing-card pad";
    const mobileBorder = props.hideBorderMobile ? " hide-border-mobile" : "";
    const className = props.className ? " " + props.className : "";

    return base + mobileBorder + className;
  };

  return <div className={classes()}>{props.children}</div>;
};
