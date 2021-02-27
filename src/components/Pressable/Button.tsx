import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { forwardRef, ReactNode } from "react";
import { Linking, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import {
  colors,
  ImplicitSize,
  Size,
  size,
  stylesHeight,
  stylesPaddingHorizontal,
  stylesWidth,
} from "styles";

interface ButtonProps {
  color?: "primary" | "danger";
  onPress?: () => void;
  onClick?: () => void;
  title?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  size?: "xs" | "sm" | "lg" | "xl";
  shape?: "circle" | "round";
  styling?: "link" | "outline";
  href?: string;
  style?: ViewStyle;
}

const buttonBase = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: size(2),
    // @ts-ignore: web
    transition: "all .25s ease-in-out",
  },
  btnCircle: {
    borderRadius: 9999,
  },
  btnActive: {
    // @ts-ignore: web
    outline: "none",
  },
});

const buttonTheme = {
  default: StyleSheet.create({
    base: {
      backgroundColor: colors["buttonDark"],
    },
    active: {
      backgroundColor: colors["button"],
    },
  }),
  link: StyleSheet.create({
    base: {
      backgroundColor: "transparent",
    },
    active: {
      backgroundColor: "transparent",
      opacity: 0.75,
    },
  }),
  outline: StyleSheet.create({
    base: {
      backgroundColor: "transparent",
    },
    active: {
      backgroundColor: "transparent",
      opacity: 0.5,
      borderWidth: 2,
    },
  }),
  primary: StyleSheet.create({
    base: {
      backgroundColor: colors["primaryDark"],
    },
    active: {
      backgroundColor: colors["primary"],
    },
  }),
  danger: StyleSheet.create({
    base: {
      backgroundColor: colors["dangerDark"],
    },
    active: {
      backgroundColor: colors["danger"],
    },
  }),
};

const sizeStyleMap: Record<
  "xs" | "sm" | "md" | "lg" | "xl",
  [Size | "full", ImplicitSize]
> = {
  xs: [6, "sm"],
  sm: [8, "sm"],
  md: [10, "md"],
  lg: [12, "lg"],
  xl: [16, "xl"],
};

const Button = forwardRef<View, ButtonProps>(function Button(
  {
    color,
    onPress,
    onClick,
    title,
    icon,
    fullWidth,
    disabled,
    accessibilityLabel,
    size,
    shape,
    styling,
    href,
    style,
  },
  ref
) {
  const iconOnly = !!icon && !title;

  return (
    <Pressable
      accessibilityRole="button"
      ref={ref}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      style={(state) => {
        // @ts-ignore: Web specific type
        const active = state.pressed || state.hovered || state.focused;
        const tColor = styling || color || "default";
        return [
          buttonBase.btn,
          active && buttonBase.btnActive,
          active ? buttonTheme[tColor].active : buttonTheme[tColor].base,
          fullWidth && stylesWidth.full,
          stylesHeight[sizeStyleMap[size || "md"][0]],
          iconOnly
            ? stylesWidth[sizeStyleMap[size || "md"][0]]
            : stylesPaddingHorizontal[sizeStyleMap[size || "md"][1]],
          shape === "circle" && buttonBase.btnCircle,
          style,
        ];
      }}
      onPress={
        onPress || onClick || (href ? () => Linking.openURL(href) : undefined)
      }
    >
      {icon}
      {!!icon && !!title && <Spacer size={2} axis="horizontal" />}
      {title && (
        <Typography.Text
          color={
            styling
              ? color
              : color === "primary"
              ? "primaryLabel"
              : color === "danger"
              ? "dangerLabel"
              : "foreground"
          }
          strong
          size={size === "lg" ? "md" : size === "xl" ? "lg" : size}
        >
          {title}
        </Typography.Text>
      )}
    </Pressable>
  );

  // const className = clsx(
  //   "btn",
  //   color && `btn-${color}`,
  //   fullWidth && "w-full",
  //   size === "xs" && `${iconOnly ? "w-6" : "px-2"} h-6 text-xs`,
  //   size === "sm" && `${iconOnly ? "w-8" : "px-2"} h-8 text-sm`,
  //   size === "lg" && `${iconOnly ? "w-12" : "px-6"} h-12 text-md`,
  //   size === "xl" && `${iconOnly ? "w-16" : "px-8"} h-16 text-lg`,
  //   !size && `${iconOnly ? "w-10" : "px-4"} h-10`,
  //   iconOnly && "p-0",
  //   !!icon && !!title && "space-x-2",
  //   shape === "circle" && "rounded-full",

  // );

  // const elementNode = (
  //   <>
  //     {icon}
  //     {title && <Typography.Text>{title}</Typography.Text>}
  //   </>
  // );

  // if (asLink)
  //   return (
  //     /* eslint-disable-next-line */
  //     <a
  //       ref={ref as React.ForwardedRef<HTMLAnchorElement>}
  //       {...(typeof asLink === "string" && {
  //         href: asLink,
  //         target: "_blank",
  //         rel: "noopener noreferrer",
  //       })}
  //       {...(href && { href })}
  //       className={className}
  //       onClick={onClick}
  //       style={style}
  //     >
  //       {elementNode}
  //     </a>
  //   );

  // return (
  //   <button
  //     ref={ref as React.ForwardedRef<HTMLButtonElement>}
  //     aria-label={accessibilityLabel}
  //     onClick={onPress || onClick}
  //     className={className}
  //     disabled={disabled}
  //     type={type}
  //     style={style}
  //   >
  //     {elementNode}
  //   </button>
  // );
});

export default Button;
