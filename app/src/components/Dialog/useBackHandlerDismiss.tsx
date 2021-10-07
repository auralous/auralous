import { useEffect } from "react";
import { BackHandler, Platform } from "react-native";

export const useBackHandlerDismiss = (
  enabled: boolean,
  onDismiss?: () => void
) => {
  useEffect(() => {
    if (!enabled) return;
    if (Platform.OS === "web") {
      const onKeyUp = (ev: KeyboardEvent) => {
        if (ev.key === "Escape") onDismiss?.();
      };
      document.addEventListener("keyup", onKeyUp);
      return () => document.removeEventListener("keyup", onKeyUp);
    }
    return BackHandler.addEventListener("hardwareBackPress", () => {
      onDismiss?.();
      return true;
    }).remove;
  }, [enabled, onDismiss]);
};
