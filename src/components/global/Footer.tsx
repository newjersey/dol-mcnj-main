import { NavMenuProps } from "@utils/types";
import { SubFooter } from "./SubFooter";
import { footerLogo } from "./assets";
import { NavMenu } from "./NavMenu";
import { ResponsiveImage } from "@components/modules/ResponsiveImage";

export const Footer = ({
  items,
}: {
  items?: {
    footerNav1?: NavMenuProps;
    footerNav2?: NavMenuProps;
  };
}) => {
  return (
    <footer>
      <div className="container">
        <div>
          {items?.footerNav1 && (
            <NavMenu
              noDropdowns
              id="footer1"
              icons
              menu={items.footerNav1}
              className="footer-nav-l"
              label="Footer Navigation 1"
            />
          )}
        </div>
        <div>
          {items?.footerNav2 && (
            <NavMenu
              noDropdowns
              id="footer2"
              icons
              menu={items.footerNav2}
              className="footer-nav-r"
              label="Footer Navigation 2"
            />
          )}
          <ResponsiveImage
            src={footerLogo}
            alt="New Jersey logo"
            width={210}
            height={223}
          />
        </div>
      </div>
      <SubFooter />
    </footer>
  );
};
