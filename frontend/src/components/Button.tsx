import React, { ReactElement } from "react";

interface Props {
  variant: "primary" | "secondary" | "outline";
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
      variantClassNames = "usa-button";
      break;
    case "secondary":
      variantClassNames = "usa-button usa-button--secondary";
      break;
    case "outline":
      variantClassNames = "usa-button usa-button--outline bg-white";
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
