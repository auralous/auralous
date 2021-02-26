import { StyleSheet } from "react-native";
import { size } from "./sizing";

export const stylesBorderRadius = StyleSheet.create({
  lg: {
    borderRadius: size(2),
  },
  full: {
    borderRadius: 9999,
  },
});
