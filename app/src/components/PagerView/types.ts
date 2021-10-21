import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface PagerViewProps {
  onSelected?(newPage: number): void;
  style: StyleProp<ViewStyle>;
  orientation?: "horizontal" | "vertical";
  children: ReactNode;
}

export interface PagerViewMethods {
  setPage(newPage: number): void;
}
