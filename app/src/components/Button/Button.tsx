import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { useSharedValuePressed } from "@/styles/animation";
import { Colors } from "@/styles/colors";
import type { FC } from "react";
import { useMemo } from "react";
import type { ColorValue, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useStyles } from "./styles";
import type { BaseButtonProps } from "./types";

export interface ButtonProps extends BaseButtonProps {
  variant?: "primary" | "filled" | "text";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: FC<ButtonProps> = (props) => {
  const {
    icon,
    children,
    onPress,
    accessibilityLabel,
    variant,
    disabled,
    textProps,
  } = props;

  const styles = useStyles(props);

  const [pressed, pressedProps] = useSharedValuePressed();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => {
    if (disabled) {
      return {
        backgroundColor: Colors.control,
        borderWidth: 0,
        opacity: 0.4,
      };
    }
    if (variant === "text") {
      return {
        backgroundColor: "transparent",
        borderWidth: 0,
        opacity: withTiming(pressed.value ? 0.7 : 1),
      };
    }
    if (variant === "primary") {
      return {
        backgroundColor: withTiming(
          pressed.value ? Colors.primaryDark : Colors.primary
        ) as unknown as ColorValue,
        borderWidth: 0,
        opacity: 1,
      };
    }
    if (variant === "filled") {
      return {
        backgroundColor: withTiming(
          pressed.value ? Colors.textSecondary : Colors.text
        ) as unknown as ColorValue,
        borderWidth: 0,
        opacity: 1,
      };
    }
    return {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: withTiming(
        pressed.value ? Colors.controlDark : Colors.control
      ) as unknown as ColorValue,
      opacity: 1,
    };
  }, [variant, disabled]);

  const textColor = useMemo(() => {
    if (disabled) return Colors.text;
    if (variant === "primary") return Colors.primaryText;
    if (variant === "filled") return Colors.backgroundSecondary;
    return Colors.text;
  }, [variant, disabled]);

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      {...pressedProps}
      style={[styles.base, animatedStyles, props.style]}
    >
      {icon}
      {!!(icon && children) && <Spacer x={1} />}
      <Text
        bold
        {...textProps}
        style={[
          StyleSheet.compose(styles.text, textProps?.style),
          { color: textColor },
        ]}
      >
        {children}
      </Text>
    </AnimatedPressable>
  );
};
