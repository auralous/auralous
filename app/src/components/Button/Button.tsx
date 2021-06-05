import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import { useSharedValuePressed } from "@/utils/animation";
import React, { useMemo } from "react";
import { ColorValue, Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface ButtonProps {
  onPress?(): void;
  accessibilityLabel?: string;
  variant?: "primary" | "filled";
  icon?: React.ReactNode;
  children?: string;
  disabled?: boolean;
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Size[2],
    paddingHorizontal: Size[4],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Size[16],
  },
  iconOnly: {
    paddingHorizontal: Size[2],
  },
  baseText: {
    fontWeight: "600",
    fontSize: 14,
  },
});

export const Button: React.FC<ButtonProps> = ({
  icon,
  children,
  onPress,
  accessibilityLabel,
  variant,
  disabled,
}) => {
  const colors = useColors();

  const [pressed, pressedProps] = useSharedValuePressed();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => {
    if (variant === "primary") {
      return {
        backgroundColor: withTiming(
          !disabled && pressed.value ? colors.primaryDark : colors.primary,
          { duration: 200 }
        ) as unknown as ColorValue,
      };
    }
    if (variant === "filled") {
      return {
        backgroundColor: withTiming(
          !disabled && pressed.value ? colors.textSecondary : colors.text,
          { duration: 200 }
        ) as unknown as ColorValue,
      };
    }

    return {
      backgroundColor: "transparent",
      borderColor: withTiming(
        !disabled && pressed.value ? colors.controlDark : colors.control,
        { duration: 200 }
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
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      {...pressedProps}
    >
      <Animated.View
        style={[
          styles.base,
          !!icon && !children && styles.iconOnly,
          animatedStyles,
          disabled && { opacity: 0.5 },
        ]}
      >
        {icon}
        {!!(icon && children) && <Spacer x={1} />}
        <Text bold style={[styles.baseText, { color: textColor }]}>
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
};
