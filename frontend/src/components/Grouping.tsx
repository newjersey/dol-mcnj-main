import React, { ReactElement } from "react";

interface Props {
  title: string;
  children: ReactElement;
  subheading?: string;
  backgroundColorClass?: string;
  className?: string;
}

export const Grouping = (props: Props): ReactElement => {
  const backgroundColorClass = props.backgroundColorClass || "bg-light-green";

  return (
    <div className={`mtm grouping${props.className ? ` ${props.className}` : ""}`}>
      <div className={`${backgroundColorClass} pvs bar`}>
        <h2 className="heading text-m weight-500">{props.title}</h2>
        {props.subheading && <p className="subheading">{props.subheading}</p>}
      </div>
      <div className={`pts group-padding border-${backgroundColorClass.replace("bg-", "")}`}>
        {props.children}
      </div>
    </div>
  );
};
