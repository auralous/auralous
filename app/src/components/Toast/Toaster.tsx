import { IconCheck, IconX } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { emitter } from "./pubsub";
import type { ToastValue } from "./types";

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    backgroundColor: "#dfdfdf",
    borderRadius: 9999,
    flexDirection: "row",
    height: Size[10],
    maxWidth: LayoutSize.md,
    paddingHorizontal: Size[4],
  },
  error: { backgroundColor: Colors.danger },
  icon: {
    alignItems: "center",
    borderRadius: 9999,
    height: Size[6],
    justifyContent: "center",
    width: Size[6],
  },
  root: {
    alignItems: "center",
    bottom: 0,
    marginBottom: 12,
    paddingHorizontal: Size[2],
    position: "absolute",
    width: "100%",
  },
  success: { backgroundColor: Colors.success },
  text: { color: "#282828", flex: 1 },
});

export const Toaster: FC = () => {
  const [toast, setToast] = useState<ToastValue | null>(null);
  const animValue = useSharedValue(0);

  useEffect(() => {
    const onToast = (event: ToastValue) => {
      const commit = () => {
        if (Platform.OS === "ios") {
          // ios does not support accessibilityLiveRegion
          AccessibilityInfo.announceForAccessibility(event.message);
        }
        animValue.value = withTiming(1);
        setToast(event);
      };
      if (toast) {
        animValue.value = withTiming(0, undefined, (isFinished) => {
          if (!isFinished) return;
          runOnJS(setToast)(null);
          runOnJS(commit)();
        });
      } else {
        commit();
      }
    };
    emitter.off("toast"); // ckear out other listeners
    emitter.on("toast", onToast);
    return () => emitter.off("toast", onToast);
  }, [animValue, toast]);

  const close = useCallback(() => {
    animValue.value = withTiming(0, undefined, (isFinished) => {
      if (!isFinished) return;
      runOnJS(setToast)(null);
    });
  }, [animValue]);

  useEffect(() => {
    if (!toast) return;
    const to = setTimeout(close, 6000);
    return () => clearTimeout(to);
  }, [toast, close]);

  const rootStyle = useAnimatedStyle(
    () => ({
      bottom: (animValue.value - 1) * 100 + "%",
    }),
    []
  );

  if (!toast) return null;
  return (
    <Animated.View
      style={[styles.root, rootStyle]}
      accessibilityLiveRegion="polite"
    >
      <Pressable style={styles.content} onPress={close}>
        {toast.type && (
          <>
            {toast.type === "success" ? (
              <View style={[styles.icon, styles.success]}>
                <IconCheck color="white" width={Size[4]} height={Size[4]} />
              </View>
            ) : (
              <View style={[styles.icon, styles.error]}>
                <IconX color="white" width={Size[4]} height={Size[4]} />
              </View>
            )}
          </>
        )}
        <Spacer x={3} />
        <Text style={styles.text} fontWeight="medium" color="textSecondary">
          {toast.message}
        </Text>
        <Spacer x={3} />
      </Pressable>
    </Animated.View>
  );
};
