import clsx from "clsx";

interface BoxProps {
  row?: boolean;
  flex?: number;
  justifyContent?: "start" | "end" | "center" | "between" | "around" | "evenly";
  alignItems?: "stretch" | "start" | "end" | "center" | "baseline";
  padding: 1 | 2 | 4 | 8 | 10 | 12;
  paddingX: 1 | 2 | 4 | 8 | 10 | 12;
  paddingY: 1 | 2 | 4 | 8 | 10 | 12;
  width: 1 | 2 | 4 | 8 | 10 | 12;
  maxWidth: "lg" | "xl" | "2xl";
  height: 1 | 2 | 4 | 8 | 10 | 12;
  fullWidth: boolean;
  fullHeight: boolean;
  rounded: "lg" | "full";
  wrap?: boolean;
  position?: "relative" | "absolute";
}

const Box: React.FC<Partial<BoxProps>> = ({
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
  maxWidth,
  fullHeight,
  position,
}) => {
  return (
    <div
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
        maxWidth && `max-w-${maxWidth}`,
        height && `h-${height}`,
        rounded && `rounded-${rounded}`,
        fullWidth && `w-full`,
        fullHeight && `h-full`,
        position
      )}
      style={flex ? { flex } : undefined}
    >
      {children}
    </div>
  );
};

export default Box;
