import { Text } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import { useSharedValuePressed } from "@/utils/animation";
import React from "react";
import { ColorValue, Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface ButtonProps {
  onPress(): void;
  accessibilityLabel?: string;
  color?: "primary" | "danger";
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
  color = "control",
  disabled,
}) => {
  const colors = useColors();

  const [pressed, pressedProps] = useSharedValuePressed();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => {
    return {
      backgroundColor: (withTiming(
        pressed.value
          ? colors[`${color}Dark` as keyof typeof colors]
          : colors[color as keyof typeof colors],
        { duration: 200 }
      ) as unknown) as ColorValue,
    };
  });

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
          disabled
            ? {
                opacity: 0.5,
                backgroundColor: colors[color as keyof typeof colors],
              }
            : animatedStyles,
        ]}
      >
        {icon}
        <Text
          bold
          style={[
            styles.baseText,
            { color: colors[`${color}Text` as keyof typeof colors] },
          ]}
        >
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
};
