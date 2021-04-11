import { Text } from "components/Typography";
import React, { useMemo } from "react";
import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Size, useColors } from "styles";

interface ButtonProps {
  onPress: () => void;
  accessibilityLabel?: string;
  color?: "primary" | "danger";
  icon?: React.ReactNode;
  children?: string;
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

const pressableStylesFn = (
  color: string,
  activeColor: string
): Record<"base" | "pressed", StyleProp<ViewStyle>> => {
  return {
    base: {
      backgroundColor: color,
    },
    pressed: {
      backgroundColor: activeColor,
    },
  };
};

const textStylesFn = (
  colorLabel: string
): Record<"base", StyleProp<TextStyle>> => {
  return {
    base: { color: colorLabel },
  };
};

export const Button: React.FC<ButtonProps> = ({
  icon,
  children,
  onPress,
  accessibilityLabel,
  color = "control",
}) => {
  const colors = useColors();

  const pressableStyle = useMemo<
    (state: PressableStateCallbackType) => StyleProp<ViewStyle>
  >(() => {
    const pressable = pressableStylesFn(
      colors[color as keyof typeof colors],
      colors[`${color}Dark` as keyof typeof colors]
    );
    return ({ pressed }) => [
      styles.base,
      pressable.base,
      pressed && pressable.pressed,
    ];
  }, [color, colors]);

  const textStyle = useMemo<
    (state: PressableStateCallbackType) => StyleProp<TextStyle>
  >(() => {
    const text = textStylesFn(colors[`${color}Text` as keyof typeof colors]);
    return () => [styles.baseText, text.base];
  }, [color, colors]);

  return (
    <Pressable
      style={pressableStyle}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
    >
      {(state) => (
        <>
          {icon}
          <Text bold style={textStyle(state)}>
            {children}
          </Text>
        </>
      )}
    </Pressable>
  );
};
