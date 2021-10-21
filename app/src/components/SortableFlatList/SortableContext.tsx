import { createContext } from "react";
import type { FlatListProps } from "react-native";
import type Animated from "react-native-reanimated";
import type { GetItemLayoutResult, SortableListRenderItem } from "./types";

export const SortableContext = createContext(
  {} as {
    activeCellSizeValue: number | undefined;
    scrollOffset: Animated.SharedValue<number>;
    activeIndexAnim: Animated.SharedValue<number>;
    spacerIndexAnim: Animated.SharedValue<number>;
    hoverOffset: Animated.SharedValue<number>;
    hasMoved: Animated.SharedValue<boolean>;
    drag(index: number): void;
    getCellMeasurement(index: number): GetItemLayoutResult;
    horizontal?: FlatListProps<unknown>["horizontal"];
    sortableRenderItem: SortableListRenderItem<any>;
  }
);
