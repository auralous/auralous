import { useColors } from "@auralous/ui/styles";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

const CustomBackground: FC<BottomSheetBackgroundProps> = ({
  style,
  pointerEvents,
}) => {
  const colors = useColors();
  return (
    <View
      pointerEvents={pointerEvents}
      style={StyleSheet.compose(
        { backgroundColor: colors.backgroundSecondary },
        style
      )}
    />
  );
};

export default CustomBackground;
