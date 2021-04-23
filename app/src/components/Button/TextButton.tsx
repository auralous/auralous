import { Text } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface TextButtonProps {
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
  },
  baseText: {
    fontWeight: "600",
    fontSize: 14,
  },
});

export const TextButton: React.FC<TextButtonProps> = ({
  icon,
  children,
  onPress,
  accessibilityLabel,
  color = "control",
  disabled,
}) => {
  const colors = useColors();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
    >
      {({ pressed }) => (
        <View style={[styles.base, disabled && { opacity: 0.5 }]}>
          {icon}
          <Text
            bold
            style={[
              styles.baseText,
              {
                color: pressed
                  ? colors[`${color}Dark` as keyof typeof colors]
                  : colors[color as keyof typeof colors],
              },
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
