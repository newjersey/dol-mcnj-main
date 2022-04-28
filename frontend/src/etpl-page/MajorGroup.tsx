import React, { ReactElement, useState } from "react";
import { Icon } from "@material-ui/core";

interface Props {
  title: string;
  icon: string;
  children?: string | ReactElement;
}

export const MajorGroup = (props: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };

  const getArrowIcon = (): string => {
    return isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down";
  };

  return (
    <div data-testid="majorGroup" className="badcg bradl mbs">
      <button
        onClick={toggleIsOpen}
        onMouseDown={(e): void => e.preventDefault()}
        className="pas color-blue width-100 weight-500 blue"
      >
        <div className={`fdr fac weight-500 ${isOpen ? "bbdcg" : ""}`}>
          <img className={`mrs ${isOpen ? "mbs" : ""}`} alt="" src={props.icon} />
          <span className={`blue ${isOpen ? "mbs" : ""}`}>{props.title}</span>
          <span className="mla">
            <Icon>{getArrowIcon()}</Icon>
          </span>
        </div>
      </button>

      {isOpen && <div className="mts mlm mrxl plm pbm">{props.children}</div>}
    </div>
  );
};
