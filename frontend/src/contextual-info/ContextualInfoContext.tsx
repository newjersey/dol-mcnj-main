import { createContext, Dispatch, SetStateAction } from "react";

export interface ContextualInfo {
  isOpen: boolean;
  title: string;
  body: string;
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
  linkUrl: undefined,
  linkText: undefined,
};

export const ContextualInfoContext = createContext<ContextualInfoContextType>({
  contextualInfo: initialContextualInfoState,
  setContextualInfo: () => {},
});

ContextualInfoContext.displayName = "Contextual Info";
