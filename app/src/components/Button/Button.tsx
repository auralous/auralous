import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { useAnimPressedProps } from "@/styles/animation";
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

  const [pressed, pressedProps] = useAnimPressedProps();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => {
    if (variant === "text") {
      return {
        backgroundColor: "transparent",
        opacity: withTiming(pressed.value && !disabled ? 0.7 : 1),
      };
    }
    if (variant === "primary") {
      return {
        backgroundColor: withTiming(
          pressed.value && !disabled ? Colors.primaryDark : Colors.primary
        ) as unknown as ColorValue,
      };
    }
    if (variant === "filled") {
      return {
        backgroundColor: withTiming(
          pressed.value && !disabled ? Colors.textSecondary : Colors.text
        ) as unknown as ColorValue,
      };
    }
    return {
      backgroundColor: withTiming(
        pressed.value && !disabled ? Colors.controlDark : Colors.control
      ) as unknown as ColorValue,
    };
  }, [variant, disabled]);

  const textColor = useMemo(() => {
    if (variant === "primary") return Colors.primaryText;
    if (variant === "filled") return Colors.backgroundSecondary;
    return Colors.text;
  }, [variant]);

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      {...pressedProps}
      style={[
        styles.base,
        animatedStyles,
        // eslint-disable-next-line react-native/no-inline-styles
        disabled && { opacity: 0.4 },
        props.style,
      ]}
    >
      {icon}
      {!!(icon && children) && <Spacer x={1} />}
      <Text
        bold
        {...textProps}
        style={[
          !textProps?.color && { color: textColor },
          StyleSheet.compose(styles.text, textProps?.style),
        ]}
      >
        {children}
      </Text>
    </AnimatedPressable>
  );
};
