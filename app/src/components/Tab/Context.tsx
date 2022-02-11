import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

interface IContext {
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
}

const TabsContext = createContext({} as IContext);

export default TabsContext;
