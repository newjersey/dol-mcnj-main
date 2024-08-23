"use client";
import { HeadingLevel } from "@utils/types";
import { Heading } from "./Heading";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { useEffect, useState } from "react";
import { IconSelector } from "./IconSelector";

interface AlertProps {
  className?: string;
  copy?: string;
  heading?: string;
  headingLevel?: HeadingLevel;
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
  headingLevel = 3,
  noIcon,
  dismissible,
  alertId,
  slim,
  type,
}: AlertProps) => {
  const [remove, setRemove] = useState(false);
  const [loading, setLoading] = useState(!!alertId);

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
      }${className ? ` ${className}` : ""}`}
    >
      <div className="usa-alert__body">
        <div>
          {heading && (
            <Heading level={headingLevel} className="usa-alert__heading">
              {heading}
            </Heading>
          )}
          {copy && (
            <div
              className="usa-alert__text"
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
