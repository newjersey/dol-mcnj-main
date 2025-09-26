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
          // scroll to anchor
          const id = url.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            // Custom smooth scroll with 1 second duration
            const targetPosition = element.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 500; // 1 second
            let start: number | null = null;

            function animation(currentTime: number) {
              if (start === null) start = currentTime;
              const timeElapsed = currentTime - start;
              const run = ease(timeElapsed, startPosition, distance, duration);
              window.scrollTo(0, run);
              if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            function ease(t: number, b: number, c: number, d: number) {
              t /= d / 2;
              if (t < 1) return (c / 2) * t * t + b;
              t--;
              return (-c / 2) * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
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
          // scroll to anchor
          const id = url.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            // Custom smooth scroll with 1 second duration
            const targetPosition = element.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000; // 1 second
            let start: number | null = null;

            function animation(currentTime: number) {
              if (start === null) start = currentTime;
              const timeElapsed = currentTime - start;
              const run = ease(timeElapsed, startPosition, distance, duration);
              window.scrollTo(0, run);
              if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            function ease(t: number, b: number, c: number, d: number) {
              t /= d / 2;
              if (t < 1) return (c / 2) * t * t + b;
              t--;
              return (-c / 2) * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
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
