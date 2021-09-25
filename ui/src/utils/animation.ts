import { Platform } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export function useSharedValuePressed() {
  const pressed = useSharedValue(false);
  return [
    pressed,
    Platform.OS === "web"
      ? {
          onHoverIn: () => (pressed.value = true),
          onHoverOut: () => (pressed.value = false),
        }
      : {
          onPressIn: () => (pressed.value = true),
          onPressOut: () => (pressed.value = false),
        },
  ] as const;
}
