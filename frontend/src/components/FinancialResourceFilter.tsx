import { Icon } from "@material-ui/core";
import { FinResourceTypeProps } from "../types/contentful";
import { useState } from "react";

export const FinancialResourceFilter = ({
  education,
  funding,
  className,
}: {
  education?: FinResourceTypeProps;
  funding?: FinResourceTypeProps;
  className?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const toggleIsOpen = (): void => {
    setOpen(!open);
    const contentBlock = document.getElementById("innerFilter");
    if (contentBlock) {
      const height = contentBlock?.scrollHeight;
      contentBlock.style.height = !open ? `${height}px` : "0px";
    }
  };

  return (
    <aside
      className={`resource-controller${open ? " open" : ""}${className ? ` ${className}` : ""}`}
    >
      <button
        className="toggle"
        onClick={toggleIsOpen}
        aria-controls="innerFilter"
        data-expand={open ? "true" : null}
        aria-expanded={open ? "true" : "false"}
      >
        Filter Options <Icon>chevron_right</Icon>
      </button>
      <div id="innerFilter" className="inner" style={{ height: 0 }}>
        <form className="usa-form">
          <fieldset className="usa-fieldset">
            <legend className="usa-legend">Funding Type</legend>
            {funding?.items.map(({ title, sys }) => (
              <div className="usa-checkbox" key={sys?.id}>
                <input className="usa-checkbox__input" id={sys?.id} type="checkbox" />
                <label className="usa-checkbox__label" htmlFor={sys?.id}>
                  {title}
                </label>
              </div>
            ))}
            <legend className="usa-legend">Education Type</legend>
            {education?.items.map(({ title, sys }) => (
              <div className="usa-checkbox" key={sys?.id}>
                <input className="usa-checkbox__input" id={sys?.id} type="checkbox" />
                <label className="usa-checkbox__label" htmlFor={sys?.id}>
                  {title}
                </label>
              </div>
            ))}
            <button className="reset">Clear Selection</button>
          </fieldset>
        </form>
      </div>
    </aside>
  );
};
