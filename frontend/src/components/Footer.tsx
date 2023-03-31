import { useTranslation } from "react-i18next";
import { NavMenuProps } from "../types/contentful";
import { NavMenu } from "./modules/NavMenu";
import logo from "../images/jerseyLogoFooter.png";
import { SubFooter } from "./SubFooter";

export const Footer = ({
  items,
}: {
  items: {
    footerNav1?: NavMenuProps;
    footerNav2?: NavMenuProps;
  };
}) => {
  const { t } = useTranslation();

  return (
    <footer>
      <div className="container">
        <div>
          <NavMenu menu={items.footerNav1} className="footer-nav-l" />
        </div>
        <div>
          <NavMenu menu={items.footerNav2} className="footer-nav-r" />
          <img src={logo} alt="New Jersey logo" />
        </div>
      </div>
      <SubFooter />
    </footer>
  );
};
