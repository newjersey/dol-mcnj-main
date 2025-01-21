"use client";
import { HeadingLevel } from "@utils/types";
import { Heading } from "./Heading";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { useEffect, useState } from "react";
import { IconSelector } from "./IconSelector";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

export interface AlertProps {
  className?: string;
  copy?: string;
  heading?: string;
  collapsable?: boolean;
  noIcon?: boolean;
  slim?: boolean;
  alertId?: string;
  dismissible?: boolean;
  type: "info" | "success" | "warning" | "error";
}

export const Alert = ({
  className,
  copy,
  heading,
  noIcon,
  dismissible,
  collapsable,
  alertId,
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
              {show ? <CaretUp size={30} /> : <CaretDown size={30} />}
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
