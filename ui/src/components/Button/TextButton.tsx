import { Spacer } from "@auralous/ui/components/Spacer";
import { Text } from "@auralous/ui/components/Typography";
import { useColors } from "@auralous/ui/styles";
import { FC } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { baseStyleFn, baseStyleTextFn } from "./styles";
import { BaseButtonProps } from "./types";

interface TextButtonProps extends BaseButtonProps {
  color?: "primary";
}

export const TextButton: FC<TextButtonProps> = (props) => {
  const colors = useColors();

  const {
    icon,
    children,
    onPress,
    accessibilityLabel,
    color = "text",
    disabled,
    textProps,
  } = props;

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={baseStyleFn(props)}>
        {icon}
        {!!(icon && children) && <Spacer x={1} />}
        <Text
          bold
          {...textProps}
          style={[...baseStyleTextFn(props), { color: colors[color] }]}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
