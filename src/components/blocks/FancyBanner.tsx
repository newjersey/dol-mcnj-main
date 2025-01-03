"use client";
import { Button } from "@components/modules/Button";
import { ResponsiveImage } from "@components/modules/ResponsiveImage";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { PageBannerProps } from "@utils/types";

export const FancyBanner = ({
  title,
  message,
  className,
  image,
  buttonCopy,
  subHeading,
}: PageBannerProps) => {
  return (
    <section className={`fancyBanner${className ? ` ${className}` : ""}`}>
      <div className="container">
        <div className="copy">
          <h1>{title}</h1>
          {subHeading && <p className="subheading">{subHeading}</p>}
          {message && (
            <div
              className="message"
              data-testid="rich-text"
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHTML(message as string),
              }}
            />
          )}
          {buttonCopy && (
            <Button
              type="button"
              defaultStyle="cool"
              label={buttonCopy}
              iconSuffix="ArrowDown"
              iconWeight="bold"
              onClick={() => {
                const el = document.getElementById("tools");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          )}
        </div>

        {image && (
          <div className="image">
            <ResponsiveImage
              src={image.url}
              alt={image.description || ""}
              width={image.width}
              height={image.height}
            />
          </div>
        )}
      </div>
    </section>
  );
};
