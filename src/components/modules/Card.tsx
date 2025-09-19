import { ThemeColors } from "@utils/types";
import { IconSelector } from "./IconSelector";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";

export interface CardItemProps {
  title: string;
  message?: string;
  icon?: string;
  link: {
    href: string;
    copy?: string;
  };
  className?: string;
  theme?: ThemeColors;
  outline?: boolean;
  iconWeight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}

export const Card = ({
  title,
  message,
  icon,
  link,
  className,
  theme = "base",
  iconWeight = "duotone",
  outline = false,
}: CardItemProps) => {
  return (
    <Link
      href={link.href}
      target={link.href.includes("http") ? "_blank" : "_self"}
      rel={link.href.includes("http") ? "noopener noreferrer" : undefined}
      className={`cardItem ${className ? className : ""} theme-${theme}${
        outline ? " outline" : ""
      }`}
    >
      <div className="heading">
        <p>{title}</p>
        {icon && <IconSelector weight={iconWeight} name={icon} size={32} />}
      </div>
      {message && (
        <div
          dangerouslySetInnerHTML={{
            __html: parseMarkdownToHTML(message),
          }}
        />
      )}
      {link.copy && (
        <p className="link">
          {link.copy} <ArrowRight size={32} />
        </p>
      )}
    </Link>
  );
};
