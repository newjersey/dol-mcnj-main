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

/**
 * Alert/notification component with multiple variants and interactive features.
 * 
 * Displays important messages, warnings, and notifications throughout the app.
 * Supports dismissible alerts (stored in sessionStorage), collapsable content,
 * and various types (info, success, warning, error, global). Based on USWDS Alert.
 * 
 * @param props.type - Alert type: "info" | "success" | "warning" | "error" | "global" (required)
 * @param props.heading - Bold heading text displayed at top of alert
 * @param props.copy - Main alert message (supports markdown)
 * @param props.children - React children for custom alert content
 * @param props.dismissible - Whether user can dismiss alert (requires alertId)
 * @param props.alertId - Unique ID for storing dismissed state in sessionStorage
 * @param props.collapsable - Whether alert content can be collapsed/expanded
 * @param props.slim - Whether to use slim variant (less padding)
 * @param props.noIcon - Whether to hide the default icon
 * @param props.className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * // Success message
 * <Alert type="success" heading="Application Submitted" 
 *        copy="Your application has been received." />
 * 
 * // Dismissible warning (persists across page loads)
 * <Alert type="warning" alertId="covid-alert" dismissible
 *        heading="COVID-19 Updates" 
 *        copy="Some programs may be offered virtually." />
 * 
 * // Collapsable info with custom content
 * <Alert type="info" collapsable heading="Program Details">
 *   <p>Additional information here...</p>
 * </Alert>
 * ```
 */
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
