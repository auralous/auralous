import type { ThemeColorKey } from "@/styles/colors";
import { Colors } from "@/styles/colors";
import { Font, fontMetrics, fontPropsFn } from "@/styles/fonts";
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
  bold?: boolean;
  fontWeight?: "bold" | "medium" | "normal";
  italic?: boolean;
  style?: StyleProp<TextStyle>;
  color?: ThemeColorKey;
  align?: TextStyle["textAlign"];
  size?: keyof typeof sizes;
  numberOfLines?: number;
  lineGapScale?: number;
  selectable?: boolean;
}

export const useStyle = (props: TextProps & { level?: number }) => {
  if (props.bold) props.fontWeight = "bold";
  return useMemo<TextStyle>(() => {
    const fontSize = props.size
      ? sizes[props.size]
      : props.level
      ? levelSize[props.level - 1]
      : sizes.md;
    return StyleSheet.create({
      // eslint-disable-next-line react-native/no-unused-styles
      text: {
        ...fontPropsFn(
          Font.NotoSans,
          props.fontWeight || "normal",
          props.italic
        ),
        color: Colors[props.color || "text"] as string,
        textAlign: props.align,
        ...capsize({
          fontMetrics: fontMetrics[Font.NotoSans],
          fontSize: fontSize,
          lineGap: (props.lineGapScale ?? 0.5) * fontSize,
        }),
      },
    }).text;
  }, [
    props.align,
    props.fontWeight,
    props.italic,
    props.size,
    props.level,
    props.color,
    props.lineGapScale,
  ]);
};

export const Text: FC<TextProps> = ({
  children,
  numberOfLines,
  selectable,
  ...props
}) => {
  const style = useStyle(props);
  return (
    <RNText
      selectable={selectable}
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
      {({ pressed, hovered }) => (
        <RNText
          numberOfLines={numberOfLines}
          style={[
            StyleSheet.compose(style, props.style),
            (pressed || hovered) && { color: Colors[activeColor] as string },
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
