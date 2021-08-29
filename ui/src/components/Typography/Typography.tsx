import type { ThemeColorKey } from "@/styles";
import { Colors, Font, fontWithWeight } from "@/styles";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { Linking, Pressable, StyleSheet, Text as RNText } from "react-native";
import capsize from "react-native-capsize";

const levelSize = [40, 36, 30, 24, 20, 18];

const sizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  "2xl": 20,
};

export interface TextProps {
  bold?: boolean | "medium";
  italic?: boolean;
  style?: StyleProp<TextStyle>;
  color?: ThemeColorKey;
  align?: TextStyle["textAlign"];
  size?: keyof typeof sizes;
  numberOfLines?: number;
  lineGapScale?: number;
}

// https://seek-oss.github.io/capsize/
const fontMetrics = {
  capHeight: 2048,
  ascent: 2728,
  descent: -680,
  lineGap: 0,
  unitsPerEm: 2816,
};

export const useStyle = (props: TextProps & { level?: number }) =>
  useMemo<TextStyle>(() => {
    const fontSize = props.size
      ? sizes[props.size]
      : props.level
      ? levelSize[props.level - 1]
      : sizes.md;
    return {
      ...fontWithWeight(
        Font.Inter,
        props.bold ? (props.bold === "medium" ? "medium" : "bold") : "normal"
      ),
      fontStyle: props.italic ? "italic" : "normal",
      textAlign: props.align,
      color: Colors[props.color || "text"] as string,
      ...capsize({
        fontMetrics,
        fontSize: fontSize,
        lineGap: (props.lineGapScale ?? 0.5) * fontSize,
      }),
    };
  }, [
    props.align,
    props.bold,
    props.italic,
    props.size,
    props.level,
    props.color,
    props.lineGapScale,
  ]);

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
