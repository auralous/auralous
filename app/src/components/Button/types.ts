import type { Text } from "@/components/Typography";
import type { ComponentProps } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface BaseButtonProps {
  onPress?(): void;
  accessibilityLabel?: string;
  children?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textProps?: ComponentProps<typeof Text>;
}
