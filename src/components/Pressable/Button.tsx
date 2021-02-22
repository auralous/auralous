import clsx from "clsx";
import { CSSProperties, forwardRef, ReactNode } from "react";

interface ButtonProps {
  color?: "primary" | "danger";
  onPress?: () => void;
  onClick?: () => void;
  title?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  type?: "button" | "submit" | "reset";
  asLink?: string | boolean;
  size?: "xs" | "sm" | "lg" | "xl";
  shape?: "circle" | "round";
  styling?: "link" | "outline";
  href?: string;
  style?: CSSProperties;
}

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  function Button(
    {
      type,
      color,
      onPress,
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
      style,
    },
    ref
  ) {
    const iconOnly = !!icon && !title;
    const className = clsx(
      "btn",
      color && `btn-${color}`,
      fullWidth && "w-full",
      size === "xs" && `${iconOnly ? "" : "px-2 py-1 "}text-xs`,
      size === "sm" && `${iconOnly ? "" : "px-2 py-1 "}text-sm`,
      size === "lg" && `${iconOnly ? "" : "px-6 py-3 "}text-md`,
      size === "xl" && `${iconOnly ? "" : "px-8 py-4 "}text-lg`,
      iconOnly && "p-0",
      iconOnly &&
        ((size === "xs" && "w-6 h-6") ||
          (size === "sm" && "w-8 h-8") ||
          (size === "lg" && "w-12 h-12") ||
          (size === "xl" && "w-16 h-16") ||
          "w-10 h-10"),
      !!icon && !!title && "space-x-2",
      shape === "circle" && "rounded-full",
      styling === "link" &&
        `bg-transparent text-${color} hover:text-opacity-75`,
      styling === "outline" &&
        `bg-transparent text-${color} hover:opacity-50 border-2`
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
          style={style}
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
        style={style}
      >
        {icon}
        {title && <span>{title}</span>}
      </button>
    );
  }
);

export default Button;
