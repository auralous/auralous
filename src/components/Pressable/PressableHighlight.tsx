import clsx from "clsx";
import React from "react";

interface PressableHighlightProps {
  fullWidth?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}

const PressableHighlight: React.FC<PressableHighlightProps> = ({
  children,
  onPress,
  accessibilityLabel,
  fullWidth,
}) => {
  return (
    <button
      aria-label={accessibilityLabel}
      onClick={onPress}
      className={clsx(
        "focus:outline-none p-2 inline-flex items-center rounded-lg hover:bg-background-secondary focus:bg-background-secondary",
        fullWidth && "w-full"
      )}
    >
      {children}
    </button>
  );
};

export default PressableHighlight;
