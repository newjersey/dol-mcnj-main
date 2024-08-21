"use client";
import { Button } from "@components/modules/Button";
import { ContentfulRichText } from "@components/modules/ContentfulRichText";
import { ResponsiveImage } from "@components/modules/ResponsiveImage";
import { PageBannerProps } from "@utils/types";

export const FancyBanner = ({
  title,
  message,
  className,
  image,
  buttonCopy,
}: PageBannerProps) => {
  return (
    <section className={`fancyBanner${className ? ` ${className}` : ""}`}>
      <div className="container">
        <div className="copy">
          <h1>{title}</h1>
          {message && <ContentfulRichText document={message.json} />}
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
