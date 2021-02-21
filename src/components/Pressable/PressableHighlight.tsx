import clsx from "clsx";

interface PressableHighlightProps {
  fullWidth?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  shape?: "circle" | "round";
}

const PressableHighlight: React.FC<PressableHighlightProps> = ({
  children,
  onPress,
  accessibilityLabel,
  fullWidth,
  shape,
}) => {
  return (
    <button
      aria-label={accessibilityLabel}
      onClick={onPress}
      className={clsx(
        "focus:outline-none p-2 inline-flex items-center hover:bg-background-secondary focus:bg-background-secondary",
        fullWidth && "w-full",
        shape === "circle" ? "rounded-full" : "rounded-lg"
      )}
    >
      {children}
    </button>
  );
};

export default PressableHighlight;
