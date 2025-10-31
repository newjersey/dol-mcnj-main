"use client";
import { ArrowSquareOut, House } from "@phosphor-icons/react";
import Link from "next/link";
import { smoothScrollToAnchor } from "@utils/smoothScroll";

interface LinkObjectProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  role?: string;
  url: string;
  noIndicator?: boolean;
  target?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const LinkObject = ({
  children,
  onClick,
  role,
  id,
  target,
  className,
  noIndicator,
  url,
  style,
}: LinkObjectProps) => {
  const isInternal =
    url.startsWith("/") || url.startsWith("#") || url.startsWith("?");
  const isHomePage = url === "/";
  const isParameter = url.startsWith("?");
  const isContactModal = url === "?contactModal=true";
  const hasHttp = !isInternal && url.startsWith("http");
  return isInternal ? (
    <Link
      id={id}
      className={`linkObject${className ? ` ${className}` : ""}`}
      role={role}
      href={url}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        if (isParameter) {
          e.preventDefault();
          if (isContactModal) {
            const button = document.getElementById("contactModalButton");
            if (button) {
              button.click();
            }
          }
        }
        if (url.startsWith("#")) {
          // Simple smooth scroll to anchor using native scrollIntoView
          const targetId = url.replace("#", "");
          smoothScrollToAnchor(targetId);
        }
        if (onClick) {
          onClick();
        }
      }}
      style={style}
    >
      {children}
      {!noIndicator && isHomePage && (
        <House weight="fill" size={14} className="ml-[4px] inline-block" />
      )}
    </Link>
  ) : (
    <a
      id={id}
      className={`linkObject${className ? ` ${className}` : ""}`}
      role={role}
      href={
        url.startsWith("#") || url.startsWith("?")
          ? url
          : !hasHttp
          ? `https://${url}`
          : url
      }
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (url.startsWith("#")) {
          e.preventDefault();
          // Simple smooth scroll to anchor using native scrollIntoView
          const targetId = url.replace("#", "");
          smoothScrollToAnchor(targetId);
        }
        if (onClick) {
          onClick();
        }
      }}
      style={style}
    >
      {children}
      {!noIndicator && (
        <ArrowSquareOut size={14} className="ml-[4px] inline-block" />
      )}
    </a>
  );
};

export { LinkObject };
