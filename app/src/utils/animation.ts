import { Platform } from "react-native";
import {
  scrollTo as rnrScrollTo,
  useSharedValue,
} from "react-native-reanimated";
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

export const scrollTo: typeof rnrScrollTo = (aref, x, y, animated = false) => {
  "worklet";
  if (Platform.OS === "web") {
    try {
      // @ts-ignore: Web usage
      // https://docs.swmansion.com/react-native-reanimated/docs/api/nativeMethods/scrollTo
      // https://reactnative.dev/docs/scrollview#scrollto
      aref.current?.scrollTo({ x, y, animated });
    } catch (e) {
      // TODO: Review
      // Uncaught TypeError: Cannot read properties of null (reading 'scroll')
      // It is possible that this function is called after unmounting so we may ignore this error
      console.error(e);
    }
  } else {
    rnrScrollTo(aref, x, y, animated);
  }
};
