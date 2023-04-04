import React, { ReactElement } from "react";
import { Link } from "@reach/router";
import { useState } from "react";
import { Icon, useMediaQuery } from "@material-ui/core";
import njLogo from "../njlogo.svg";
import navCloseButton from "@newjersey/njwds/dist/img/usa-icons/close.svg";
import { useTranslation } from "react-i18next";
import { UnstyledButton } from "./UnstyledButton";

const COUNSELING_URL = "https://nj.gov/labor/career-services/";

interface HandleClickInterface {
  currentTarget: HTMLAnchorElement;
}

export const Header = (): ReactElement => {
  const isDesktop = useMediaQuery("(min-width:1025px)");
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };

  const pageCheck = (event: HandleClickInterface): void => {
    if (event.currentTarget.getAttribute("href") === window.location.pathname) {
      setIsOpen(false);
    }
  };

  const mobileNav = (): ReactElement => {
    return (
      <header className="header" role="banner">
        <div className="container height-100">
          <div className="fdr fac fjb height-100">
            <a href="/" className="link-format-black fin fac width-content">
              <img className="mrd" src={njLogo} alt={t("IconAlt.njLogo")} />
              <h1 className="text-m bold">Training Explorer</h1>
            </a>
            <UnstyledButton onClick={toggleIsOpen} className="link-format-black">
              <Icon className="mrs">{isOpen ? "close" : "menu"}</Icon>
              {t("Header.mobileMenuText")}
            </UnstyledButton>
          </div>

          {isOpen && (
            <nav className="nav nav-mobile">
              <Link to="/" className="link-format-black nav-item pvm phd bvdcg" onClick={pageCheck}>
                <span className="container flex fac fjb">
                  Home
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/search"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {t("Header.linkToSearch")}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/in-demand-occupations"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {t("Header.linkToInDemandOccupations")}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/funding"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {t("Header.linkToFunding")}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              {/* <Link
                to="/faq"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {t("Header.linkToFAQ")}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link
                to="/training-provider-resources"
                className="link-format-black nav-item pvm phd bbdcg"
                onClick={pageCheck}
              >
                <span className="container flex fac fjb">
                  {t("Header.linkToTPResources")}
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link> */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.nj.gov/labor/labormarketinformation/assets/PDFs/coei/ETPL/IGXinstructions.pdf"
                className="link-format-black nav-item pvm phd bbdcg"
              >
                <span className="container flex fac fjb">
                  Intelligrants (IGX)
                  <Icon>launch</Icon>
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={COUNSELING_URL}
                className="link-format-black nav-item pvm phd bbdcg"
              >
                <span className="container flex fac fjb">
                  {t("Header.mobileLinkToCounselors")}
                  <Icon>launch</Icon>
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </a>
            </nav>
          )}
        </div>
      </header>
    );
  };

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
            <button className="usa-nav__close">
              <img src={navCloseButton} alt="close" />
            </button>
            <ul className="usa-nav__primary usa-accordion">
              <li className="usa-nav__primary-item">
                <a className="usa-nav__link" href="/search">
                  <span>{t("Header.linkToSearch")}</span>
                </a>
              </li>
              <li className="usa-nav__primary-item">
                <a className="usa-nav__link" href="/in-demand-occupations">
                  <span>{t("Header.linkToInDemandOccupations")}</span>
                </a>
              </li>
              <li className="usa-nav__primary-item">
                <a className="usa-nav__link" href="/funding">
                  <span>{t("Header.linkToFunding")}</span>
                </a>
              </li>
              {/* <li className="usa-nav__primary-item">
                <a className="usa-nav__link" href="/faq">
                  <span>{t("Header.linkToFAQ")}</span>
                </a>
              </li>
              <li className="usa-nav__primary-item">
                <a className="usa-nav__link" href="/training-provider-resources">
                  <span>{t("Header.linkToTPResources")}</span>
                </a>
              </li> */}
              <li className="usa-nav__primary-item">
                <a
                  className="usa-nav__link"
                  href="https://www.nj.gov/labor/labormarketinformation/assets/PDFs/coei/ETPL/IGXinstructions.pdf"
                  target={"_blank"}
                  rel={"noreferrer"}
                >
                  <span>
                    Intelligrants (IGX) <Icon style={{ fontSize: 12 }}>launch</Icon>
                  </span>
                </a>
              </li>
              <li className="usa-nav__primary-item">
                <a
                  className="usa-nav__link"
                  href={COUNSELING_URL}
                  target={"_blank"}
                  rel={"noreferrer"}
                >
                  <span>
                    {t("Header.linkToCounselingText")} <Icon style={{ fontSize: 12 }}>launch</Icon>
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  };

  return isDesktop ? nav() : mobileNav();
};
