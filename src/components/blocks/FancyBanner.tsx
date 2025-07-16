"use client";
import { FancyBannerProps } from "@utils/types/components";

export const FancyBanner = ({
  className,
  heading,
  subheading,
  message,
}: FancyBannerProps) => {
  return (
    <section className={`fancyBanner${className ? ` ${className}` : ""}`}>
      <div className="container">
        <h1>{heading}</h1>
        <p>{subheading}</p>
        <p>{message}</p>
      </div>
    </section>
  );
};
