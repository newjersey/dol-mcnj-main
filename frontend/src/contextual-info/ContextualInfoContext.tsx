import { createContext, Dispatch, SetStateAction } from "react";

export interface ContextualInfo {
  isOpen: boolean;
  title: string;
  body: string;
  disclaimer: string | undefined;
  linkUrl: string | undefined;
  linkText: string | undefined;
}

export interface ContextualInfoContextType {
  contextualInfo: ContextualInfo;
  setContextualInfo: Dispatch<SetStateAction<ContextualInfo>>;
}

export const initialContextualInfoState = {
  isOpen: false,
  title: "",
  body: "",
  disclaimer: "",
  linkUrl: undefined,
  linkText: undefined,
};

export const ContextualInfoContext = createContext<ContextualInfoContextType>({
  contextualInfo: initialContextualInfoState,
  setContextualInfo: () => {},
});

ContextualInfoContext.displayName = "Contextual Info";
