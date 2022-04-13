import React, { ReactElement, useCallback, useContext } from "react";
import { ContextualInfoContext } from "../contextual-info/ContextualInfoContext";
import { Drawer, Icon, IconButton } from "@material-ui/core";

export const ContextualInfoPanel = (): ReactElement => {
  const { contextualInfo, setContextualInfo } = useContext(ContextualInfoContext);

  const onClickClose = useCallback(() => {
    setContextualInfo((prevValue) => ({
      ...prevValue,
      isOpen: false,
    }));
  }, [setContextualInfo]);

  const onCloseHandler = useCallback(
    (_event: React.SyntheticEvent) => {
      onClickClose();
    },
    [onClickClose]
  );

  return (
    <Drawer anchor="right" open={contextualInfo.isOpen} onClose={onCloseHandler}>
      <aside
        className="contextual-info-panel fdc ptd bg-light-green width-100 height-100"
        aria-label="Additional Information Panel"
      >
        <div className="fase mbd">
          <IconButton aria-label="close" onClick={onClickClose}>
            <Icon>close</Icon>
          </IconButton>
        </div>

        <header className="mbl">
          <h1 className="text-l">{contextualInfo.title}</h1>
        </header>

        <section>
          <div>{contextualInfo.body}</div>
          {contextualInfo.linkUrl != null && contextualInfo.linkText != null && (
            <div className="mtd">
              <a
                className="link-format-blue"
                target="_blank"
                rel="noopener noreferrer"
                href={contextualInfo.linkUrl}
              >
                {contextualInfo.linkText}
              </a>
            </div>
          )}
        </section>
      </aside>
    </Drawer>
  );
};
