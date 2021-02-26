import { StyleSheet } from "react-native";

export const stylesJustifyContent = StyleSheet.create({
  start: {
    justifyContent: "flex-start",
  },
  end: {
    justifyContent: "flex-end",
  },
  center: {
    justifyContent: "center",
  },
  between: {
    justifyContent: "space-between",
  },
  around: {
    justifyContent: "space-around",
  },
  evenly: {
    justifyContent: "space-evenly",
  },
});

export const stylesAlignItems = StyleSheet.create({
  stretch: {
    alignItems: "stretch",
  },
  start: {
    alignItems: "flex-start",
  },
  end: {
    alignItems: "flex-end",
  },
  center: {
    alignItems: "center",
  },
});

export type JustifyContent = keyof typeof stylesJustifyContent;

export type AlignItems = keyof typeof stylesAlignItems;
