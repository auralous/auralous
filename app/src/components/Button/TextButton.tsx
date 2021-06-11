import { Text } from "@/components/Typography";
import { useColors } from "@/styles";
import React from "react";
import { ColorValue, Pressable, View } from "react-native";
import { Spacer } from "../Spacer";
import { baseStyleFn, baseStyles } from "./styles";
import { BaseButtonProps } from "./types";

interface TextButtonProps extends BaseButtonProps {
  color?: "primary" | "danger";
}

export const TextButton: React.FC<TextButtonProps> = (props) => {
  const colors = useColors();
  const {
    icon,
    children,
    onPress,
    accessibilityLabel,
    color = "control",
    disabled,
  } = props;
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
    >
      {({ pressed }) => (
        <View style={baseStyleFn(props)}>
          {icon}
          {!!(icon && children) && <Spacer x={1} />}
          <Text
            bold
            style={[
              baseStyles.text,
              {
                color: (pressed
                  ? colors[`${color}Dark` as keyof typeof colors]
                  : colors[color as keyof typeof colors]) as ColorValue,
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
