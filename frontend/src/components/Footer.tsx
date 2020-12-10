import React, { ReactElement } from "react";
import { Link } from "@reach/router";

export const Footer = (): ReactElement => {
  return (
    <footer className="footer bg-light-purple pvd width-100">
      <div className="container">
        <Link className="no-link-format prd" to="/about">
          About
        </Link>
        <Link className="no-link-format phd" to="/privacy">
          Privacy Policy
        </Link>
        <Link className="no-link-format phd" to="/tos">
          Terms of Service
        </Link>
      </div>
    </footer>
  );
};
