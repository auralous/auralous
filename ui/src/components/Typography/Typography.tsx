import { Colors, Font, Size, ThemeColorKey } from "@/styles";
import { FC, useCallback, useMemo } from "react";
import {
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextStyle,
} from "react-native";

const levelSize = [40, 36, 30, 24, 20, 18];

const sizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  "2xl": 20,
};

interface TextProps {
  bold?: boolean | "medium";
  italic?: boolean;
  style?: StyleProp<TextStyle>;
  color?: ThemeColorKey;
  align?: TextStyle["textAlign"];
  size?: keyof typeof sizes;
  numberOfLines?: number;
}

export const useStyle = (props: TextProps & { level?: number }) =>
  useMemo<TextStyle>(
    () => ({
      fontFamily: props.bold
        ? props.bold === "medium"
          ? Font.Medium
          : Font.Bold
        : Font.Normal,
      fontStyle: props.italic ? "italic" : undefined,
      textAlign: props.align,
      fontSize: props.size
        ? sizes[props.size]
        : props.level
        ? levelSize[props.level - 1]
        : Size[4],
      color: Colors[props.color || "text"] as string,
    }),
    [
      props.align,
      props.bold,
      props.italic,
      props.size,
      props.level,
      props.color,
    ]
  );

export const Text: FC<TextProps> = ({ children, numberOfLines, ...props }) => {
  const style = useStyle(props);
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={StyleSheet.compose(style, props.style)}
    >
      {children}
    </RNText>
  );
};

interface TextLinkProps {
  color?: ThemeColorKey;
  activeColor?: ThemeColorKey;
  href: string;
}

export const TextLink: FC<TextProps & TextLinkProps> = ({
  children,
  numberOfLines,
  href,
  activeColor = "primaryDark",
  ...props
}) => {
  if (!props.color) props.color = "primary";
  const style = useStyle(props);
  const onPress = useCallback(() => Linking.openURL(href), [href]);
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <RNText
          numberOfLines={numberOfLines}
          style={[
            style,
            props.style,
            pressed && { color: Colors[activeColor] as string },
          ]}
        >
          {children}
        </RNText>
      )}
    </Pressable>
  );
};

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading: FC<TextProps & HeadingProps> = ({
  children,
  numberOfLines,
  ...props
}) => {
  props.bold = props.bold ?? true;
  const style = useStyle(props);
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={StyleSheet.compose(style, props.style)}
    >
      {children}
    </RNText>
  );
};
