import { ReactElement } from "react";
import { OverlayTool } from "./OverlayTool";
import OVERLAY from "../overlayImages/Hero.png";
import { RightArrow } from "../svg/RightArrow";

interface PageBannerProps {
  heading: string;
  svg?: ReactElement;
  breadCrumbs?: {
    text: string;
    href?: string;
  }[];
}
export const PageBanner = ({ heading, svg, breadCrumbs }: PageBannerProps) => {
  return (
    <section className="page-banner">
      <OverlayTool img={OVERLAY} />
      <div>
        <div className="copy">
          <ul>
            {breadCrumbs?.map((crumb, index: number) => (
              <>
                {index > 0 && <RightArrow />}
                <li>{crumb.href ? <a href={crumb.href}>{crumb.text}</a> : crumb.text}</li>
              </>
            ))}
          </ul>

          <h1>{heading}</h1>
        </div>
        {svg}
      </div>
    </section>
  );
};
