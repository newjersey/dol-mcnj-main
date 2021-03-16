import React, { ReactElement } from "react";
import { Icon, useMediaQuery } from "@material-ui/core";
import { Link } from "@reach/router";

export const Footer = (): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");

  return (
    <footer className="footer bg-light-purple pvd width-100">
      <div className="container">
        <div className={isTablet ? "grid-container" : "align-center"}>
          <div className={isTablet ? "" : "flex fdc mbd"}>
            <Link
              className={`no-link-format text-s ${isTablet ? "prd" : "mbxs"}`}
              to="/privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link className="no-link-format text-s" to="/terms-of-service">
              Terms of Service
            </Link>
          </div>

          <p className="fin fac maz text-s made-by-ooi">
            Made with&nbsp;
            <Icon className="red" fontSize="inherit">
              favorite
            </Icon>
            &nbsp;by the Office of Innovation
          </p>
        </div>
      </div>
    </footer>
  );
};
