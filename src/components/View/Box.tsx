import { forwardRef } from "react";
import {
  AccessibilityRole,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import {
  Color,
  ImplicitSize,
  JustifyContent,
  Size,
  size,
  stylesBackground,
  stylesBorderRadius,
  stylesHeight,
  stylesJustifyContent,
  stylesMinHeight,
  stylesMinWidth,
  stylesPaddingHorizontal,
  stylesPaddingVertical,
  stylesWidth,
} from "styles";
import { AlignItems, stylesAlignItems } from "styles/flex";

const absolutePos: Record<ImplicitSize, Size> = {
  xs: 1,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
};

interface BoxProps {
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
  row: boolean;
  flex: number;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  padding: ImplicitSize;
  paddingX: ImplicitSize;
  paddingY: ImplicitSize;
  width: Size;
  height: Size;
  minWidth: keyof typeof stylesMinWidth;
  minHeight: keyof typeof stylesMinHeight;
  fullWidth: boolean;
  fullHeight: boolean;
  rounded: keyof typeof stylesBorderRadius;
  wrap: boolean;
  absolute: Partial<{
    top: ImplicitSize | 0;
    left: ImplicitSize | 0;
    right: ImplicitSize | 0;
    bottom: ImplicitSize | 0;
  }>;
  gap: ImplicitSize;
  accessibilityRole: AccessibilityRole;
  backgroundColor: Color;
}

const styles = StyleSheet.create({
  wrap: { flexWrap: "wrap" },
  row: { flexDirection: "row" },
});

const Box = forwardRef<View, Partial<BoxProps>>(function Box(
  {
    row,
    children,
    flex,
    wrap,
    justifyContent,
    alignItems,
    padding,
    paddingX = padding,
    paddingY = padding,
    width,
    height,
    rounded,
    fullWidth,
    minWidth,
    minHeight,
    fullHeight,
    style,
    accessibilityRole,
    backgroundColor,
    absolute,
    gap,
  },
  ref
) {
  return (
    <View
      accessibilityRole={accessibilityRole}
      ref={ref}
      style={[
        row && styles.row,
        wrap && styles.wrap,
        justifyContent && stylesJustifyContent[justifyContent],
        alignItems && stylesAlignItems[alignItems],
        backgroundColor && stylesBackground[backgroundColor],
        paddingX && stylesPaddingHorizontal[paddingX],
        paddingY && stylesPaddingVertical[paddingY],
        width !== undefined && stylesWidth[width],
        height !== undefined && stylesHeight[height],
        flex !== undefined && { flex },
        rounded && stylesBorderRadius[rounded],
        minWidth !== undefined && stylesMinWidth[minWidth],
        minHeight !== undefined && stylesMinHeight[minHeight],
        fullWidth && stylesWidth.full,
        fullHeight && stylesHeight.full,
        absolute && {
          position: "absolute",
          top: absolute.top ? size(absolutePos[absolute.top]) : absolute.top,
          left: absolute.left
            ? size(absolutePos[absolute.left])
            : absolute.left,
          right: absolute.right
            ? size(absolutePos[absolute.right])
            : absolute.right,
          bottom: absolute.bottom
            ? size(absolutePos[absolute.bottom])
            : absolute.bottom,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
  // return (
  //   <div
  //     role={accessibilityRole}
  //     className={clsx(
  //       "flex",
  //       minWidth !== undefined && `min-w-${minWidth}`,
  //       maxWidth && `max-w-${maxWidth}`,
  //       minHeight !== undefined && `min-h-${minHeight}`,
  //       rounded && `rounded-${rounded}`,
  //       fullWidth && `w-full`,
  //       fullHeight && `h-full`,
  //       position,
  //       gap && (!row || wrap) && `space-y-${gapMap[gap]}`,
  //       gap && (!!row || wrap) && `space-x-${gapMap[gap]}`,
  //       flex && `flex-${flex}`,
  //       backgroundColor && `bg-${backgroundColor}`,
  //       top !== undefined && `top-${top}`,
  //       right !== undefined && `right-${right}`,
  //       left !== undefined && `left-${left}`,
  //       bottom !== undefined && `bottom-${bottom}`
  //     )}
  //     style={style}
  //     ref={ref}
  //   >
  //     {children}
  //   </div>
  // );
});

export default Box;
