import React, { ReactElement } from "react";

interface Props {
  title: string;
  children: ReactElement;
  backgroundColorClass?: string;
}

export const Grouping = (props: Props): ReactElement => {
  const backgroundColorClass = props.backgroundColorClass || "bg-light-green";

  return (
    <div className="mtm grouping">
      <div className={`${backgroundColorClass} pvs bar`}>
        <h2 className="text-m weight-500">{props.title}</h2>
      </div>
      <div className="pts group-padding">{props.children}</div>
    </div>
  );
};
