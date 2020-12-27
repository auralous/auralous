import { createContext } from "react";

const LayoutContext = createContext<{
  prevPathname: React.MutableRefObject<string>;
}>({
  prevPathname: { current: "" },
});

export default LayoutContext;
