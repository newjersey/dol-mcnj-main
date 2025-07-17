import { useTranslation } from "react-i18next";

const ContactInfo = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-info-container">
      <div className="contact-container contact-info">
        <h2>{t("ContactPage.contactInfoHeading")}</h2>
        <div className="address-line">
          <strong>{t("ContactPage.contactInfoLocation")}</strong>
        </div>
        <div className="address-line">{t("ContactPage.contactInfoAddress")}</div>
        <div className="address-line">{t("ContactPage.contactInfoAddressLine2")}</div>
      </div>
    </div>
  );
};

export default ContactInfo;
