import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { useColors } from "@/styles";
import { useSharedValuePressed } from "@/utils/animation";
import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { baseStyleFn, baseStyleTextFn } from "./styles";
import { BaseButtonProps } from "./types";

type GradientButtonProps = BaseButtonProps;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GradientButton: React.FC<GradientButtonProps> = (props) => {
  const { icon, children, onPress, accessibilityLabel, disabled, textProps } =
    props;

  const [pressed, pressedProps] = useSharedValuePressed();
  const colors = useColors();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    opacity: withTiming(!disabled && pressed.value ? 0.2 : 1),
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      {...pressedProps}
      style={[...baseStyleFn(props), animatedStyles]}
    >
      <LinearGradient
        colors={colors.gradientRainbow.colors}
        locations={colors.gradientRainbow.locations}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      {icon}
      {!!(icon && children) && <Spacer x={1} />}
      <Text
        bold
        {...textProps}
        style={[...baseStyleTextFn(props), { color: "#ffffff" }]}
      >
        {children}
      </Text>
    </AnimatedPressable>
  );
};
