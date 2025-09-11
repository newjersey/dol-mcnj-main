"use client";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { useEffect, useState } from "react";
import { IconSelector } from "./IconSelector";
import { CaretDownIcon, CaretUpIcon, GlobeIcon } from "@phosphor-icons/react";

export interface AlertProps {
  alertId?: string;
  children?: React.ReactNode;
  className?: string;
  collapsable?: boolean;
  copy?: string;
  dismissible?: boolean;
  heading?: string;
  noIcon?: boolean;
  slim?: boolean;
  type: "info" | "success" | "warning" | "error" | "global";
}

export const Alert = ({
  alertId,
  children,
  className,
  collapsable,
  copy,
  dismissible,
  heading,
  noIcon,
  slim,
  type,
}: AlertProps) => {
  const [remove, setRemove] = useState(false);
  const [loading, setLoading] = useState(!!alertId);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!alertId) {
      setLoading(false);
      return;
    }

    if (sessionStorage.getItem(`alert_${alertId}`)) {
      setRemove(true);
    }

    if (remove) {
      sessionStorage.setItem(`alert_${alertId}`, "true");
    }

    setLoading(false);
  }, [remove]);

  return (
    <div
      id={alertId}
      role="alert"
      className={`usa-alert usa-alert--${type}${
        slim ? " usa-alert--slim" : ""
      }${loading || remove ? " hide" : ""}${
        noIcon ? " usa-alert--no-icon" : ""
      }${collapsable ? " collapsable" : ""}${className ? ` ${className}` : ""}`}
    >
      <div className="usa-alert__body">
        {type === "global" && (
          <GlobeIcon size={32} className="mr-4" weight="bold" />
        )}
        <div>
          {heading && !collapsable && (
            <p className="heading-tag usa-alert__heading">{heading}</p>
          )}
          {collapsable && (
            <button
              onClick={() => setShow(!show)}
              className={`toggle${show ? " show" : ""}`}
            >
              {heading && (
                <p className="heading-tag usa-alert__heading">{heading}</p>
              )}
              {show ? <CaretUpIcon size={30} /> : <CaretDownIcon size={30} />}
              <div className="sr-only">{show ? "show less" : "show more"}</div>
            </button>
          )}
          {copy && (
            <div
              className={`usa-alert__text${
                collapsable && !show ? " hide" : ""
              }`}
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHTML(copy),
              }}
            />
          )}
          {children}
        </div>
        {alertId && dismissible && (
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(`alert_${alertId}`, "true");
              setRemove(true);
            }}
          >
            <IconSelector name="X" size={30} weight="bold" />
            <div className="sr-only">close alert</div>
          </button>
        )}
      </div>
    </div>
  );
};
