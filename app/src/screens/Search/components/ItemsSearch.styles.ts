import { Size } from "@/styles/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  horPad: {
    paddingHorizontal: Size[6],
  },
  item: {
    flex: 1,
    padding: Size[2],
    paddingHorizontal: Size[6],
  },
  itemOneCol: {
    paddingHorizontal: Size[6],
    paddingVertical: Size[2],
    width: "100%",
  },
  root: { flex: 1 },
});
