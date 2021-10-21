import { Platform } from "react-native";
import {
  Easing,
  scrollTo as rnrScrollTo,
  useSharedValue,
} from "react-native-reanimated";

export function useSharedValuePressed() {
  const pressed = useSharedValue(false);
  return [
    pressed,
    {
      onPressIn: () => (pressed.value = true),
      onPressOut: () => (pressed.value = false),
    },
  ] as const;
}

export const scrollTo: typeof rnrScrollTo = (aref, x, y, animated = false) => {
  "worklet";
  if (Platform.OS === "web") {
    try {
      if (!aref.current) return;
      // @ts-ignore: Web usage
      // https://docs.swmansion.com/react-native-reanimated/docs/api/nativeMethods/scrollTo
      // https://reactnative.dev/docs/scrollview#scrollto
      if ("scrollTo" in aref.current) aref.current.scrollTo({ x, y, animated });
      else if ("scrollToOffset" in aref.current)
        // @ts-ignore: Flatlist
        aref.current?.scrollToOffset({
          offset: x || y,
          animated,
        });
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

export const AnimationEasings = {
  outExp: Easing.out(Easing.exp),
};
