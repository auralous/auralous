import { useColors } from "@/styles";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  pointerEvents,
}) => {
  const colors = useColors();
  return (
    <View
      pointerEvents={pointerEvents}
      style={[style, { backgroundColor: colors.backgroundSecondary }]}
    />
  );
};

export default CustomBackground;
