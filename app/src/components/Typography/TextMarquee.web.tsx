// TextMarquee does not work on Web yet
import type { FC } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { TextProps } from "./Typography";
import { Text } from "./Typography";

export const TextMarquee: FC<
  Omit<TextProps, "numberOfLines"> & {
    containerStyle?: StyleProp<ViewStyle>;
    duration: number;
    marqueeDelay?: number;
    children: string;
  }
> = ({ children, ...props }) => (
  <Text {...props} numberOfLines={1}>
    {children}
  </Text>
);
