import { Size } from "@/styles/spacing";
import { StyleSheet } from "react-native";

export const stylesMeta = StyleSheet.create({
  buttons: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    padding: Size[1],
  },
  image: {
    height: Size[40],
    marginBottom: 10,
    width: Size[40],
  },
  meta: {
    alignItems: "center",
    paddingVertical: Size[2],
    width: "100%",
  },
  root: {
    alignItems: "center",
    height: 320,
    paddingBottom: Size[3],
    paddingHorizontal: Size[6],
    paddingTop: 0,
  },
  tag: {
    flexDirection: "row",
    height: Size[4],
    justifyContent: "center",
    marginBottom: Size[2],
  },
});
