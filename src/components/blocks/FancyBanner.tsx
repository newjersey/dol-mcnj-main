"use client";
import { FancyBannerProps } from "@utils/types/components";
import Image from "next/image";

export const FancyBanner = ({
  className,
  heading,
  subheading,
  message,
  images,
}: FancyBannerProps) => {
  return (
    <section className={`fancyBanner ${className ? className : ""}`}>
      <div className="container">
        <div className="inner">
          <div className="copy">
            <h1>{heading}</h1>
            {subheading && <p className="subheading">{subheading}</p>}
            {message && <p>{message}</p>}
          </div>

          <div className="imageGrid">
            {images?.map((image) => (
              <div className="image" key={image.src}>
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  width={image.width || 300}
                  height={image.height || 200}
                  blurDataURL={image.blurDataURL}
                  placeholder="blur"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
