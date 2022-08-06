import type { FC, ReactElement } from "react";
import { useContext } from "react";
import TabsContext from "./Context";

const TabPanel: FC<{ index?: number; children: ReactElement }> = ({
  children,
  index,
}) => {
  const { index: currentIndex } = useContext(TabsContext);
  return currentIndex === index ? children : null;
};

export default TabPanel;
