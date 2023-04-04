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
        <div>
          <h2>Funding Type</h2>
          {funding?.items.map(({ title, sys }) => (
            <button className="item" key={sys?.id}>
              {title}
            </button>
          ))}
          <h2>Education Type</h2>
          {education?.items.map(({ title, sys }) => (
            <button className="item" key={sys?.id}>
              {title}
            </button>
          ))}
          <button className="reset">Clear Selection</button>
        </div>
      </div>
    </aside>
  );
};
