import { Colors } from "@/styles";
import { memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Spacer } from "../Spacer";

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.white,
    width: 3.5,
  },
  root: {
    alignItems: "flex-end",
    flexDirection: "row",
    height: 15,
  },
});

const bar1 = [7, 2, 750];
const bar2 = [14, 4, 600];
const bar3 = [5, 1, 400];
const bar4 = [12, 5, 500];

export const AnimatedAudioBar = memo(function AnimatedAudioBar() {
  const sharedValue1 = useSharedValue(bar1[1]);
  const sharedValue2 = useSharedValue(bar2[1]);
  const sharedValue3 = useSharedValue(bar3[1]);
  const sharedValue4 = useSharedValue(bar3[1]);

  useEffect(() => {
    sharedValue1.value = withRepeat(
      withSequence(
        withTiming(bar1[0], { duration: bar1[2] }),
        withTiming(bar1[1], { duration: bar1[2] })
      ),
      -1
    );
    sharedValue2.value = withRepeat(
      withSequence(
        withTiming(bar2[0], { duration: bar2[2] }),
        withTiming(bar2[1], { duration: bar2[2] })
      ),
      -1
    );
    sharedValue3.value = withRepeat(
      withSequence(
        withTiming(bar3[0], { duration: bar3[2] }),
        withTiming(bar3[1], { duration: bar3[2] })
      ),
      -1
    );
    sharedValue4.value = withRepeat(
      withSequence(
        withTiming(bar4[0], { duration: bar4[2] }),
        withTiming(bar4[1], { duration: bar4[2] })
      ),
      -1
    );
  }, [sharedValue1, sharedValue2, sharedValue3, sharedValue4]);

  const style1 = useAnimatedStyle(() => ({
    height: sharedValue1.value,
  }));

  const style2 = useAnimatedStyle(() => ({
    height: sharedValue2.value,
  }));

  const style3 = useAnimatedStyle(() => ({
    height: sharedValue3.value,
  }));

  const style4 = useAnimatedStyle(() => ({
    height: sharedValue4.value,
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.bar, style1]} />
      <Spacer x={0.5} />
      <Animated.View style={[styles.bar, style2]} />
      <Spacer x={0.5} />
      <Animated.View style={[styles.bar, style3]} />
      <Spacer x={0.5} />
      <Animated.View style={[styles.bar, style4]} />
    </View>
  );
});
