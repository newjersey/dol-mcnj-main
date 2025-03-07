"use client";
import { NavMenuProps } from "@utils/types";
import { NjHeader } from "./NjHeader";
import { NavMenu } from "./NavMenu";
import NJLogo from "@components/svgs/NJLogo";
import { Button } from "@components/modules/Button";
import { useState } from "react";
import { LinkObject } from "@components/modules/LinkObject";
import Link from "next/link";
import { SignUpFormModal } from "@components/blocks/SignUpFormModal";
import { SupportedLanguages } from "@utils/types/types";

interface HeaderProps {
  mainNav?: NavMenuProps;
  globalNav: NavMenuProps;
  lang?: SupportedLanguages;
}

const Header = ({ mainNav, globalNav, lang = "en" }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };
  return (
    <header className="header">
      <NjHeader menu={globalNav} lang={lang} />
      <nav
        id="usaNav"
        aria-label="Career Central Navigation"
        className="usa-nav-container plus"
      >
        <div className="basic-logo" id="basic-logo">
          <Link href="/" aria-label="My Career NJ">
            <NJLogo className="mrd" />
            <h1 className="bold">My Career NJ</h1>
          </Link>
          <Button
            unstyled
            type="button"
            onClick={toggleIsOpen}
            className="link-format-black toggle-button"
          >
            <div className={`toggle ${isOpen ? "open" : "closed"}`}>
              <span />
              <span />
              <span />
            </div>
            <span className="sr-only">Nav Toggle</span>
          </Button>
        </div>
      </nav>
      <NavMenu
        id="headerNavDesktop"
        menu={mainNav}
        lang={lang}
        label="Primary navigation"
        className={`main-nav${isOpen ? " open" : ""}`}
        innerClassName="usa-nav-container flex"
        icons
        extraItems={
          <div className="contact-links">
            <LinkObject className="nav-item contact-us" url="/contact">
              Contact Us
            </LinkObject>
            <SignUpFormModal />
          </div>
        }
      />
    </header>
  );
};

export { Header };
