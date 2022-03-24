import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors } from "@/styles/colors";
import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import type { ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";
import { useStyles } from "./styles";
import type { BaseButtonProps } from "./types";

export interface ButtonProps extends BaseButtonProps {
  variant?: "primary" | "filled" | "text";
}

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

  const [pressed, setPressed] = useState(false);
  const onPressIn = useCallback(() => setPressed(true), []);
  const onPressOut = useCallback(() => setPressed(false), []);

  const animatedStyles = useMemo<ViewStyle>(() => {
    if (variant === "text") {
      return {
        backgroundColor: "transparent",
        opacity: pressed && !disabled ? 0.7 : 1,
      };
    }
    if (variant === "primary") {
      return {
        backgroundColor:
          pressed && !disabled ? Colors.primaryDark : Colors.primary,
      };
    }
    if (variant === "filled") {
      return {
        backgroundColor:
          pressed && !disabled ? Colors.textSecondary : Colors.text,
      };
    }
    return {
      backgroundColor:
        pressed && !disabled ? Colors.controlDark : Colors.control,
    };
  }, [pressed, variant, disabled]);

  const textColor = useMemo(() => {
    if (variant === "primary") return Colors.primaryText;
    if (variant === "filled") return Colors.backgroundSecondary;
    return Colors.text;
  }, [variant]);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
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
        selectable={false}
        bold
        {...textProps}
        style={[
          !textProps?.color && { color: textColor },
          StyleSheet.compose(styles.text, textProps?.style),
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
};
