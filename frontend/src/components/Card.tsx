import { ArrowRight } from "@phosphor-icons/react";
import { IconSelector } from "./IconSelector";

export interface CardProps {
  heading?: string;
  description?: string;
  icon?: string;
  link?: {
    href: string;
    text?: string;
  };
  theme?: "blue" | "green" | "purple" | "navy";
  outline?: boolean;
}

export const Card = ({
  heading,
  description,
  icon,
  link,
  theme = "blue",
  outline = false,
}: CardProps) => {
  return (
    <a
      href={link?.href}
      className={`itemCard${theme ? ` theme-${theme}` : ""}${outline ? " outline" : ""}`}
    >
      <div className="heading">
        {heading && <p>{heading}</p>}
        {icon && <IconSelector name={icon} weight="duotone" size={28} />}
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
