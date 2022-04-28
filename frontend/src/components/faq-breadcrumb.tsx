import React, { ReactElement } from "react";
import { Link, navigate } from "@reach/router";
import { Icon } from "@material-ui/core";
import { UnstyledButton } from "./UnstyledButton";

interface Props {
  current: string;
}

export const FaqBreadcrumb = (props: Props): ReactElement => {
  const goBack = (): void => {
    navigate(-1);
  };

  return (
    <nav className="flex fac mtl faq-breadcrumb">
      <Link to="/" className="link-format-blue mvs">
        Home
      </Link>
      <Icon className="mhs blue breadcrumb-icon">arrow_forward_ios</Icon>
      <UnstyledButton className="link-format-blue breadcrumb-item" onClick={goBack}>
        Resources
      </UnstyledButton>
      <Icon className="mhs blue breadcrumb-icon">arrow_forward_ios</Icon>
      <Link to="" className="link-format-blue mvs">
        {props.current}
      </Link>
    </nav>
  );
};
