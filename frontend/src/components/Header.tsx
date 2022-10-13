import React, { ReactElement } from "react";
import { Link } from "@reach/router";
import { useState } from "react";
import { Icon, useMediaQuery } from "@material-ui/core";
import { UnstyledButton } from "../components/UnstyledButton";
import njLogo from "../njlogo.svg";
import { useTranslation } from "react-i18next";

const COUNSELING_URL = "https://nj.gov/labor/career-services/";

interface HandleClickInterface {
  currentTarget: HTMLAnchorElement;
}

export const Header = (): ReactElement => {
  const isDesktop = useMediaQuery("(min-width:992px)");
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
      <header className="header" role="banner">
        <div className="container height-100">
          <nav className="nav">
            <div className="height-100 display-flex flex-align-center">
              <a href="/" className="link-format-black fin fac width-content">
                <img className="mrd" src={njLogo} alt={t("IconAlt.njLogo")} />
                <h1 className="text-m bold">{t("Header.title")}</h1>
              </a>
            </div>

            <Link to="/search" className="link-format-black">
              {t("Header.linkToSearch")}
            </Link>
            <Link to="/in-demand-occupations" className="link-format-black">
              {t("Header.linkToInDemandOccupations")}
            </Link>
            <Link to="/funding" className="link-format-black">
              {t("Header.linkToFunding")}
            </Link>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={COUNSELING_URL}
              className="link-format-black fin fac"
            >
              {t("Header.linkToCounselingText")}&nbsp;
              <Icon>launch</Icon>
            </a>
          </nav>
        </div>
      </header>
    );
  };

  return isDesktop ? nav() : mobileNav();
};
