import { makeStyles, Size } from "@/styles";
import { ReactNode } from "react";
import { BaseButtonProps } from "./types";

export const useStyles = makeStyles(
  (
    theme,
    { children, icon, disabled }: BaseButtonProps & { children?: ReactNode }
  ) => ({
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
  })
);
