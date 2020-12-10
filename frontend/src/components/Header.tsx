import React, { ReactElement } from "react";
import { Link } from "@reach/router";
import { useState } from "react";
import { Icon, useMediaQuery, Button } from "@material-ui/core";
import njLogo from "../njlogo.svg";

export const Header = (): ReactElement => {
  const isDesktop = useMediaQuery("(min-width:992px)");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };

  const mobileNav = (): ReactElement => {
    return (
      <header className={`header ${isOpen && "header--is-open"}`} role="banner">
        <div className="container header-container height-100">
          <Button onClick={toggleIsOpen} className="menu-btn no-link-format">
            <Icon className="mrs">{isOpen ? "close" : "menu"}</Icon>
            Menu
          </Button>
          <a href="/" className="logo no-link-format fin fac">
            <img className="nj-logo-header mrd" src={njLogo} alt="New Jersey innovation logo" />
            <h1 className="text-m bold">Training Explorer</h1>
          </a>
          {isOpen && (
            <nav className="nav nav-mobile">
              <Link to="/search" className="no-link-format nav-item pvm phd bvdcg">
                <span className="container flex fac fjb">
                  Find Training
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link to="/in-demand-careers" className="no-link-format nav-item pvm phd bbdcg">
                <span className="container flex fac fjb">
                  In-Demand Occupations
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <Link to="/funding" className="no-link-format nav-item pvm phd bbdcg">
                <span className="container flex fac fjb">
                  Financial Support
                  <Icon className="mla">chevron_right</Icon>
                </span>
              </Link>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
                className="no-link-format nav-item pvm phd bbdcg"
              >
                <span className="container flex fac fjb">
                  Counseling
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
      <>
        <header className="header fdr fac" role="banner">
          <div className="container header-container">
            <a href="/" className="logo no-link-format fin fac">
              <img className="nj-logo-header mrd" src={njLogo} alt="New Jersey innovation logo" />
              <h1 className="text-m bold">Training Explorer</h1>
            </a>
            <nav className="nav fac">
              <Link to="/search" className="no-link-format">
                Find Training
              </Link>
              <Link to="/in-demand-careers" className="no-link-format">
                In-Demand Occupations
              </Link>
              <Link to="/funding" className="no-link-format funding">
                Financial Support
              </Link>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
                className="no-link-format counseling"
              >
                Counseling
              </a>
            </nav>
          </div>
        </header>
      </>
    );
  };

  return isDesktop ? nav() : mobileNav();
};
