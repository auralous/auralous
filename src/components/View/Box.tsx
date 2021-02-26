import clsx from "clsx";
import { CSSProperties, forwardRef } from "react";

type LengthUnit = 0 | 1 | 2 | 4 | 8 | 10 | 12 | 16;

interface BoxProps {
  children: React.ReactNode;
  style: CSSProperties;
  row: boolean;
  flex: number;
  justifyContent: "start" | "end" | "center" | "between" | "around" | "evenly";
  alignItems: "stretch" | "start" | "end" | "center" | "baseline";
  padding: LengthUnit;
  paddingX: LengthUnit;
  paddingY: LengthUnit;
  width: LengthUnit;
  minWidth: 0;
  maxWidth: "lg" | "xl" | "2xl" | "4xl";
  minHeight: 0;
  height: LengthUnit;
  top: LengthUnit;
  right: LengthUnit;
  bottom: LengthUnit;
  left: LengthUnit;
  fullWidth: boolean;
  fullHeight: boolean;
  rounded: "lg" | "full";
  wrap: boolean;
  position?: "relative" | "absolute";
  gap: "xs" | "sm" | "md" | "lg" | "xl";
  accessibilityRole: string;
  backgroundColor:
    | "background"
    | "background-secondary"
    | "background-tertiary"
    | "background-bar"
    | "primary"
    | "primary-dark";
}

const gapMap: Record<BoxProps["gap"], number> = {
  xs: 1,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
};

const Box = forwardRef<HTMLDivElement, Partial<BoxProps>>(function Box(
  {
    row,
    children,
    flex,
    wrap,
    justifyContent = "start",
    alignItems = "stretch",
    padding,
    paddingX,
    paddingY,
    width,
    height,
    rounded,
    fullWidth,
    minWidth,
    maxWidth,
    minHeight,
    fullHeight,
    position,
    gap,
    style,
    accessibilityRole,
    backgroundColor,
    top,
    left,
    bottom,
    right,
  },
  ref
) {
  return (
    <div
      role={accessibilityRole}
      className={clsx(
        "flex",
        row ? "flex-row" : "flex-col",
        wrap && "flex-wrap",
        justifyContent && `justify-${justifyContent}`,
        alignItems && `items-${alignItems}`,
        padding && `p-${padding}`,
        paddingX && `px-${paddingX}`,
        paddingY && `py-${paddingY}`,
        width && `w-${width}`,
        minWidth !== undefined && `min-w-${minWidth}`,
        maxWidth && `max-w-${maxWidth}`,
        height && `h-${height}`,
        minHeight !== undefined && `min-h-${minHeight}`,
        rounded && `rounded-${rounded}`,
        fullWidth && `w-full`,
        fullHeight && `h-full`,
        position,
        gap && (!row || wrap) && `space-y-${gapMap[gap]}`,
        gap && (!!row || wrap) && `space-x-${gapMap[gap]}`,
        flex && `flex-${flex}`,
        backgroundColor && `bg-${backgroundColor}`,
        top !== undefined && `top-${top}`,
        right !== undefined && `right-${right}`,
        left !== undefined && `left-${left}`,
        bottom !== undefined && `bottom-${bottom}`
      )}
      style={style}
      ref={ref}
    >
      {children}
    </div>
  );
});

export default Box;
