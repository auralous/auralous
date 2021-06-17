import { Size } from "@/styles";
import { StyleSheet } from "react-native";
import { BaseButtonProps } from "./types";

export const baseStyles = StyleSheet.create({
  base: {
    paddingVertical: Size[2],
    paddingHorizontal: Size[4],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Size[16],
    overflow: "hidden",
  },
  text: {
    fontWeight: "600",
    fontSize: 14,
  },
  iconOnly: {
    paddingHorizontal: Size[2],
  },
});

export const baseStyleFn = ({
  children,
  icon,
  disabled,
  style,
}: BaseButtonProps) => {
  return [
    baseStyles.base,
    !!icon && !children && baseStyles.iconOnly,
    disabled && { opacity: 0.5 },
    style,
  ];
};

export const baseStyleTextFn = ({ textStyle }: BaseButtonProps) => {
  return [baseStyles.text, textStyle];
};
