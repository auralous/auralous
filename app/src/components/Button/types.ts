import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface BaseButtonProps {
  onPress?(): void;
  accessibilityLabel?: string;
  children?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
