import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { ButtonProps } from "@utils/types";
import Image, { ImageProps } from "next/image";
import { Button } from "./Button";

export interface MediaCardProps {
  title: string;
  image?: ImageProps;
  description?: string;
  button?: ButtonProps;
  className?: string;
}

export const MediaCard = ({
  title,
  image,
  description,
  button,
  className,
}: MediaCardProps) => {
  return (
    <div
      className={`${
        className ? `${className} ` : ""
      }media-card border-[1px] bg-[#fcfcfc] border-[#DCDEE0] border-solid rounded-[16px] overflow-hidden`}
    >
      {image && (
        <div className="relative h-[167px] overflow-hidden">
          <Image
            className="object-cover h-full w-full"
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            placeholder={image.blurDataURL ? "blur" : undefined}
            blurDataURL={image.blurDataURL}
          />
        </div>
      )}
      <div className="p-6 flex items-start   flex-col gap-4">
        <p className="text-[24px] leading-[1.2] font-bold margin-0">{title}</p>
        {description && (
          <span
            className="description mt-0"
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(description),
            }}
          />
        )}
        {button && <Button {...button} className="mt-0" autoWidth />}
      </div>
    </div>
  );
};
