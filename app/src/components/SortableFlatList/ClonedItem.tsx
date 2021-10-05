import { useContext } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { SortableContext } from "./SortableContext";
import type { PartialListRenderItemInfo } from "./types";

const noop = () => undefined;

function ClonedItem<ItemT>({
  info,
}: {
  info: PartialListRenderItemInfo<ItemT>;
}) {
  const { hoverOffset, hasMoved, sortableRenderItem, horizontal } =
    useContext(SortableContext);

  const style = useAnimatedStyle(() => {
    return Object.assign(horizontal ? { height: "100%" } : { width: "100%" }, {
      position: "absolute" as const,
      zIndex: 1,
      opacity: 0.5,
      // Should not render if item has not been moved
      transform: hasMoved.value
        ? [{ translateY: hoverOffset.value }]
        : [{ scale: 0 }],
    });
  }, [horizontal]);

  return (
    <Animated.View style={style}>
      {sortableRenderItem({ ...info, drag: noop })}
    </Animated.View>
  );
}

export default ClonedItem;
