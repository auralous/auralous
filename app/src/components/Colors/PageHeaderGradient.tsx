import { useAnimatedBgColors } from "@/player/useAnimatedBgColors";
import { useColors } from "@auralous/ui";
import { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { useImageColor } from "./useImageColors";

const styles = StyleSheet.create({
  root: {
    height: 384,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: -1,
  },
});

const PageHeaderGradient: FC<{ image: string | undefined | null }> = ({
  image,
}) => {
  const animatedStyle = useAnimatedBgColors(useImageColor(image));
  const backgroundColor = useColors().background;
  const gradientColors = useMemo(
    () => ["rgba(0,0,0,.5)", backgroundColor],
    [backgroundColor]
  );
  return (
    <View style={styles.root} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} />
      <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFill} />
    </View>
  );
};

export default PageHeaderGradient;
