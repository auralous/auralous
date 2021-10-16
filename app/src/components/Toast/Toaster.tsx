import { IconCheck, IconX } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform, StyleSheet, View } from "react-native";
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
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 9999,
    elevation: 12,
    flexDirection: "row",
    height: Size[12],
    paddingHorizontal: Size[4],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
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
    bottom: 0,
    padding: Size[2],
    position: "absolute",
    width: "100%",
  },
  success: { backgroundColor: Colors.success },
  text: { flex: 1 },
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
    emitter.on("toast", onToast);
    return () => emitter.off("toast", onToast);
  }, [animValue, toast]);

  useEffect(() => {
    if (!toast) return;
    const to = setTimeout(() => {
      animValue.value = withTiming(0, undefined, (isFinished) => {
        if (!isFinished) return;
        runOnJS(setToast)(null);
      });
    }, 3500);
    return () => clearTimeout(to);
  }, [toast, animValue]);

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
      <View style={styles.content}>
        {toast.type && (
          <>
            {toast.type === "success" ? (
              <View style={[styles.icon, styles.success]}>
                <IconCheck
                  color={Colors.backgroundSecondary}
                  width={Size[4]}
                  height={Size[4]}
                />
              </View>
            ) : (
              <View style={[styles.icon, styles.error]}>
                <IconX
                  color={Colors.backgroundSecondary}
                  width={Size[4]}
                  height={Size[4]}
                />
              </View>
            )}
          </>
        )}
        <Spacer x={3} />
        <Text style={styles.text} fontWeight="medium" color="textSecondary">
          {toast.message}
        </Text>
        <Spacer x={3} />
      </View>
    </Animated.View>
  );
};
