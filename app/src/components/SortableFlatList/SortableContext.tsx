import { createContext } from "react";
import type { FlatListProps } from "react-native";
import type Animated from "react-native-reanimated";
import type { GetItemLayoutResult, SortableListRenderItem } from "./types";

export const SortableContext = createContext(
  {} as {
    activeLayoutAnim: Animated.SharedValue<GetItemLayoutResult | null>;
    scrollOffset: Animated.SharedValue<number>;
    spacerIndexAnim: Animated.SharedValue<number>;
    hoverOffset: Animated.SharedValue<number>;
    drag(index: number): void;
    getCachableItemLayout(index: number): GetItemLayoutResult;
    horizontal?: FlatListProps<unknown>["horizontal"];
    sortableRenderItem: SortableListRenderItem<any>;
  }
);
