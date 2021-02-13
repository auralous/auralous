import clsx from "clsx";
import React, { forwardRef, ReactNode } from "react";

interface ButtonProps {
  color?: "primary" | "success" | "danger" | "foreground";
  onPress?: () => void;
  title?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  type?: "button" | "submit" | "reset";
  asLink?: string | boolean;
  size?: "small" | "medium" | "large";
  shape?: "circle" | "round";
  styling?: "link";
  href?: string;
}

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  function Button(
    {
      type,
      color,
      onPress,
      // @ts-ignore: This is only used for next/link
      onClick,
      title,
      icon,
      fullWidth,
      disabled,
      accessibilityLabel,
      asLink,
      size,
      shape,
      styling,
      href,
    },
    ref
  ) {
    const iconOnly = !!icon && !title;
    const className = clsx(
      "btn",
      color && `btn-${color}`,
      fullWidth && "w-full",
      size === "small" && `${iconOnly ? "" : "px-2 py-1 "}text-xs`,
      size === "medium" && `${iconOnly ? "" : "px-3 py-1.5 "}text-sm`,
      size === "large" && `${iconOnly ? "" : "px-6 py-3 "}text-sm`,
      iconOnly && "p-0",
      iconOnly &&
        (size === "small"
          ? "w-6 h-6"
          : size === "medium"
          ? "h-8 w-8"
          : size === "large"
          ? "h-12 w-12"
          : "h-10 w-10"),
      !!icon && !!title && "space-x-2",
      shape === "circle" && "rounded-full",
      styling === "link" && `bg-transparent text-${color} hover:text-opacity-75`
    );

    if (asLink)
      return (
        /* eslint-disable-next-line */
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          {...(typeof asLink === "string" && {
            href: asLink,
            target: "_blank",
            rel: "noopener noreferrer",
          })}
          {...(href && { href })}
          className={className}
          onClick={onClick}
        >
          {icon}
          {title && <span>{title}</span>}
        </a>
      );

    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        aria-label={accessibilityLabel}
        onClick={onPress || onClick}
        className={className}
        disabled={disabled}
        type={type}
      >
        {icon}
        {title && <span>{title}</span>}
      </button>
    );
  }
);

export default Button;
