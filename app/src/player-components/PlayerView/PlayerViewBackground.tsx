import { usePlaybackColor } from "@/player";
import { useAnimatedBgColors } from "@/styles/utils";
import type { FC } from "react";
import { memo } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";

const gradientColors = ["rgba(0,0,0,.5)", "rgba(0,0,0,.1)"];
const start = { x: 0, y: 2 / 3 };
const end = { x: 1, y: 1 / 3 };

const PlayerViewBackground: FC<{
  style: StyleProp<ViewStyle>;
  pointerEvents: ViewProps["pointerEvents"];
}> = ({ style, pointerEvents }) => {
  const animatedStyle = useAnimatedBgColors(usePlaybackColor());

  return (
    <View style={style} pointerEvents={pointerEvents}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, animatedStyle]}
      />
      <LinearGradient
        colors={gradientColors}
        start={start}
        end={end}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </View>
  );
};

export default memo(PlayerViewBackground);
