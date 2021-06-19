import {
  Font,
  IColors,
  Size,
  ThemeColor,
  useColors
} from "@auralous/ui/styles";
import { FC } from "react";
import {
  Linking,
  Pressable,
  RecursiveArray,
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextStyle
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
  color?: ThemeColor;
  align?: TextStyle["textAlign"];
  size?: keyof typeof sizes;
  numberOfLines?: number;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "Inter-Regular",
    fontSize: Size[4],
  },
});

const commonStyleFn = (
  colors: IColors,
  props: TextProps
): RecursiveArray<TextStyle> => {
  const style: TextStyle = {
    fontFamily: props.bold
      ? props.bold === "medium"
        ? Font.Medium
        : Font.Bold
      : undefined,
    fontStyle: props.italic ? "italic" : undefined,
    textAlign: props.align,
    fontSize: props.size ? sizes[props.size] : undefined,
    color: colors[props.color || "text"] as string,
  };
  if (props.style) {
    return (
      Array.isArray(props.style)
        ? [style, ...props.style]
        : [style, props.style]
    ) as RecursiveArray<TextStyle>;
  }
  return [style];
};

export const Text: FC<TextProps> = ({ children, numberOfLines, ...props }) => {
  const colors = useColors();
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[styles.base, ...commonStyleFn(colors, props)]}
    >
      {children}
    </RNText>
  );
};

interface TextLinkProps {
  color?: ThemeColor;
  activeColor?: ThemeColor;
  href: string;
}

export const TextLink: FC<TextProps & TextLinkProps> = ({
  children,
  numberOfLines,
  href,
  color = "primary",
  activeColor = "primaryDark",
  ...props
}) => {
  const colors = useColors();
  return (
    <Pressable onPress={() => Linking.openURL(href)}>
      {({ pressed }) => (
        <RNText
          numberOfLines={numberOfLines}
          style={[
            styles.base,
            ...commonStyleFn(colors, { ...props, color }),
            pressed && { color: colors[activeColor] as string },
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
  level,
  numberOfLines,
  ...props
}) => {
  const colors = useColors();
  props.bold = props.bold ?? true;
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[
        styles.base,
        ...commonStyleFn(colors, props),
        { fontSize: levelSize[level - 1] },
      ]}
    >
      {children}
    </RNText>
  );
};
