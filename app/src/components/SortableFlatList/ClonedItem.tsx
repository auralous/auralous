import { useContext } from "react";
import type { ViewStyle } from "react-native";
import { useAnimatedStyle } from "react-native-reanimated";
import { SortableContext } from "./SortableContext";
import type { PartialListRenderItemInfo } from "./types";

const noop = () => undefined;

function ClonedItem<ItemT>({
  info,
}: {
  info: PartialListRenderItemInfo<ItemT>;
}) {
  const { hoverOffset, sortableRenderItem, horizontal } =
    useContext(SortableContext);

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute" as const,
      zIndex: 1,
      // Should not render if item has not been moved
      transform: [
        {
          [horizontal ? "translateX" : "translateY"]: hoverOffset.value,
        },
      ] as unknown as ViewStyle["transform"],
    };
  }, [horizontal]);

  return sortableRenderItem({
    ...info,
    drag: noop,
    isDragging: true,
    animStyle: style,
  });
}

export default ClonedItem;
