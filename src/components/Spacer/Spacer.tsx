import clsx from "clsx";
import React from "react";

interface SpacerProps {
  size: 1 | 2 | 4 | 8;
  axis?: "vertical" | "horizontal";
  style?: React.CSSProperties;
}

const Spacer: React.FC<SpacerProps> = ({ size, axis, style }) => {
  return (
    <div
      style={{
        width: "1px",
        height: "1px",
        ...style,
      }}
      className={clsx(
        "inline-block",
        axis !== "horizontal" && `h-${size}`,
        axis !== "vertical" && `w-${size}`
      )}
    />
  );
};

export default Spacer;
