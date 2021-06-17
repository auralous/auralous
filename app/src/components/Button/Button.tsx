import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { useColors } from "@/styles";
import { useSharedValuePressed } from "@/utils/animation";
import React, { useMemo } from "react";
import { ColorValue, Pressable, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { baseStyleFn, baseStyleTextFn } from "./styles";
import { BaseButtonProps } from "./types";

interface ButtonProps extends BaseButtonProps {
  variant?: "primary" | "filled";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = (props) => {
  const { icon, children, onPress, accessibilityLabel, variant, disabled } =
    props;

  const colors = useColors();

  const [pressed, pressedProps] = useSharedValuePressed();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => {
    if (variant === "primary") {
      return {
        backgroundColor: withTiming(
          !disabled && pressed.value ? colors.primaryDark : colors.primary
        ) as unknown as ColorValue,
      };
    }
    if (variant === "filled") {
      return {
        backgroundColor: withTiming(
          !disabled && pressed.value ? colors.textSecondary : colors.text
        ) as unknown as ColorValue,
      };
    }

    return {
      backgroundColor: "transparent",
      borderColor: withTiming(
        !disabled && pressed.value ? colors.controlDark : colors.control
      ) as unknown as ColorValue,
      borderWidth: 1.5,
    };
  });

  const textColor = useMemo(() => {
    if (variant === "primary") return colors.primaryText;
    if (variant === "filled") return colors.backgroundSecondary;
    return colors.text;
  }, [variant, colors]);

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      {...pressedProps}
      style={[...baseStyleFn(props), animatedStyles]}
    >
      {icon}
      {!!(icon && children) && <Spacer x={1} />}
      <Text bold style={[...baseStyleTextFn(props), { color: textColor }]}>
        {children}
      </Text>
    </AnimatedPressable>
  );
};
