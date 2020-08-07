import React, { ReactElement } from "react";

interface Props {
  title: string;
  children: ReactElement;
}

export const Grouping = (props: Props): ReactElement => {
  return (
    <div className="mtm grouping">
      <div className="bg-light-green pvs bar">
        <h2 className="text-m weight-500">{props.title}</h2>
      </div>
      <div className="pts group-padding">{props.children}</div>
    </div>
  );
};
