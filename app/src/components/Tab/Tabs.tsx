import type { FC, ReactElement } from "react";
import { Children, cloneElement, useMemo, useState } from "react";
import TabsContext from "./Context";
import TabPanel from "./TabPanel";

interface TabsProps {
  initialIndex?: number;
  onChange?: (index: number) => void;
}

const Tabs: FC<TabsProps> = ({ initialIndex, children }) => {
  const [index, setIndex] = useState(initialIndex || 0);

  const childrenNode = useMemo(() => {
    let tabPanelIndex = 0;
    const arrayChildren = Children.toArray(children) as ReactElement[];
    return Children.map(arrayChildren, (child) => {
      if (!!child.type && child.type === TabPanel) {
        return cloneElement(child, { index: tabPanelIndex++ });
      }
      return child;
    });
  }, [children]);

  return (
    <TabsContext.Provider value={{ index, setIndex }}>
      {childrenNode}
    </TabsContext.Provider>
  );
};

export default Tabs;
