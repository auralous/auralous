import clsx from "clsx";

interface SpacerProps {
  size: 1 | 2 | 4 | 6 | 8 | 12;
  axis?: "vertical" | "horizontal";
  style?: React.CSSProperties;
}

const Spacer: React.FC<SpacerProps> = ({ size, axis, style }) => {
  return (
    <span
      style={{
        width: "1px",
        height: "1px",
        ...style,
      }}
      className={clsx(
        axis === "vertical" ? "block" : "inline-block", // fix the ghost whitespace
        axis !== "horizontal" && `h-${size}`,
        axis !== "vertical" && `w-${size}`
      )}
    />
  );
};

export default Spacer;
