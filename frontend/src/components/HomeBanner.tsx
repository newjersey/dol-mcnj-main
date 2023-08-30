import { ArrowDown } from "@phosphor-icons/react";
import { ImageProps } from "../types/contentful";

interface HomeBannerProps {
  heading: string;
  subheading?: string;
  image?: ImageProps;
  buttonCopy?: string;
}

export const HomeBanner = ({ heading, subheading, image, buttonCopy }: HomeBannerProps) => {
  return (
    <section className="homeBanner">
      <div className="container">
        <div className="copy">
          <h1>{heading}</h1>
          {subheading && <p>{subheading}</p>}
          {buttonCopy && (
            <button
              className="usa-button"
              onClick={() => {
                // scroll to #homeContent
                const homeContent = document.getElementById("homeContent");
                if (homeContent) {
                  homeContent.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              {buttonCopy}
              <ArrowDown size={32} />
            </button>
          )}
        </div>
        {image && (
          <div className="image">
            <img alt="" src={image?.url} width={image?.width} height={image?.height} />
          </div>
        )}
      </div>
    </section>
  );
};
