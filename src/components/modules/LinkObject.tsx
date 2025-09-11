"use client";
import { ArrowSquareOut, House } from "@phosphor-icons/react";
import Link from "next/link";

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
  const isInternal = url.startsWith("/");
  const isHomePage = url === "/";
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
        if (url.startsWith("#")) {
          e.preventDefault();
          // scroll to anchor
          const id = url.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
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
      href={url.startsWith("#") ? url : !hasHttp ? `https://${url}` : url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (url.startsWith("#")) {
          e.preventDefault();
          // scroll to anchor
          const id = url.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
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
