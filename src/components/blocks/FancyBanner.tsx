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
    <section
      className={`${className || ""} pt-[64px] pb-[48px] text-primaryDark`}
    >
      <div className="container">
        <div className="flex flex-col tablet:flex-row items-center justify-between gap-[32px]">
          <div className="w-full tablet:w-[calc(50%-32px)] flex flex-col gap-[16px]">
            <h1 className="my-0 text-pretty text-[48px] tabletXl:text-[72px] leading-[1.2]">
              {heading}
            </h1>
            {subheading && (
              <p className="my-0 text-pretty text-[24px] tabletXl:text-[40px] leading-[1.2]">
                {subheading}
              </p>
            )}
            {message && <p className="my-0 text-pretty">{message}</p>}
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-[24] w-full tablet:w-1/2 max-h-[300px]">
            {images?.map((image, i) => (
              <div
                className={`overflow-hidden rounded-[16px]${
                  i === 0 ? " row-span-2" : ""
                }`}
                key={image.src}
              >
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  width={image.width || 300}
                  height={image.height || 200}
                  blurDataURL={image.blurDataURL}
                  placeholder="blur"
                  className={
                    "pointer-events-none select-none w-full h-full object-cover block"
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
