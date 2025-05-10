import { ArrowRight } from "@phosphor-icons/react";
import { IconSelector } from "./IconSelector";

export interface CardProps {
  heading?: string;
  description?: string;
  className?: string;
  icon?: string;
  link?: {
    href: string;
    text?: string;
  };
  theme?: "blue" | "green" | "purple" | "navy";
  outline?: boolean;
  iconWeight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}

export const Card = ({
  heading,
  description,
  className,
  icon,
  link,
  theme = "blue",
  outline = false,
  iconWeight = "duotone",
}: CardProps) => {
  const isExternalLink = (url: string) => {
    const pattern = /^(https?:\/\/|www\.)/;
    return pattern.test(url);
  };

  return (
    <a
      href={link?.href}
      className={`itemCard${theme ? ` theme-${theme}` : ""}${outline ? " outline" : ""}${
        className ? ` ${className}` : ""
      }`}
      target={link && isExternalLink(link.href) ? "_blank" : undefined}
      rel={link && isExternalLink(link.href) ? "noopener noreferrer" : undefined}
    >
      <div className="heading">
        {heading && <p>{heading}</p>}
        {icon && <IconSelector name={icon} weight={iconWeight} size={28} />}
      </div>
      {description && <p>{description}</p>}
      {link && link.text && (
        <span>
          {link.text}
          <ArrowRight size={32} />
        </span>
      )}
    </a>
  );
};
