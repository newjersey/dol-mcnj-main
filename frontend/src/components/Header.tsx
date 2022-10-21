import React, { ReactElement } from "react";
import { Icon } from "@material-ui/core";
import njLogo from "../njlogo.svg";
import navCloseButton from "@newjersey/njwds/dist/img/usa-icons/close.svg"
import { useTranslation } from "react-i18next";
import "@newjersey/njwds/dist/css/styles.css";
import "@newjersey/njwds/dist/js/uswds.min.js";
const COUNSELING_URL = "https://nj.gov/labor/career-services/";

export const Header = (): ReactElement => {
  const { t } = useTranslation();

  const nav = (): ReactElement => {
    return (
      <header className="header usa-header usa-header--basic" role="banner">
        <div className="usa-nav-container height-100">
          <nav className="usa-navbar nav-training-explorer">
            <div className="usa-logo" id="basic-logo">
              <a href="/" className="flex-align-center link-format-black fin fac width-content">
                <img className="mrd" src={njLogo} alt={t("IconAlt.njLogo")} />
                <h1 className="text-m bold">{t("Header.title")}</h1>
              </a>
            </div>
            <button className="usa-menu-btn">Menu</button>
          </nav>
          <nav aria-label="Primary navigation" className="usa-nav">
            <button className="usa-nav__close"><img src={navCloseButton} alt="close"/></button>
            <ul className="usa-nav__primary usa-accordion">
              <li className="usa-nav__primary-item">
              <a className="usa-nav__link" href="/search"><span>{t("Header.linkToSearch")}</span></a>
            </li>
              <li className="usa-nav__primary-item">
                <a className="usa-nav__link" href="/in-demand-occupations"><span>{t("Header.linkToInDemandOccupations")}</span></a>
              </li>
              <li className="usa-nav__primary-item">
                <a className="usa-nav__link" href="/funding"><span>{t("Header.linkToFunding")}</span></a>
              </li>
              <li className="usa-nav__primary-item">
                <a className="usa-nav__link" href={COUNSELING_URL} target={"_blank"} rel={"noreferrer"}><span>{t("Header.linkToCounselingText")} <Icon style={{ fontSize: 12 }}>launch</Icon></span></a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  };

  return nav();
};
