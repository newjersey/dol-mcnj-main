import React, { ReactElement } from "react";
import { Link } from "@reach/router";

interface Props {
  className?: string;
  secondary?: boolean;
  external?: boolean;
  children: string | ReactElement;
  to: string;
}

export const LinkButton = (props: Props): ReactElement => {
  const { className, children, secondary, external, to } = props;

  const classes =
    "link-button weight-500" + (secondary ? " secondary" : "") + (className ? " " + className : "");

  if (external) {
    return (
      <a className={classes} target="_blank" rel="noopener noreferrer" href={to}>
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} to={to}>
      {children}
    </Link>
  );
};
