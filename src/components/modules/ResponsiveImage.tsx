import Image from "next/image";

interface ImageProps {
  alt?: string;
  height?: number;
  isBackground?: boolean;
  lqip?: string;
  noContainer?: boolean;
  role?: string;
  sizes?: string;
  className?: string;
  src: string;
  width?: number;
}

const ResponsiveImage = ({
  alt = "",
  className,
  noContainer,

  height,
  isBackground,
  lqip,
  sizes,
  src,
  width,
}: ImageProps) => {
  return (
    <>
      {noContainer ? (
        <Image
          src={src}
          alt={alt}
          quality={100}
          fill={isBackground}
          sizes={sizes}
          width={!isBackground ? width : undefined}
          height={!isBackground ? height : undefined}
          placeholder={lqip ? "blur" : undefined}
          blurDataURL={lqip}
        />
      ) : (
        <div
          className={`${isBackground ? "background" : "image"}-container${
            className ? ` ${className}` : ""
          }`}
        >
          <Image
            src={src}
            alt={alt}
            quality={100}
            fill={isBackground}
            sizes={sizes}
            width={!isBackground ? width : undefined}
            height={!isBackground ? height : undefined}
            placeholder={lqip ? "blur" : undefined}
            blurDataURL={lqip}
          />
        </div>
      )}
    </>
  );
};

ResponsiveImage.displayName = "ResponsiveImage";

export { ResponsiveImage };
