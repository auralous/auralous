import "react-native";

declare module "react-native" {
  interface PressableProps {
    onHoverIn?: (e: MouseEvent) => void;
    onHoverOut?: (e: MouseEvent) => void;
  }

  interface PressableStateCallbackType {
    readonly hovered: boolean;
  }
}
