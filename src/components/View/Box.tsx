import clsx from "clsx";
import { CSSProperties, forwardRef } from "react";

interface BoxProps {
  children: React.ReactNode;
  style: CSSProperties;
  row: boolean;
  flex: number;
  justifyContent: "start" | "end" | "center" | "between" | "around" | "evenly";
  alignItems: "stretch" | "start" | "end" | "center" | "baseline";
  padding: 1 | 2 | 4 | 8 | 10 | 12;
  paddingX: 1 | 2 | 4 | 8 | 10 | 12;
  paddingY: 1 | 2 | 4 | 8 | 10 | 12;
  width: 1 | 2 | 4 | 8 | 10 | 12;
  minWidth: 0 | "full";
  maxWidth: "lg" | "xl" | "2xl" | "4xl";
  minHeight: 0 | "full";
  height: 1 | 2 | 4 | 8 | 10 | 12;
  fullWidth: boolean;
  fullHeight: boolean;
  rounded: "lg" | "full";
  wrap: boolean;
  position?: "relative" | "absolute";
  gap: "xs" | "sm" | "md" | "lg" | "xl";
  accessibilityRole: string;
  backgroundColor:
    | "background-secondary"
    | "background-tertiary"
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
        backgroundColor && `bg-${backgroundColor}`
      )}
      style={style}
      ref={ref}
    >
      {children}
    </div>
  );
});

export default Box;
