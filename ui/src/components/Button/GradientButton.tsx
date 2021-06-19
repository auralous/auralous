import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { GradientColors } from "@/styles";
import { useSharedValuePressed } from "@/utils";
import { FC } from "react";
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

export const GradientButton: FC<GradientButtonProps> = (props) => {
  const { icon, children, onPress, accessibilityLabel, disabled, textProps } =
    props;

  const [pressed, pressedProps] = useSharedValuePressed();

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
        colors={GradientColors.rainbow.colors}
        locations={GradientColors.rainbow.locations}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      {icon}
      {!!(icon && children) && <Spacer x={1} />}
      <Text
        bold
        {...textProps}
        style={[
          ...baseStyleTextFn(props),
          { color: GradientColors.rainbow.text },
        ]}
      >
        {children}
      </Text>
    </AnimatedPressable>
  );
};
