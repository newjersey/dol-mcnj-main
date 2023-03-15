import { Fragment, ReactElement } from "react";
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
      <div>
        <div className="copy">
          <ul>
            {breadCrumbs?.map((crumb, index: number) => (
              <Fragment key={crumb.text + index}>
                {index > 0 && <RightArrow />}
                <li>{crumb.href ? <a href={crumb.href}>{crumb.text}</a> : crumb.text}</li>
              </Fragment>
            ))}
          </ul>
          <h1>{heading}</h1>
        </div>
        {svg}
      </div>
    </section>
  );
};
