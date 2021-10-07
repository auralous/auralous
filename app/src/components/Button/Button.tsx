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
  variant?: "primary" | "filled";
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
    if (variant === "primary") {
      return {
        backgroundColor: withTiming(
          !disabled && pressed.value ? Colors.primaryDark : Colors.primary
        ) as unknown as ColorValue,
        borderWidth: 0,
        borderColor: Colors.none,
      };
    }
    if (variant === "filled") {
      return {
        backgroundColor: withTiming(
          !disabled && pressed.value ? Colors.textSecondary : Colors.text
        ) as unknown as ColorValue,
        borderWidth: 0,
        borderColor: Colors.none,
      };
    }

    return {
      backgroundColor: Colors.none,
      borderWidth: 1.5,
      borderColor: withTiming(
        !disabled && pressed.value ? Colors.controlDark : Colors.control
      ) as unknown as ColorValue,
    };
  }, [variant]);

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
