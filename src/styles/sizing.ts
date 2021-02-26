import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { ArrayElement } from "utils/types";

export const size = (val: number) => val * 4;

const commonSizes = [0, 1, 2, 4, 6, 8, 10, 12, 16] as const;

export type ImplicitSize = "xs" | "sm" | "md" | "lg" | "xl";

const sw = {
  full: { width: "100%" },
} as Record<Size | "full", ViewStyle | TextStyle>;
const sh = { full: { height: "100%" } } as Record<
  Size | "full",
  ViewStyle | TextStyle
>;

const implicitTinyMap: Record<ImplicitSize, Size> = {
  xs: 1,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
};

const px = {} as Record<ImplicitSize, ViewStyle | TextStyle>;
const py = {} as Record<ImplicitSize, ViewStyle | TextStyle>;

for (const commonSize of commonSizes) {
  sw[commonSize] = {
    width: size(commonSize),
  };
  sh[commonSize] = {
    height: size(commonSize),
  };
}

Object.keys(implicitTinyMap).map((key) => {
  px[key as ImplicitSize] = {
    paddingHorizontal: size(implicitTinyMap[key as ImplicitSize]),
  };
  py[key as ImplicitSize] = {
    paddingVertical: size(implicitTinyMap[key as ImplicitSize]),
  };
});

export const stylesMinHeight = StyleSheet.create({
  0: { minHeight: 0 },
});

export const stylesMinWidth = StyleSheet.create({
  0: { minWidth: 0 },
});

export const stylesWidth = StyleSheet.create(sw);
export const stylesHeight = StyleSheet.create(sh);

export const stylesPaddingHorizontal = StyleSheet.create(px);
export const stylesPaddingVertical = StyleSheet.create(py);

export type Size = ArrayElement<typeof commonSizes>;
