import React, { ReactElement } from "react";

interface Props {
  variant: "primary" | "secondary" | "outline" | "custom";
  children: React.ReactNode;
  onClick?:
    | (() => void)
    | ((event: React.MouseEvent) => Promise<void>)
    | ((event: React.MouseEvent) => void);
  className?: string;
}

export const Button = (props: Props): ReactElement => {
  let variantClassNames = "";
  switch (props.variant) {
    case "primary":
      variantClassNames = "usa-button margin-right-0";
      break;
    case "secondary":
      variantClassNames = "usa-button usa-button--secondary margin-right-0";
      break;
    case "outline":
      variantClassNames = "usa-button usa-button--outline bg-white margin-right-0";
      break;
    case "custom":
      variantClassNames = "usa-button margin-right-0 custom-button";
      break;
  }

  const className = [variantClassNames, props.className]
    .map((i) => i?.trim())
    .filter((value: string | undefined) => value && value.length > 0)
    .join(" ");

  return (
    <button className={className} onClick={props.onClick}>
      {props.children}
    </button>
  );
};
