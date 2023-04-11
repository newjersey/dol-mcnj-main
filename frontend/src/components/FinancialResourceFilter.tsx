import { Icon } from "@material-ui/core";
import { FinResourceTypeProps } from "../types/contentful";
import { useState } from "react";

export const FinancialResourceFilter = ({
  education,
  funding,
  className,
  setActiveTags,
  activeTags = [],
}: {
  education?: FinResourceTypeProps;
  funding?: FinResourceTypeProps;
  setActiveTags: (tags: string[]) => void;
  activeTags: string[];
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
        data-testid="toggle"
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
                <input
                  className="usa-checkbox__input"
                  id={sys?.id}
                  data-testid={sys?.id}
                  type="checkbox"
                  onChange={() => {
                    if (activeTags.includes(`${sys?.id}`)) {
                      setActiveTags(activeTags.filter((tag) => tag !== sys?.id));
                    } else {
                      setActiveTags([...activeTags, `${sys?.id}`]);
                    }
                  }}
                />
                <label className="usa-checkbox__label" htmlFor={sys?.id}>
                  {title}
                </label>
              </div>
            ))}

            <legend className="usa-legend">Education Type</legend>
            {education?.items.map(({ title, sys }) => (
              <div className="usa-checkbox" key={sys?.id}>
                <input
                  className="usa-checkbox__input"
                  id={sys?.id}
                  data-testid={sys?.id}
                  type="checkbox"
                  onChange={() => {
                    if (activeTags.includes(`${sys?.id}`)) {
                      setActiveTags(activeTags.filter((tag) => tag !== sys?.id));
                    } else {
                      setActiveTags([...activeTags, `${sys?.id}`]);
                    }
                  }}
                />
                <label className="usa-checkbox__label" htmlFor={sys?.id}>
                  {title}
                </label>
              </div>
            ))}
            <button
              className="reset"
              data-testid="reset"
              onClick={(e) => {
                e.preventDefault();
                const checkboxes = document.querySelectorAll("input[type=checkbox]");
                checkboxes.forEach((checkbox) => {
                  (checkbox as HTMLInputElement).checked = false;
                });
                setActiveTags([]);
              }}
            >
              Clear Selection
            </button>
          </fieldset>
        </form>
      </div>
    </aside>
  );
};
