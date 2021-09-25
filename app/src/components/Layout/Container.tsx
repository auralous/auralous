import { LayoutSize } from "@/styles/spacing";
import type { FC } from "react";
import { memo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, useWindowDimensions, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    marginHorizontal: "auto",
    width: "100%",
  },
  rootLg: {
    width: LayoutSize.lg,
  },
  rootMd: {
    width: LayoutSize.md,
  },
});

const ContainerImpl: FC<{
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}> = ({ style, children }) => {
  const { width: windowWidth } = useWindowDimensions();
  const widthStyle =
    windowWidth >= LayoutSize.lg
      ? styles.rootLg
      : windowWidth >= LayoutSize.md
      ? styles.rootMd
      : undefined;
  return <View style={[styles.root, widthStyle, style]}>{children}</View>;
};

export const Container = memo(ContainerImpl);
