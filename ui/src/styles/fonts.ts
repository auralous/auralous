import type { TextStyle } from "react-native";
import { Platform } from "react-native";

export enum Font {
  Inter = "Inter",
}

const fontWeightCompat = {
  [Font.Inter]: {
    bold: "Inter-Bold",
    normal: "Inter-Regular",
    medium: "Inter-Medium",
  },
};

export const fontWithWeight = (
  fontFamily: Font,
  fontWeight: "bold" | "normal" | "medium"
): Pick<TextStyle, "fontFamily" | "fontWeight"> => {
  return Platform.OS === "web"
    ? {
        fontFamily: `'${fontFamily}', sans-serif`,
        fontWeight: fontWeight === "medium" ? "500" : fontWeight,
      }
    : {
        fontFamily: fontWeightCompat[fontFamily][fontWeight],
      };
};
