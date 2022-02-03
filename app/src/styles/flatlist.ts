import { useUiLayout } from "@/ui-context/UIContext";
import { useMemo } from "react";

export function useFlatlist6432Layout<T>(items: T[] | undefined) {
  const numColumns = useUiLayout().column6432;
  const data = useMemo(() => {
    if (!items) return undefined;
    // If the # of items is odd, the last items will have full widths due to flex: 1
    // we manually cut them off
    const len = items.length;
    if (len < numColumns) return items;
    const maxlen = len - (len % numColumns);
    return items.slice(0, maxlen);
  }, [items, numColumns]);

  return { numColumns, data };
}
