import clsx from "clsx";
import React, { ReactNode } from "react";

interface ButtonProps {
  color?: "primary" | "success" | "danger";
  onPress?: () => void;
  title?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  type?: "button" | "submit" | "reset";
  externalLink?: string;
  size?: "small" | "medium";
  shape?: "circle" | "round";
  styling?: "link";
}

const Button: React.FC<ButtonProps> = ({
  type,
  color,
  onPress,
  title,
  icon,
  fullWidth,
  disabled,
  accessibilityLabel,
  externalLink,
  size,
  shape,
  styling,
}) => {
  const iconOnly = !!icon && !title;
  const className = clsx(
    "btn",
    color && `btn-${color}`,
    fullWidth && "w-full",
    size === "small" && `${iconOnly ? "" : "px-2 py-1 "}text-xs`,
    size === "medium" && `${iconOnly ? "" : "px-3 py-1.5 "}text-sm`,
    iconOnly && "p-0",
    iconOnly &&
      (size === "small"
        ? "w-6 h-6"
        : size === "medium"
        ? "h-8 w-8"
        : "h-10 w-10"),
    !!icon && !!title && "space-x-2",
    shape === "circle" && "rounded-full",
    styling === "link" && `bg-transparent text-${color} hover:text-opacity-75`
  );

  if (externalLink)
    return (
      <a
        href={externalLink}
        aria-label={accessibilityLabel}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {icon}
        {title}
      </a>
    );

  return (
    <button
      aria-label={accessibilityLabel}
      onClick={onPress}
      className={className}
      disabled={disabled}
      type={type}
    >
      {icon}
      {title}
    </button>
  );
};

export default Button;
