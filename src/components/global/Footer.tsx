import { NavMenuProps } from "@utils/types";
import { SubFooter } from "./SubFooter";
import { footerLogo } from "./assets";
import { NavMenu } from "./NavMenu";
import { ResponsiveImage } from "@components/modules/ResponsiveImage";
import { SupportedLanguages } from "@utils/types/types";

export const Footer = ({
  items,
  lang,
}: {
  lang: SupportedLanguages;
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
              lang={lang}
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
              lang={lang}
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
