import { LinkButton } from "./LinkButton";
import React, { ReactElement } from "react";
import { ContactUsStrings } from "../localizations/ContactUsStrings";

export const ContactUsSection = (): ReactElement => {
  return (
    <div className="align-center">
      <h4 className="mtl mbs text-m weight-500">{ContactUsStrings.sectionFiveHeader}</h4>
      <p className="mtz mbd text-m weight-500">{ContactUsStrings.getInTouchText}</p>
      <LinkButton secondary external className="mbl" to={ContactUsStrings.contactUsButtonLink}>
        {ContactUsStrings.contactUsButtonText}
      </LinkButton>
    </div>
  );
};
