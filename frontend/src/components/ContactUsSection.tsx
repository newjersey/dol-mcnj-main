import React, { ReactElement } from "react";
import { navigate } from "@reach/router";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

const CONTACT_URL = "mailto:TrainingEvaluationUnit@dol.nj.gov";

export const ContactUsSection = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <div className="align-center">
      <div className="mbs text-m weight-500">{t("ContactUs.getInTouchText")}</div>
      <Button
        variant="secondary"
        className="mbl margin-right-0"
        onClick={() => navigate(CONTACT_URL)}
      >
        {t("ContactUs.contactUsButtonText")}
      </Button>
    </div>
  );
};
