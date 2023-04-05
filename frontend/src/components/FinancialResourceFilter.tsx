import { Icon } from "@material-ui/core";
import { FinResourceTypeProps } from "../types/contentful";
import { useState } from "react";

export const FinancialResourceFilter = ({
  education,
  funding,
}: {
  education?: FinResourceTypeProps;
  funding?: FinResourceTypeProps;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <aside className={`resource-controller${open ? " open" : ""}`}>
      <button className="toggle" onClick={() => setOpen(!open)}>
        Filter Options <Icon>chevron_right</Icon>
      </button>
      <div id="innerFilter" className="inner">
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
