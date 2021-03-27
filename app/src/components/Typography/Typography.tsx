import React from "react";
import { StyleProp, StyleSheet, Text as RNText, TextStyle } from "react-native";
import { Size, ThemeColor, useColors } from "styles";

const levelSize = [48, 36, 30, 24, 20, 18];

const sizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
};

interface TextProps {
  bold?: boolean;
  italic?: boolean;
  style?: StyleProp<TextStyle>;
  color?: ThemeColor;
  align?: TextStyle["textAlign"];
  size?: keyof typeof sizes;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "Inter-Regular",
    fontSize: Size[4],
  },
});

const commonStyleFn = (
  colors: Record<ThemeColor, string>,
  props: TextProps
): TextStyle[] => [
  {
    ...(props.bold && { fontFamily: "Inter-Bold" }),
    ...(props.italic && { fontStyle: "italic" }),
    ...(props.align && { textAlign: props.align }),
    ...(props.size && { fontSize: sizes[props.size] }),
    color: colors[props.color || "text"],
  },
  // @ts-ignore
  ...(Array.isArray(props.style) ? props.style : [props.style]),
];

export const Text: React.FC<TextProps> = ({ children, ...props }) => {
  const colors = useColors();
  return (
    <RNText style={[styles.base, ...commonStyleFn(colors, props)]}>
      {children}
    </RNText>
  );
};

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading: React.FC<TextProps & HeadingProps> = ({
  children,
  level,
  ...props
}) => {
  const colors = useColors();
  props.bold = props.bold ?? true;
  return (
    <RNText
      style={[
        styles.base,
        { fontSize: levelSize[level - 1] },
        ...commonStyleFn(colors, props),
      ]}
    >
      {children}
    </RNText>
  );
};
