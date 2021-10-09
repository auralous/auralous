import { useEffect } from "react";
import { BackHandler } from "react-native";

export const useBackHandlerDismiss = (
  enabled: boolean,
  onDismiss?: () => void
) => {
  useEffect(() => {
    if (!enabled) return;
    return BackHandler.addEventListener("hardwareBackPress", () => {
      onDismiss?.();
      return true;
    }).remove;
  }, [enabled, onDismiss]);
};
