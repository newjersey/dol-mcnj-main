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
          {items?.footerNav1 && (
            <NavMenu
              id="footer1"
              menu={items.footerNav1}
              className="footer-nav-l"
              label="Footer Navigation 1"
            />
          )}
        </div>
        <div>
          {items?.footerNav2 && (
            <NavMenu
              id="footer2"
              menu={items.footerNav2}
              className="footer-nav-r"
              label="Footer Navigation 2"
            />
          )}
          <img src={logo} alt="New Jersey logo" />
        </div>
      </div>
      <SubFooter />
    </footer>
  );
};
