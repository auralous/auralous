import clsx from "clsx";
import { Typography } from "components/Typography";
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
      size === "xs" && `${iconOnly ? "w-6" : "px-2"} h-6 text-xs`,
      size === "sm" && `${iconOnly ? "w-8" : "px-2"} h-8 text-sm`,
      size === "lg" && `${iconOnly ? "w-12" : "px-6"} h-12 text-md`,
      size === "xl" && `${iconOnly ? "w-16" : "px-8"} h-16 text-lg`,
      !size && `${iconOnly ? "w-10" : "px-4"} h-10`,
      iconOnly && "p-0",
      !!icon && !!title && "space-x-2",
      shape === "circle" && "rounded-full",
      styling === "link" &&
        `hover:bg-transparent bg-none text-${
          color || "foreground"
        } hover:opacity-75`,
      styling === "outline" &&
        `bg-transparent bg-none hover:bg-transparent hover:bg-none text-${
          color || "foreground"
        } hover:opacity-50 border-2`
    );

    const elementNode = (
      <>
        {icon}
        {title && <Typography.Text>{title}</Typography.Text>}
      </>
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
          {elementNode}
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
        {elementNode}
      </button>
    );
  }
);

export default Button;
