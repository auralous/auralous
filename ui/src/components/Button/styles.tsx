import { Size } from "@/styles";
import type { ReactNode } from "react";
import { useMemo } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import type { BaseButtonProps } from "./types";

export const useStyles = ({
  children,
  icon,
  disabled,
}: BaseButtonProps & { children?: ReactNode }) =>
  useMemo<{ base: ViewStyle; text: TextStyle }>(
    () => ({
      base: {
        height: Size[10],
        minWidth: Size[10],
        paddingHorizontal: !!icon && !children ? 0 : Size[4],
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Size[16],
        overflow: "hidden",
        opacity: disabled ? 0.5 : 1,
      },
      text: {
        fontSize: 14,
      },
    }),
    [children, icon, disabled]
  );
