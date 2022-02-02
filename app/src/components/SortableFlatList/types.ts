import type { ReactElement } from "react";
import type { FlatListProps, ListRenderItemInfo } from "react-native";
import type { AnimatedStyleProp } from "react-native-reanimated";

export type PartialListRenderItemInfo<ItemT> = Omit<
  ListRenderItemInfo<ItemT>,
  "separators"
> & {
  separators?: ListRenderItemInfo<ItemT>["separators"];
};

export type SortableListRenderItemInfo<ItemT> =
  PartialListRenderItemInfo<ItemT> & {
    drag(): void;
    isDragging: boolean;
    animStyle: AnimatedStyleProp<any>;
  };

export type SortableListRenderItem<ItemT> = (
  info: SortableListRenderItemInfo<ItemT>
) => ReactElement;

export type DraggableListProps<ItemT> = Omit<
  FlatListProps<ItemT>,
  "renderItem" | "keyExtractor" | "itemHeight"
> & {
  onDragEnd(from: number, to: number): void;
  renderItem: SortableListRenderItem<ItemT>;
  keyExtractor: NonNullable<FlatListProps<ItemT>["keyExtractor"]>;
  getItemLayout: NonNullable<FlatListProps<ItemT>["getItemLayout"]>;
};

export type GetItemLayoutResult = ReturnType<
  NonNullable<FlatListProps<unknown>["getItemLayout"]>
>;
