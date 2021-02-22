import { createContext } from "react";

const LayoutAppContext = createContext<{
  prevPathname: React.MutableRefObject<string>;
}>({
  prevPathname: { current: "" },
});

export default LayoutAppContext;
