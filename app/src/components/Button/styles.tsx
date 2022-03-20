import { Size } from "@/styles/spacing";
import type { ReactNode } from "react";
import { useMemo } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import type { BaseButtonProps } from "./types";

export const useStyles = ({
  children,
  icon,
  disabled,
}: BaseButtonProps & { children?: ReactNode }) => {
  const hasChildren = children ? true : false;
  const hasIcon = icon ? true : false;
  return useMemo<{ base: ViewStyle; text: TextStyle }>(
    () =>
      StyleSheet.create({
        base: {
          alignItems: "center",
          borderRadius: Size[2],
          flexDirection: "row",
          height: Size[10],
          justifyContent: "center",
          minWidth: Size[10],
          opacity: disabled ? 0.5 : 1,
          overflow: "hidden",
          paddingHorizontal: !!hasIcon && !hasChildren ? 0 : Size[4],
        },
        text: {
          fontSize: 14,
        },
      }),
    [hasChildren, hasIcon, disabled]
  );
};
