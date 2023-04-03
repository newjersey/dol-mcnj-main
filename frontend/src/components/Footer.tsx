import { NavMenuData } from "../types/contentful";
import { NavMenu } from "./modules/NavMenu";
import logo from "../images/jerseyLogoFooter.png";
import { SubFooter } from "./SubFooter";

export const Footer = ({
  items,
}: {
  items?: {
    footerNav1?: NavMenuData;
    footerNav2?: NavMenuData;
  };
}) => {
  return (
    <footer>
      <div className="container">
        <div>
          {items?.footerNav1 && <NavMenu menu={items.footerNav1} className="footer-nav-l" />}
        </div>
        <div>
          {items?.footerNav2 && <NavMenu menu={items.footerNav2} className="footer-nav-r" />}
          <img src={logo} alt="New Jersey logo" />
        </div>
      </div>
      <SubFooter />
    </footer>
  );
};
