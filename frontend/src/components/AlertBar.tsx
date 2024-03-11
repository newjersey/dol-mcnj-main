import { useEffect, useState } from "react";
import { IconSelector } from "./IconSelector";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";

export const AlertBar = ({
  heading,
  copy,
  type,
  alertId,
  dismissible,
  className,
}: {
  type: "info" | "warning" | "error" | "success";
  heading?: string;
  alertId?: string;
  dismissible?: boolean;
  copy?: string;
  className?: string;
}) => {
  const [remove, setRemove] = useState(false);
  const [loading, setLoading] = useState(false);

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
      role="alert"
      id={alertId}
      className={`alert-bar usa-alert usa-alert--${type}${loading || remove ? " hide" : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="usa-alert__body">
        <div>
          {heading && (
            <p className="usa-alert__heading">
              <strong>{heading}</strong>
            </p>
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
