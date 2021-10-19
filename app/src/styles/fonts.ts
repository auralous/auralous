import type { TextStyle } from "react-native";
import { Platform } from "react-native";

export enum Font {
  NotoSans = "NotoSansDisplay",
}

// https://seek-oss.github.io/capsize/
export const fontMetrics = {
  [Font.NotoSans]: {
    capHeight: 714,
    ascent: 1069,
    descent: -293,
    lineGap: 0,
    unitsPerEm: 1000,
  },
};

const fontConfig = {
  [Font.NotoSans]: {
    normal: {
      normal: "NotoSansDisplay-Regular",
      italic: "NotoSansDisplay-Italic",
    },
    medium: {
      normal: "NotoSansDisplay-Medium",
      italic: "NotoSansDisplay-MediumItalic",
    },
    bold: {
      normal: "NotoSansDisplay-Bold",
      italic: "NotoSansDisplay-BoldItalic",
    },
    web: "Noto Sans Display",
  },
};

export const fontPropsFn = (
  fontFamily: Font,
  fontWeight: "bold" | "normal" | "medium",
  isItalic?: boolean
): Partial<TextStyle> => {
  return Platform.select({
    web: {
      fontFamily: `'${fontConfig[fontFamily].web}', sans-serif`,
      fontWeight: fontWeight === "medium" ? "500" : fontWeight,
      fontStyle: isItalic ? "italic" : undefined,
    },
    default: {
      fontFamily:
        fontConfig[fontFamily][fontWeight][isItalic ? "italic" : "normal"],
    },
  });
};
