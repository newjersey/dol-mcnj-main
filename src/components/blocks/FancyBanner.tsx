"use client";
import { FancyBannerProps } from "@utils/types/components";
import Image from "next/image";
import { memo } from "react";

export const FancyBanner = memo(({
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
            {images?.map((image, index) => (
              <div className="image" key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width || 300}
                  height={image.height || 200}
                  blurDataURL={image.blurDataURL}
                  placeholder="blur"
                  priority={index === 0} // Prioritize loading the first image
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

FancyBanner.displayName = "FancyBanner";
