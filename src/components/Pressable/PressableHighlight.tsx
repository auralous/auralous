import clsx from "clsx";
import { CSSProperties, forwardRef, ReactNode } from "react";

interface PressableHighlightProps {
  fullWidth?: boolean;
  onPress?: () => void;
  onClick?: () => void;
  accessibilityLabel?: string;
  shape?: "circle" | "round";
  style?: CSSProperties;
  children?: ReactNode;
}

const PressableHighlight = forwardRef<
  HTMLButtonElement,
  PressableHighlightProps
>(function PressableHighlight(
  { children, onPress, onClick, accessibilityLabel, fullWidth, shape, style },
  ref
) {
  return (
    <button
      aria-label={accessibilityLabel}
      onClick={onPress || onClick}
      className={clsx(
        "focus:outline-none p-2 inline-flex items-center hover:bg-background-secondary focus:bg-background-secondary",
        fullWidth && "w-full",
        shape === "circle" ? "rounded-full" : "rounded-lg"
      )}
      style={style}
      ref={ref}
    >
      {children}
    </button>
  );
});

export default PressableHighlight;
