import { LayoutSize, Size } from "@/styles/spacing";
import type { FC } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, useWindowDimensions, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  rootLg: {
    paddingHorizontal: Size[12],
  },
  rootMd: {
    paddingHorizontal: Size[8],
  },
});

const ContainerImpl: FC<{
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}> = ({ style, children }) => {
  const { width: windowWidth } = useWindowDimensions();
  const paddingStyle =
    windowWidth >= LayoutSize.lg
      ? styles.rootLg
      : windowWidth >= LayoutSize.md
      ? styles.rootMd
      : undefined;
  return <View style={[styles.root, paddingStyle, style]}>{children}</View>;
};

export const useContainerStyle = () => {
  const { width: windowWidth } = useWindowDimensions();
  const paddingStyle =
    windowWidth >= LayoutSize.lg
      ? styles.rootLg
      : windowWidth >= LayoutSize.md
      ? styles.rootMd
      : undefined;
  return paddingStyle;
};

export const Container = ContainerImpl;
