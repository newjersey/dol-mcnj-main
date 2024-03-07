import { useEffect, useState } from "react";
import { IconSelector } from "./IconSelector";

export const AlertBar = ({
  heading,
  copy,
  type,
  alertId,
  dismissible,
}: {
  type: "info" | "warning" | "error" | "success";
  heading?: string;
  alertId?: string;
  dismissible?: boolean;
  copy?: string;
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
      id={alertId}
      className={`alert-bar usa-alert usa-alert--${type}${loading || remove ? " hide" : ""}`}
    >
      <div className="usa-alert__body">
        <div>
          {heading && (
            <p className="usa-alert__heading">
              <strong>{heading}</strong>
            </p>
          )}
          {copy && <p className="usa-alert__text">{copy}</p>}
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
          </button>
        )}
      </div>
    </div>
  );
};
