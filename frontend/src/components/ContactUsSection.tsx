import React, { ReactElement } from "react";
import { ContactUsStrings } from "../localizations/ContactUsStrings";
import { navigate } from "@reach/router";
import { Button } from "./Button";

export const ContactUsSection = (): ReactElement => {
  return (
    <div className="align-center">
      <div className="mbs text-m weight-500">{ContactUsStrings.getInTouchText}</div>
      <Button
        variant="secondary"
        className="mbl margin-right-0"
        onClick={() => navigate(ContactUsStrings.contactUsButtonLink)}
      >
        {ContactUsStrings.contactUsButtonText}
      </Button>
    </div>
  );
};
