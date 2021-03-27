import { createContext, MutableRefObject } from "react";

const LayoutAppContext = createContext(
  {} as { prevPathnameRef: MutableRefObject<string> }
);

export default LayoutAppContext;
