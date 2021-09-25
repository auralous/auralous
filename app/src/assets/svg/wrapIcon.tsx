import { Colors } from "@/styles/colors";
import type { FC } from "react";
import { memo } from "react";
import type { SvgProps } from "react-native-svg";

export const wrapIcon = (Icon: FC<SvgProps>) => {
  const WrappedIcon: FC<SvgProps> = (props) => (
    <Icon color={Colors.text} {...props} />
  );
  WrappedIcon.displayName = Icon.displayName;
  return memo(WrappedIcon);
};
