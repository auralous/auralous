import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import type { ThemeColorKey } from "@/styles/colors";
import type { FC } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useStyles } from "./styles";
import type { BaseButtonProps } from "./types";

export const TextButton: FC<BaseButtonProps & { color?: ThemeColorKey }> = ({
  color,
  ...props
}) => {
  const styles = useStyles(props);

  const { icon, children, onPress, accessibilityLabel, disabled, textProps } =
    props;

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={StyleSheet.compose(styles.base, props.style)}>
        {icon}
        {!!(icon && children) && <Spacer x={1} />}
        <Text
          color={color}
          bold
          {...textProps}
          style={StyleSheet.compose(styles.text, textProps?.style)}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
