import React, { ReactElement } from "react";
import { Link } from "@reach/router";
import { FooterStrings } from "../localizations/FooterStrings";

export const Footer = (): ReactElement => {
  return (
    <footer className="bg-footer-grey pvm width-100 fdc fac">
      <div>
        <Link className="link-format-blue text-s" to="/privacy-policy">
          Privacy Policy
        </Link>
        {" | "}
        <Link className="link-format-blue text-s" to="/terms-of-service">
          Terms of Service
        </Link>
      </div>

      <p className="text-s">{FooterStrings.madeWithMessage}</p>
    </footer>
  );
};
