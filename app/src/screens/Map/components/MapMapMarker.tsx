import { Colors } from "@auralous/ui";
import { FC, useEffect } from "react";
import { PixelRatio, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const radiusPx = 32;
const maxSize = radiusPx * PixelRatio.getPixelSizeForLayoutSize(1);

const styles = StyleSheet.create({
  marker: {
    height: maxSize,
    width: maxSize,
  },
  ring: {
    backgroundColor: "rgba(255,255,255,.8)",
    borderRadius: 9999,
    height: "100%",
    width: "100%",
  },
  // add to fix a weird bug in rendering the marker
  workaround: {
    backgroundColor: Colors.none,
    flex: 1,
  },
});

export const MapMapMarker: FC<{ lngLat: [number, number] }> = ({ lngLat }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withDelay(800, withTiming(0, { duration: 0 }))
      ),
      -1,
      false
    );
    return () => {
      progress.value = 0;
    };
  }, [lngLat, progress]);

  const animatedRing1 = useAnimatedStyle(() => {
    return {
      opacity: 1 - progress.value,
      transform: [
        {
          scale: progress.value,
        },
      ],
    };
  });

  return (
    <View style={styles.marker}>
      <View style={styles.workaround}>
        <Animated.View style={[styles.ring, animatedRing1]} />
      </View>
    </View>
  );
};
