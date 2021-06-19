import { useColors } from "@auralous/ui/styles";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { FC } from "react";
import { View } from "react-native";

const CustomBackground: FC<BottomSheetBackgroundProps> = ({
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
