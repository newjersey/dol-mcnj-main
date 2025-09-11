import { Button } from "@components/modules/Button";
import { Heading } from "@components/modules/Heading";
import { ButtonProps } from "@utils/types";
import Image from "next/image";

export interface CardItemProps {
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  title?: string;
  description?: string;
  button: ButtonProps;
}

export interface CardGridProps {
  heading?: string;
  description?: string;
  items: CardItemProps[];
}

export const CardItem = ({
  image,
  title,
  description,
  button,
}: CardItemProps) => {
  return (
    <div>
      <div className="w-full bg-[#fcfcfc] border-baseLighter border-[1px] border-solid rounded-[16px] overflow-hidden">
        <div className="">
          {image && (
            <div className="relative h-[167px] w-full">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="object-cover h-full w-full"
              />
            </div>
          )}
          <div className="p-6">
            {title && <p className="text-[24px] font-[700]">{title}</p>}
            {description && <p>{description}</p>}
            {button && (
              <div className="mt-4">
                <Button {...button} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardGrid = ({ heading, description, items }: CardGridProps) => {
  return (
    <div>
      <Heading level={2} className="font-[700] m-0">
        {heading}
      </Heading>
      <p className="m-0 mt-2">{description}</p>
      <div className="grid grid-cols-3 gap-6 mt-8">
        {items.map((item, index) => (
          <CardItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};
