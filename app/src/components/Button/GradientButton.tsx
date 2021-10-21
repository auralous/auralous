import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { useSharedValuePressed } from "@/styles/animation";
import { GradientColors } from "@/styles/colors";
import type { FC } from "react";
import type { ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useStyles } from "./styles";
import type { BaseButtonProps } from "./types";

type GradientButtonProps = BaseButtonProps;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const rnstyles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});

export const GradientButton: FC<GradientButtonProps> = (props) => {
  const styles = useStyles(props);
  const { icon, children, onPress, accessibilityLabel, disabled, textProps } =
    props;

  const [pressed, pressedProps] = useSharedValuePressed();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    opacity: disabled ? 0.5 : withTiming(pressed.value ? 0.2 : 1),
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      {...pressedProps}
      style={[StyleSheet.compose(styles.base, props.style), animatedStyles]}
    >
      <LinearGradient
        colors={GradientColors.rainbow.colors}
        locations={GradientColors.rainbow.locations}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={rnstyles.gradient}
      />
      {icon}
      {!!(icon && children) && <Spacer x={1} />}
      <Text
        bold
        {...textProps}
        style={[
          StyleSheet.compose(styles.text, textProps?.style),
          { color: GradientColors.rainbow.text },
        ]}
      >
        {children}
      </Text>
    </AnimatedPressable>
  );
};
